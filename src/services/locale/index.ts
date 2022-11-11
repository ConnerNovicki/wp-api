import i18next from "i18next";
import translations, { TranslationKey } from "./translations";

export default class I18nService {
  constructor() {
    i18next.init({
      fallbackLng: "en",
      resources: {
        en: {
          translate: translations,
        },
      },
      debug: true,
    });
  }

  t(key: TranslationKey): string {
    return i18next.t(key);
  }
}
