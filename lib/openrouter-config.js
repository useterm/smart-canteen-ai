"use strict";

/**
 * Серверная конфигурация OpenRouter.
 *
 * ВАЖНО: этот файл выполняется только внутри Vercel Function / локального
 * Node-сервера. Ключ читается из переменной окружения и никогда не попадает
 * в HTML, JS браузера или публичный репозиторий.
 */
const OPENROUTER_CONFIG = Object.freeze({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  model: process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free",
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  appName: process.env.OPENROUTER_APP_NAME || "Smart Canteen AI",
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  timeoutMs: 28000,
  maxOutputTokens: 900
});

module.exports = OPENROUTER_CONFIG;
