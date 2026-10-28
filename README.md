# Умная столовая · AI

Интерактивный прототип школьной столовой для хакатона: опрос учеников, предзаказ, экономика столовой, генерация меню и живой ИИ-консультант на OpenRouter.

**Стек:** Vanilla HTML / CSS / JavaScript, Node.js serverless function для Vercel. Без React, CDN и сборщика.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/useterm/smart-canteen-ai)

## Что внутри

- **Опрос учеников** — оценки «Люблю / Нормально / Не доедаю», live-аналитика, сохранение в `localStorage`.
- **Предзаказ** — пошаговый бот: класс → блюда → уникальный номер; кухня сразу видит новые порции.
- **Панель столовой** — KPI, карта рисков, таблица отходов, калькулятор экономии на 9 учебных месяцев, экспорт `.txt` и печать.
- **ИИ-шеф** — системный промпт, генерация меню без блюд с отходами выше 30%, прогноз порций, AI-комментарий к меню.
- **Нейро-шеф** — чат-консультант, который знает текущие KPI и данные меню. Быстрые сценарии для жюри: сводка, замены блюд, экономика, план пилота.
- **Светлая / тёмная тема**, адаптив от 320 px, доступность, reduced motion, demo-ответы без сети.

## Локальный запуск

```bash
cd smart-canteen-ai
cp .env.example .env.local
# вставьте в .env.local реальный ключ OpenRouter
npm run dev
```

Откройте `http://localhost:3000`.

`npm run dev` поднимает маленький Node-сервер, отдаёт `index.html` и проксирует `/api/ai`. Ключ читается только на сервере.

Проверка синтаксиса:

```bash
npm run check
```

## Деплой на Vercel

1. Запушьте репозиторий на GitHub.
2. В [vercel.com/new](https://vercel.com/new) импортируйте репозиторий.
3. Framework Preset — **Other**. Build Command и Output Directory оставьте пустыми.
4. В **Environment Variables** добавьте:

   | Name | Value |
   |---|---|
   | `OPENROUTER_API_KEY` | новый ключ OpenRouter |
   | `OPENROUTER_MODEL` | `nvidia/nemotron-3-ultra-550b-a55b:free` |
   | `SITE_URL` | URL проекта на Vercel |
   | `OPENROUTER_APP_NAME` | `Smart Canteen AI` |

5. Deploy. Vercel автоматически найдёт `api/ai.js` и `index.html`.

### Почему нет `window.OPENROUTER_CONFIG`

Любой файл, который загружается браузером, и любой `window.*`-конфиг **видны пользователю** в DevTools. Если положить туда `apiKey`, он сразу утечёт — вместе с публичным репозиторием и статическим хостингом.

Поэтому ключ живёт только в серверной переменной окружения `OPENROUTER_API_KEY`. Браузер обращается к своему же защищённому прокси `/api/ai`, а уже функция на Vercel добавляет `Authorization` к запросу в OpenRouter. Серверный конфиг находится в `lib/openrouter-config.js`.

## Переменные окружения

```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
SITE_URL=https://your-project.vercel.app
OPENROUTER_APP_NAME=Smart Canteen AI
```

`.env.local` не коммитится и исключён из деплоя. `.env.example` — безопасный шаблон.

> **Важно:** если ключ уже публиковался в переписке, чате или коммите, перевыпустите его в кабинете OpenRouter. Новый ключ храните только в `.env.local` и Vercel Environment Variables.

## Структура

```
.
├── index.html               # весь интерфейс, стили и клиентская логика
├── api/ai.js                # serverless-прокси для OpenRouter
├── lib/openrouter-config.js # серверная конфигурация без ключа
├── server/dev.js            # локальный сервер для разработки
├── vercel.json              # лимиты функции и security headers
├── .env.example
└── package.json
```

## API

`GET /api/ai` — статус подключения (не раскрывает ключ).

`POST /api/ai`:

```json
{
  "context": "агрегированные KPI и данные меню",
  "messages": [{ "role": "user", "content": "Что исключить из меню?" }],
  "mode": "chat"
}
```

Ответ: `{ "reply": "...", "model": "...", "usage": { ... } }`.

## Ограничения демо

- Базовые данные опроса и предзаказов — демонстрационные; пользовательские голоса и заказы хранятся локально в браузере.
- Бесплатная модель OpenRouter может иметь лимиты и задержки. При отсутствии сети интерфейс показывает честный демо-ответ по текущим цифрам.
- Прототип не является медицинской или диетологической рекомендацией.
