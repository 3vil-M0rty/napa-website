// src/i18n/index.js
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import { env } from "../config/env.js";

// ── Translations ──────────────────────────────────────────
// To add a new language:
// 1. Add the code to SUPPORTED_LANGUAGES in .env
// 2. Create src/i18n/<code>.json
// 3. Import it below and add to `resources`
import en from "./en.json" assert { type: "json" };
import fr from "./fr.json" assert { type: "json" };
import ar from "./ar.json" assert { type: "json" };

const resources = { en: { translation: en }, fr: { translation: fr }, ar: { translation: ar } };

await i18next.use(i18nextMiddleware.LanguageDetector).init({
  resources,
  fallbackLng: env.i18n.defaultLanguage,
  supportedLngs: env.i18n.supportedLanguages,
  detection: {
    // Detect from: header Accept-Language OR ?lang= query OR x-language header
    order: ["querystring", "header"],
    lookupQuerystring: "lang",
    lookupHeader: "x-language",
    caches: false,
  },
  interpolation: { escapeValue: false },
});

export const i18nMiddleware = i18nextMiddleware.handle(i18next);
export default i18next;
