const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const axios = require('axios');
const { InferenceClient } = require('@huggingface/inference');
const {
  GEMINI_API_KEY,
  OPENAI_API_KEYS,
  OPENROUTER_API_KEY,
  HUGGINGFACE_API_FINEGRAINED_KEY
} = require('../config');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const hf = new InferenceClient(HUGGINGFACE_API_FINEGRAINED_KEY);

const messages = [
  { id: 1, text: 'Hi, how can I help you?', sender: 'ai' },
];

exports.getMessages = (req, res) => {
  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  console.log("Received message, sending to AI...");
  const { message, model } = req.body;

  try {
    let text;
    if (model.startsWith('gemini')) {
      const geminiModel = genAI.getGenerativeModel({ model });
      const result = await geminiModel.generateContent(message);
      const response = await result.response;
      text = response.text();
    } else if (model.startsWith('gpt')) {
      let response = null;
      const allKeys = [process.env.OPENAI_API_KEY, ...OPENAI_API_KEYS].filter(Boolean);

      for (const key of allKeys) {
        try {
          const openai = new OpenAI({ apiKey: key });
          const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: message }],
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

      if (response) {
        return res.json(response);
      } else {
        throw new Error('All OpenAI API keys failed.');
      }
    } else if (model.startsWith('openrouter/')) {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model.replace('openrouter/', ''),
          messages: [{ role: 'user', content: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          },
        }
      );
      text = response.data.choices[0].message.content;
    } else if (model.startsWith('huggingface/')) {
      try {
        const chatCompletion = await hf.chatCompletion({
            model: model.replace('huggingface/', ''),
            messages: [{ role: 'user', content: message }],
        });
        text = chatCompletion.choices[0].message.content;
      } catch (error) {
        console.error('HuggingFace API Error:', error);
        throw error;
      }
    }

    res.json({ text, model });
  } catch (error) {
    console.error('Error communicating with AI API:', error);
    res.status(500).json({ error: 'Error communicating with AI' });
  }
};
