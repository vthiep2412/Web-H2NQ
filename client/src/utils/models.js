// Happy coding :D!
// Happy coding :D
import { useTranslation } from 'react-i18next';

export const useModels = () => {
  const { t } = useTranslation();
  return [
    { eventKey: "gemini-2.5-pro", label: t("gemini25Pro") }, // chi nguyen
    { eventKey: "gemini-flash-latest", label: t("gemini25Flash") }, // be le
    { isDivider: true },
    { eventKey: "gemini-flash-lite-latest", label: t("gemini25FlashLite") },
    { eventKey: "gemma-3-27b-it", label: t("gemma327bit") },
    // { eventKey: "openrouter/deepseek/deepseek-r1-distill-llama-70b:free", label: "Deepseek R1 Llama 70b" },
    // { eventKey: "openrouter/deepseek/deepseek-chat-v3.1:free", label: "Deepseek v3.1" },
    // { eventKey: "openrouter/google/gemma-3-12b-it:free", label: t("gemma312b") },
    // { eventKey: "openrouter/qwen/qwen3-30b-a3b:free", label: "Qwen3 30B A3B" },
    // { eventKey: "openrouter/openai/gpt-oss-20b:free", label: "OpenAI GPT-OSS 20B" },
    // { eventKey: "openrouter/x-ai/grok-4-fast:free", label: "X-AI Grok-4 Fast" },
    // { eventKey: "openrouter/qwen/qwen3-coder:free", label: "Qwen3 Coder" },
    // { eventKey: "openrouter/moonshotai/kimi-k2:free", label: "MoonshotAI Kimi K2" },
    // { eventKey: "openrouter/qwen/qwen-2.5-72b-instruct:free", label: "Qwen 2.5 72B Instruct" },
    // { eventKey: "openrouter/meta-llama/llama-4-maverick:free", label: "Meta Llama 4 Maverick" },
    // { isDivider: true },
    // { eventKey: "huggingface/mistralai/Mistral-7B-Instruct-v0.2", label: "HF: Mistral 7B" },
  ];
};

export const getLabelForModel = (modelKey, t) => {
  const models = [
    { eventKey: "gemini-2.5-pro", label: t("gemini25Pro") },
    { eventKey: "gemini-flash-latest", label: t("gemini25Flash") },
    { isDivider: true },
    { eventKey: "gemini-flash-lite-latest", label: t("gemini25FlashLite") },
    { eventKey: "gemma-3-27b-it", label: t("gemma327bit") },
  ];
  const model = models.find((m) => m.eventKey === modelKey);
  return model ? model.label : modelKey;
};

export const useLabelForModel = () => {
  const { t } = useTranslation();
  return (modelKey) => getLabelForModel(modelKey, t);
};