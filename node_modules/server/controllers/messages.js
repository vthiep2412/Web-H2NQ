const OpenAI = require('openai');
const axios = require('axios');
const { InferenceClient } = require('@huggingface/inference');
const { GEMINI_API_KEY, OPENAI_API_KEYS, OPENROUTER_API_KEY, HUGGINGFACE_API_FINEGRAINED_KEY } = require('../config');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const hf = new InferenceClient(HUGGINGFACE_API_FINEGRAINED_KEY);

const messages = [
  { id: 1, text: 'Hi, how can I help you?', sender: 'ai' },
];

exports.getMessages = (req, res) => {
  res.json(messages);
};

const truncateHistory = (history, maxLength) => {
  let totalLength = history.reduce((sum, msg) => sum + msg.content.length, 0);
  let truncated = false;
  while (totalLength > maxLength && history.length > 0) {
    const removedMessage = history.shift(); // Remove the oldest message
    totalLength -= removedMessage.content.length;
    truncated = true;
  }
  return { history, truncated };
};

exports.sendMessage = async (req, res) => {
  console.log("Received message, sending to AI...");
  const { message, model, history, conversationId, memories, workspaceId } = req.body;
  const userId = req.user.id;

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const user = await User.findById(userId);
    if (!user || user.tokenLeft <= 0) {
      return res.status(403).json({ error: 'You have no tokens left.' });
    }

    const MAX_CONTEXT_LENGTH = user.tier === 'free' ? 256000 : 1000000;

    let fullHistory = [...history];
    if (memories && memories.length > 0) {
      const memorySystemPrompt = {
        role: 'system',
        content: `Please follow these rules when responding:
${memories.map(mem => `- ${mem.text}`).join('\n')}`
      };
      fullHistory.unshift(memorySystemPrompt);
    }

    const { history: truncatedHistory, truncated } = truncateHistory(fullHistory, MAX_CONTEXT_LENGTH);

    const startTime = Date.now();
    let text;
    let thoughts = [];
    if (model.startsWith('gemini')) {
      const systemInstruction = truncatedHistory.find(msg => msg.role === 'system')?.content;
      const historyWithoutSystem = truncatedHistory.filter(msg => msg.role !== 'system');

      const geminiHistory = historyWithoutSystem.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const contents = [...geminiHistory, { role: 'user', parts: [{ text: message }] }];

      const config = {
        thinkingConfig: {
          thinkingBudget: -1,
          includeThoughts: true,
        },
        tools: [{ googleSearch: {} }],
        candidateCount: 1,
        temperature: 1,
      };

      const responseStream = await genAI.models.generateContentStream({
        model: model,
        config,
        contents,
        systemInstruction,
      });

      let accumulatedText = "";
      for await (const chunk of responseStream) {
          if (chunk.thoughtSummary) {
              thoughts.push({ thoughtSummary: chunk.thoughtSummary });
          }
          for (const candidate of chunk.candidates) {
              for (const part of candidate.content.parts) {
                  if (part.text) {
                      accumulatedText += part.text;
                  }
                  if (part.functionCall) {
                      thoughts.push(part.functionCall);
                  }
                  if (part.thought) {
                      thoughts.push({ thought: part.text });
                  }
              }
          }
      }
      text = accumulatedText;

      if (thoughts && thoughts.length > 0) {
        // console.log("AI Thoughts:", JSON.stringify(thoughts, null, 2));
      } else {
        // console.log("No thoughts found for this response.");
      }
    } else if (model.startsWith('gpt')) {
      let response = null;
      const allKeys = [process.env.OPENAI_API_KEY, ...OPENAI_API_KEYS].filter(Boolean);
      const openAIMessages = [...truncatedHistory, { role: 'user', content: message }];
      for (const key of allKeys) {
        try {
          const openai = new OpenAI({ apiKey: key });
          const completion = await openai.chat.completions.create({
            messages: openAIMessages,
            model,
          });
          if (!completion || !completion.choices || completion.choices.length === 0) {
            throw new Error('OpenAI API returned an unexpected response format (no choices).');
          }
          text = completion.choices[0].message.content;
          response = { text, model };
          break; // Success, exit loop
        } catch (error) {
          console.error('Error with API key, trying next one...', error.message);
        }
      }
      if (!response) {
        throw new Error('All OpenAI API keys failed.');
      }
    } else if (model.startsWith('openrouter/')) {
      const openRouterMessages = [...truncatedHistory, { role: 'user', content: message }];
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model.replace('openrouter/', ''),
          messages: openRouterMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          },
        }
      );
      text = response.data.choices[0].message.content;
    } else if (model.startsWith('huggingface/')) {
      const hfMessages = [...truncatedHistory, { role: 'user', content: message }];
      const chatCompletion = await hf.chatCompletion({
        model: model.replace('huggingface/', ''),
        messages: hfMessages,
      });
      text = chatCompletion.choices[0].message.content;
    }
    const thinkingTime = (Date.now() - startTime) / 1000;

    user.tokenLeft -= 1;
    await user.save();

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.messages.push({ role: 'user', content: message });
        conversation.messages.push({ role: 'assistant', content: text, model, thinkingTime, thoughts });
        await conversation.save();
      }
    } else {
      const conversationCount = await Conversation.countDocuments({ userId });
      if (conversationCount >= 5) {
        const oldestConversation = await Conversation.findOne({ userId }).sort({ createdAt: 1 });
        await oldestConversation.deleteOne();
      }

      const titlePrompt = `Generate a short, concise title for a conversation that starts with this message: "${message}". The title should be no more than 5 words.`;
      const titleResult = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: titlePrompt }] }],
      });
      const titleResponse = await titleResult.response;
      let title = 'New Conversation'; // Default title in case of API error
      if (titleResponse && titleResponse.text) {
        title = titleResponse.text().trim().replace(/"/g, '');
      } else {
        console.error('Failed to generate title from AI, using default title.');
      }

      conversation = new Conversation({
        userId,
        workspaceId,
        title,
        messages: [
          { role: 'user', content: message },
          { role: 'assistant', content: text, model, thinkingTime, thoughts },
        ],
      });
      await conversation.save();
    }

    res.json({ text, model, conversation, user, thinkingTime, truncated, thoughts });
  } catch (error) {
    console.error('Error communicating with AI API:', error);
    res.status(500).json({ error: 'Error communicating with AI' });
  }
};