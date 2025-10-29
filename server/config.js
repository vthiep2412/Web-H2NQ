// Happy coding :D!
// Happy coding :D
module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_API_KEYS: process.env.OPENAI_API_KEYS ? process.env.OPENAI_API_KEYS.split(',') : [],
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  HUGGINGFACE_API_READ_KEY: process.env.HUGGINGFACE_API_READ_KEY,
  HUGGINGFACE_API_FINEGRAINED_KEY: process.env.HUGGINGFACE_API_FINEGRAINED_KEY
};