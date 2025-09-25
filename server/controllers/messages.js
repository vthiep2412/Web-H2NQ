const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const { GEMINI_API_KEY, OPENAI_API_KEY } = require('../config');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

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
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model,
      });
      text = completion.choices[0].message.content;
    }

    res.json({ text, model });
  } catch (error) {
    console.error('Error communicating with AI API:', error);
    res.status(500).json({ error: 'Error communicating with AI' });
  }
};
