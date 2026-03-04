# Шифу Панда — Сайт спортивного центра

Полнофункциональный веб-сайт спортивного центра с системой управления контентом (CMS).

## 🚀 Возможности

- **Главная страница** — расписание, цены, программы, тренеры, новости, контакты
- **Программы тренировок** — карточки с описанием, тренерами, расписанием и галереей
- **Тренеры** — профили с опытом, специализацией и фотоальбомом
- **Расписание** — два режима: картинка и интерактивная таблица
- **Новости** — публикация событий центра
- **Админ-панель** — управление всем контентом без кода
- **Автозагрузка** — импорт программ и тренеров с Яндекс.Диска

## 🛠 Технологии

- **Frontend:** Next.js 16, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **База данных:** JSON-файл (db.json)
- **Изображения:** Локальная папка public/uploads

## 📋 Структура проекта

```
shifu-panda/
├── public/
│   ├── uploads/          # Загруженные изображения
│   ├── yandex-data/      # Данные с Яндекс.Диска
│   └── *.jpg             # Статические изображения
├── src/
│   ├── app/
│   │   ├── page.tsx              # Главная страница
│   │   ├── schedule/             # Страница расписания
│   │   ├── programs/[id]/        # Страница программы
│   │   ├── trainers/[id]/        # Страница тренера
│   │   ├── admin/                # Админ-панель
│   │   └── api/                  # API endpoints
│   ├── components/
│   │   ├── home/                 # Компоненты главной
│   │   ├── admin/                # Компоненты админки
│   │   └── ui/                   # UI компоненты
│   └── lib/
│       ├── db.ts                 # Работа с БД
│       └── programParser.ts      # Парсинг программ
├── db.json                       # База данных
└── package.json                  # Зависимости
```

## 🚀 Запуск

### Установка зависимостей
```bash
cd shifu-panda
npm install
```

### Запуск dev-сервера
```bash
npm run dev
```
Откроется на http://localhost:3000

### Сборка для продакшена
```bash
npm run build
npm start
```

## 📝 Структура базы данных (db.json)

```json
{
  "logo": "/path/to/logo.png",
  "sliders": [
    { "id": 1, "title": "Заголовок", "image": "/uploads/slider.jpg", "interval": 5 }
  ],
  "schedule": [
    { "id": 1, "image": "/расписание1.jpg" }
  ],
  "prices": [
    { "id": 1, "image": "/цены1.jpg" }
  ],
  "programs": [
    {
      "id": 1,
      "name": "Название программы",
      "description": "Описание",
      "image": "/uploads/main.jpg",
      "photoAlbum": [
        { "image": "/uploads/photo1.jpg", "caption": "Фото 1" }
      ],
      "trainers": ["id тренера"],
      "workouts": [
        { "day": "Понедельник", "time": "10:00", "params": [] }
      ]
    }
  ],
  "trainers": [
    {
      "id": 1,
      "name": "Имя тренера",
      "image": "/uploads/trainer.jpg",
      "experience": "Опыт",
      "specialization": "Специализация",
      "description": "Биография",
      "photoAlbum": []
    }
  ],
  "news": [
    {
      "id": 1,
      "title": "Заголовок",
      "text": "Текст",
      "image": "/uploads/news.jpg"
    }
  ],
  "contacts": {
    "address": "Адрес",
    "phone": "+7 (999) 000-00-00",
    "email": "email@mail.ru",
    "vk": "https://vk.com/...",
    "telegram": "https://t.me/..."
  },
  "sections": [
    { "id": "schedule", "title": "Расписание", "background": "yellow-orange" }
  ]
}
```

## 🔧 API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/db` | Получить все данные |
| POST | `/api/db` | Сохранить данные |
| GET | `/api/programs/[id]` | Получить программу |
| GET | `/api/trainers/[id]` | Получить тренера |
| POST | `/api/admin/autoupload` | Автозагрузка с Яндекс.Диска |
| POST | `/api/send-email` | Отправить заявку |

## 👥 Разработка

- **Ветка по умолчанию:** main
- **Стиль кода:** TypeScript + Tailwind CSS
- **Форматирование:** автоматическое через ESLint

## 📄 Лицензия

Собственная разработка.
