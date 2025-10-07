export const models = [
  { eventKey: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { eventKey: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { isDivider: true },
  { eventKey: "openrouter/google/gemma-3-12b-it:free", label: "Gemma 3 12B" },
];

export const getLabelForModel = (modelKey) => {
  const model = models.find(m => m.eventKey === modelKey);
  return model ? model.label : modelKey;
}