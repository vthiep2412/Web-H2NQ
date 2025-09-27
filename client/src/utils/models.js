export const models = [
  { eventKey: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { eventKey: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { isDivider: true },
  { eventKey: "openrouter/deepseek/deepseek-r1:free", label: "Deepseek R1" },
  { eventKey: "openrouter/deepseek/deepseek-r1-distill-llama-70b:free", label: "Deepseek R1 Llama 70b" },
  { eventKey: "openrouter/deepseek/deepseek-chat-v3.1:free", label: "Deepseek v3.1" },
  { eventKey: "openrouter/mistralai/mistral-7b-instruct:free", label: "Mistral 7B Instruct" },
  { eventKey: "openrouter/google/gemma-3-12b-it:free", label: "Gemma 3 12B" },
  { isDivider: true },
  { eventKey: "huggingface/mistralai/Mistral-7B-Instruct-v0.2", label: "HF: Mistral 7B" },
];

export const getLabelForModel = (modelKey) => {
  const model = models.find(m => m.eventKey === modelKey);
  return model ? model.label : modelKey;
}