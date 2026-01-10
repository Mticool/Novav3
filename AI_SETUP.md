# 🤖 AI Integration Setup

## Шаг 1: Создай .env файл

В корне проекта создай файл `.env` (он уже в .gitignore):

```env
# OpenAI API Key для улучшения промптов
VITE_OPENAI_API_KEY=your_openai_key_here

# Fal.ai API Key для генерации изображений и видео
VITE_FAL_KEY=your_fal_key_here
```

## Шаг 2: Перезапусти dev server

```bash
# Останови текущий сервер (Ctrl+C)
# Затем запусти снова:
npm run dev
```

## Шаг 3: Протестируй AI генерацию!

### ✨ Улучшение промпта (OpenAI GPT-4)
1. Создай **Text Node**
2. Введи промпт: "a cat"
3. Кликни **"Improve with AI"**
4. Промпт станет детальнее: "A majestic cat with fluffy fur, sitting gracefully..."

### 🖼️ Генерация изображения (Fal.ai Flux)
1. Создай **Text Node** с промптом
2. Создай **Image Node**
3. Соедини: Text → Image
4. Кликни **"Generate Image"** в Image Node
5. Через 2-5 секунд появится изображение!

### 🎥 Генерация видео (Fal.ai Luma)
**Вариант 1: Из изображения**
1. Создай **Image Node** с сгенерированным изображением
2. Создай **Video Node**
3. Соедини: Image → Video
4. Кликни **"Generate Video"**
5. Через 30-60 секунд появится видео!

**Вариант 2: Из текста**
1. Создай **Text Node** с промптом
2. Создай **Video Node**
3. Соедини: Text → Video
4. Кликни **"Generate Video"**

## 🎯 Примеры промптов

### Для изображений:
```
a futuristic city at sunset, cyberpunk style, neon lights, 8k
a magical forest with glowing mushrooms, fantasy art
portrait of a robot artist painting, studio lighting
```

### Для видео:
```
camera slowly zooming into a magical portal
waves crashing on a beach at golden hour
time lapse of flowers blooming
```

## 🔐 Безопасность

⚠️ **ВАЖНО**: Файл `.env` уже добавлен в `.gitignore`!
- НЕ коммить .env в git
- НЕ делиться API ключами
- Для продакшена используй backend API

## 📊 API Лимиты

### OpenAI:
- GPT-4: ~$0.03 за 1K токенов
- Лимит: зависит от твоего аккаунта

### Fal.ai:
- Flux Schnell (image): ~$0.003 за изображение
- Luma Dream Machine (video): ~$0.05 за видео
- Проверь баланс: https://fal.ai/dashboard

## 🐛 Troubleshooting

### "API key not found"
- Проверь, что `.env` файл создан
- Перезапусти dev server
- Проверь, что ключи правильные

### "Rate limit exceeded"
- Подожди 1 минуту
- Проверь квоты на https://platform.openai.com/usage

### "Generation failed"
- Проверь консоль браузера (F12)
- Проверь промпт (не пустой?)
- Проверь, что ноды связаны

## 🚀 Что работает:

✅ OpenAI GPT-4 для улучшения промптов
✅ Fal.ai Flux Schnell для генерации изображений
✅ Fal.ai Luma Dream Machine для генерации видео
✅ Loading states со спиннерами
✅ Error handling с сообщениями
✅ Progress indicators

## 📚 Документация:

- OpenAI API: https://platform.openai.com/docs
- Fal.ai Models: https://fal.ai/models
- Flux Schnell: https://fal.ai/models/fal-ai/flux/schnell
- Luma Dream Machine: https://fal.ai/models/fal-ai/luma-dream-machine

