"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const translations_1 = __importDefault(require("./translations"));
class I18nService {
    constructor() {
        i18next_1.default.init({
            fallbackLng: "en",
            resources: {
                en: {
                    translate: translations_1.default,
                },
            },
            debug: true,
        });
    }
    t(key) {
        return i18next_1.default.t(key);
    }
}
exports.default = I18nService;
