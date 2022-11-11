import { config as registerConfig } from "./register";

const translations = {
  ...registerConfig,
};

export default translations;
export type TranslationKey = keyof typeof translations;
