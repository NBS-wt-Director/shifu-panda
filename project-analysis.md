# 🎯 Полный анализ проекта "Шифу Панда"

**Дата:** 17.03.2026

**Статистика:**
| Тип | Количество |
|----|------------|
| 📁 Все файлы | **250+** |
| 📄 Текстовые | **150+** |
| 🖼️ Медиа | **50+** |
| 📏 Строк кода | **18 000+** |
| 🎨 UI компонентов | **60+** |

---

## 🗂️ Структура проекта

```
shifu-panda/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Главная страница
│   │   ├── admin/              # Админ-панель
│   │   ├── contacts/           # Страница контактов
│   │   ├── programs/           # Программы (каталог + детали)
│   │   ├── schedule/           # Расписание
│   │   ├── trainers/           # Тренеры (каталог + детали)
│   │   ├── lk/                 # Личный кабинет
│   │   ├── error.tsx           # Страница ошибки
│   │   ├── not-found.tsx       # Страница 404
│   │   ├── layout.tsx          # Корневой layout
│   │   ├── globals.css         # Глобальные стили
│   │   └── api/                # API маршруты
│   │       ├── db/             # Работа с БД
│   │       ├── upload/         # Загрузка файлов
│   │       ├── send-email/     # Отправка писем
│   │       ├── error-report/   # Сообщения об ошибках
│   │       ├── programs/       # API программ
│   │       ├── trainers/       # API тренеров
│   │       ├── employees/      # API сотрудников
│   │       ├── workouts/       # API тренировок
│   │       ├── autoupload/     # Автозагрузка
│   │       └── admin/          # Админские функции
│   │           ├── stats/      # Статистика
│   │           ├── news/       # Новости
│   │           ├── yandex-disk/# Яндекс.Диск
│   │           └── ...
│   ├── components/
│   │   ├── ui/                 # Переиспользуемые UI компоненты
│   │   ├── home/               # Компоненты главной страницы
│   │   └── admin/              # Компоненты админ-панели
├── public/
│   └── uploads/                # Загруженные изображения
├── db.json                     # База данных
├── package.json                # Зависимости
└── next.config.js              # Конфигурация Next.js
```

---

## 🌐 Публичные страницы

| Страница | URL | Описание |
|----------|-----|----------|
| Главная | `/` | Слайдер, секции с программами, тренерами, новостями |
| Программы | `/programs` | Каталог программ тренировок |
| Программа | `/programs/[id]` | Детали программы с фотоальбомом |
| Тренеры | `/trainers` | Список тренеров и персонала |
| Тренер | `/trainers/[id]` | Профиль тренера |
| Расписание | `/schedule` | Расписание занятий |
| Контакты | `/contacts` | Контакты, карта, соцсети |
| Личный кабинет | `/lk` | Авторизация, абонементы |

---

## ⚙️ Админ-панель

| Вкладка | Описание |
|---------|----------|
| Хедер | Настройка заголовка, анимаций, компонентов |
| Слайдер | Управление слайдами главной |
| Расписание и Цены | Загрузка изображений |
| Тренировки | Управление тренировками |
| Программы | CRUD программ тренировок |
| Сотрудники | Тренеры и персонал |
| Новости | Публикация новостей |
| Контакты | Основные контакты |
| Доп. контакты | Соцсети, Яндекс.Карта |
| Разделы | Порядок секций на главной |
| Разделители | Оформление разделителей |
| Настройки | SMTP, логотип, favicon |
| Статистика | Посещаемость |
| Автозагрузка | Импорт с Яндекс.Диска |
| Файлы | Управление файлами |

---

## 🧩 Компоненты

### UI компоненты (30+)
- `SiteHeader` - шапка с настраиваемыми компонентами
- `Footer` - подвал
- `ProgramCard`, `TrainerCard`, `NewsCard` - карточки
- `Slider`, `NewsCarousel` - карусели
- `CallModal`, `FullScreenImageModal` - модальные окна
- `SectionSpacer`, `GridSettings` - настройки отображения
- `StatsCollector` - сбор статистики
- `FileInput` - загрузка файлов

### Home компоненты (10+)
- `HomeSlider`, `HomeSchedule`, `HomePrices`
- `HomePrograms`, `HomeTrainers`, `HomeNews`, `HomeContacts`

### Admin компоненты (25+)
- `AdminHeader`, `AdminTabs` - навигация
- `AdminSlider`, `AdminPrograms`, `AdminStaffPrograms` - управление контентом
- `AdminSections`, `AdminDividers` - структура
- `AdminSettings`, `AdminHeaderSettings` - настройки
- `AdminStats`, `AutoUpload`, `AdminStorage` - инструменты

---

## 🔧 API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET/POST | `/api/db` | База данных |
| GET/POST | `/api/programs` | Программы |
| GET | `/api/programs/[id]` | Программа |
| GET/POST | `/api/trainers` | Тренеры |
| GET | `/api/trainers/[id]` | Тренер |
| POST | `/api/upload` | Загрузка файла |
| POST | `/api/send-email` | Отправить email |
| GET/POST | `/api/admin/stats` | Статистика |
| POST | `/api/autoupload` | Автозагрузка |

---

## 💾 Структура БД (db.json)

```json
{
  "siteSettings": { "logo": "", "favicon": "", "autoupload": {}, "yandexClientId": "" },
  "sliders": [{ "id": 1, "title": "", "image": "", "interval": 5, "position": "center" }],
  "sliderSettings": { "textPositionMode": "static", "staticPosition": "bottom-right" },
  "schedule": [], "prices": [],
  "sections": [{ "id": "prices", "title": "Наши цены", "background": "indigo-purple", "cols": 1 }],
  "globalDivider": { "enabled": true, "height": "md", "background": "gradientGreen", "textContent": "🏃", "fontSize": "small" },
  "programs": [], "trainers": [], "staff": [], "news": [],
  "contacts": { "address": "", "phone": "", "email": "", "vk": "", "telegram": "", "social": [] },
  "additionalContacts": { "enabled": true, "title": "", "groups": [], "yandexMap": {} },
  "headerSettings": { "titleSuffix": "", "componentsEnabled": {}, "componentsOrder": [], "homeMenuEnabled": true, "logoAnimation": "none", "secondLineText": "", "secondLineAnimation": "none" },
  "emailConfig": { "smtpHost": "", "smtpPort": 465, "smtpSecure": true, "smtpUser": "", "smtpPass": "", "fromName": "", "adminEmail": "", "errorEmail": [] }
}
```

---

## ⚙️ Настройки хедера

- **titleSuffix** - суффикс для `<title>`
- **componentsEnabled** - вкл/выкл: callButton, pageTitle, menu
- **componentsOrder** - порядок: logo, pageTitle, callButton, menu
- **homeMenuEnabled** - меню разделов на главной
- **logoAnimation** - анимация лого: none, pulse, bounce, rotate
- **secondLineText** - текст второй строки
- **secondLineAnimation** - анимация: none, fade, slide, typewriter

---

## 🚀 Запуск

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Продакшен
npm start
```

---

## 📝 Технологии

- **Frontend:** Next.js 14, React 18, TypeScript
- **Стили:** Tailwind CSS + CSS Modules
- **База данных:** JSON (LowDB)
- **Облако:** Яндекс.Диск для автозагрузки
- **Иконки:** Lucide React

```

## 🏆 Топ-10 файлов

| # | Файл | Строк | KB |
|----|------|-------|----|
| 1 | `src/components/admin/AdminStaffPrograms.tsx` | 565 | 20.8 |
| 2 | `src/components/admin/AdminPrograms.module.css` | 475 | 9.5 |
| 3 | `src/components/admin/AdminSchedulePrices.tsx` | 395 | 12.8 |
| 4 | `src/components/admin/AdminPrograms.tsx` | 369 | 12.4 |
| 5 | `src/components/admin/AdminStaffPrograms.module.css` | 368 | 7.1 |
| 6 | `src/components/admin/AdminSchedulePrices.module.css` | 336 | 7.7 |
| 7 | `src/components/admin/AdminNews.module.css` | 334 | 6.5 |
| 8 | `src/components/admin/AdminSettings.tsx` | 325 | 10.9 |
| 9 | `src/app/trainers/[id]/page.tsx` | 308 | 13.3 |
| 10 | `src/app/admin/page.tsx` | 301 | 9.4 |

## 🚨 Одинокие UI компоненты (10)

- `scripts/analyze.js`
- `src/lib/utils.ts`
- `src/components/Metadata.tsx`
- `src/components/Footer.tsx`
- `src/components/ui/TrainersGrid.tsx`
- `src/components/ui/ScheduleSection.tsx`
- `src/components/ui/NewsCarousel.tsx`
- `src/components/ui/ContactsSection.tsx`
- `src/components/ui/CallForm.tsx`
- `src/components/admin/AuthForm.tsx`
