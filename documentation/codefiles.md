# Code Files Documentation

**Обновлено:** 17.03.2026

---

## 📊 Статистика

| Тип | Количество |
|-----|------------|
| 📁 Файлов проекта | **250+** |
| 📏 Строк кода | **18 000+** |
| 🎨 Компонентов | **60+** |
| 🔧 API Routes | **25+** |

---

## 📁 Структура проекта

```
shifu-panda/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Главная страница
│   │   ├── admin/              # Админ-панель
│   │   ├── contacts/           # Контакты
│   │   ├── programs/           # Программы
│   │   ├── schedule/           # Расписание
│   │   ├── trainers/           # Тренеры
│   │   ├── lk/                 # Личный кабинет
│   │   ├── api/                # API Routes
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Глобальные стили
│   │   └── error.tsx / not-found.tsx
│   ├── components/
│   │   ├── ui/                 # UI компоненты
│   │   ├── home/               # Компоненты главной
│   │   └── admin/              # Компоненты админки
├── public/uploads/             # Загруженные файлы
├── db.json                     # База данных
└── package.json
```

---

## 📄 Страницы (app/)

| Файл | Описание |
|------|----------|
| `page.tsx` | Главная страница с секциями |
| `admin/page.tsx` | Админ-панель |
| `programs/page.tsx` | Каталог программ |
| `programs/[id]/page.tsx` | Детали программы |
| `trainers/page.tsx` | Каталог тренеров |
| `trainers/[id]/page.tsx` | Профиль тренера |
| `schedule/page.tsx` | Расписание |
| `contacts/page.tsx` | Контакты |
| `lk/page.tsx` | Личный кабинет |
| `layout.tsx` | Корневой layout |
| `globals.css` | Глобальные стили Tailwind |

---

## 🔌 API Routes

### Основные
| Маршрут | Описание |
|---------|----------|
| `api/db/route.ts` | Получение/сохранение БД |
| `api/programs/route.ts` | Программы |
| `api/programs/[id]/route.ts` | Программа по ID |
| `api/trainers/route.ts` | Тренеры |
| `api/trainers/[id]/route.ts` | Тренер по ID |
| `api/employees/route.ts` | Сотрудники |
| `api/workouts/route.ts` | Тренировки |

### Утилиты
| Маршрут | Описание |
|---------|----------|
| `api/upload/route.ts` | Загрузка файлов |
| `api/send-email/route.ts` | Отправка email |
| `api/error-report/route.ts` | Ошибки |
| `api/autoupload/route.ts` | Автозагрузка |

### Админ
| Маршрут | Описание |
|---------|----------|
| `api/admin/stats/route.ts` | Статистика |
| `api/admin/news/route.ts` | Новости |
| `api/admin/yandex-disk/*` | Яндекс.Диск |

---

## 🧩 UI Компоненты

### Основные
| Компонент | Файл |
|-----------|------|
| `SiteHeader` | `ui/SiteHeader.tsx` + `.module.css` |
| `Footer` | `Footer.tsx` |
| `GridSettings` | `ui/GridSettings.tsx` |
| `SectionSpacer` | `ui/SectionSpacer.tsx` + `.module.css` |
| `CallModal` | `ui/CallModal.tsx` + `.module.css` |
| `FullScreenImageModal` | `ui/FullScreenImageModal.tsx` + `.module.css` |
| `GlobalPreloader` | `ui/GlobalPreloader.tsx` + `.module.css` |
| `StatsCollector` | `ui/StatsCollector.tsx` |

### Карточки
| Компонент | Файл |
|-----------|------|
| `ProgramCard` | `ui/ProgramCard.tsx` + `.module.css` |
| `TrainerCard` | `ui/TrainerCard.tsx` + `.module.css` |
| `NewsCard` | `ui/NewsCard.tsx` + `.module.css` |

### Другие
| Компонент | Файл |
|-----------|------|
| `Slider` | `ui/Slider.tsx` |
| `NewsCarousel` | `ui/NewsCarousel.tsx` |
| `ScheduleSection` | `ui/ScheduleSection.tsx` |
| `ContactsSection` | `ui/ContactsSection.tsx` |
| `ActionButtons` | `ui/ActionButtons.tsx` + `.module.css` |
| `FileInput` | `ui/FileInput.tsx` + `.module.css` |
| `Accordion` | `ui/Accordion.tsx` + `.module.css` |

---

## 🏠 Home Компоненты

| Компонент | Файл |
|-----------|------|
| `HomeSlider` | `home/HomeSlider.tsx` + `.module.css` |
| `HomeSchedule` | `home/HomeScheduleNew.tsx` + `.module.css` |
| `HomePrices` | `home/HomePrices.tsx` + `.module.css` |
| `HomePrograms` | `home/HomePrograms.tsx` + `.module.css` |
| `HomeTrainers` | `home/HomeTrainers.tsx` + `.module.css` |
| `HomeNews` | `home/HomeNews.tsx` + `.module.css` |
| `HomeContacts` | `home/HomeContacts.tsx` + `.module.css` |

---

## ⚙️ Admin Компоненты

### Навигация
| Компонент | Файл |
|-----------|------|
| `AdminHeader` | `admin/AdminHeader.tsx` + `.module.css` |
| `AdminTabs` | `admin/AdminTabs.tsx` + `.module.css` |

### Управление контентом
| Компонент | Файл |
|-----------|------|
| `AdminSlider` | `admin/AdminSlider.tsx` + `.module.css` |
| `AdminPrograms` | `admin/AdminPrograms.tsx` + `.module.css` |
| `AdminStaffPrograms` | `admin/AdminStaffPrograms.tsx` + `.module.css` |
| `AdminSchedulePrices` | `admin/AdminSchedulePrices.tsx` + `.module.css` |
| `AdminNews` | `admin/AdminNews.tsx` + `.module.css` |
| `AdminWorkouts` | `admin/AdminWorkouts.tsx` |

### Настройки
| Компонент | Файл |
|-----------|------|
| `AdminSettings` | `admin/AdminSettings.tsx` + `.module.css` |
| `AdminHeaderSettings` | `admin/AdminHeaderSettings.tsx` + `.module.css` |
| `AdminSections` | `admin/AdminSections.tsx` + `.module.css` |
| `AdminDividers` | `admin/AdminDividers.tsx` + `.module.css` |
| `AdminContacts` | `admin/AdminContacts.tsx` + `.module.css` |
| `AdminSocialSettings` | `admin/AdminSocialSettings.tsx` |

### Инструменты
| Компонент | Файл |
|-----------|------|
| `AdminStats` / `AdminStatsContainer` | `admin/AdminStats.tsx` + `.module.css` |
| `AutoUpload` | `admin/AutoUpload.tsx` + `.module.css` |
| `AdminStorage` / `AdminStorageNew` | `admin/AdminStorage.tsx` + `.module.css` |

---

## 📦 Утилиты

| Файл | Описание |
|------|----------|
| `lib/db.ts` | Работа с БД (LowDB) |
| `lib/utils.ts` | Утилиты |
| `lib/programParser.ts` | Парсер программ |

---

## ⚙️ Конфигурация

| Файл | Описание |
|------|----------|
| `package.json` | Зависимости npm |
| `next.config.js` | Конфиг Next.js |
| `tsconfig.json` | Конфиг TypeScript |
| `tailwind.config.ts` | Конфиг Tailwind |
| `postcss.config.mjs` | Конфиг PostCSS |
| `.eslintrc.json` | Конфиг ESLint |

---

## 🚀 Сборка

```bash
# Dev
npm run dev

# Prod
npm run build
npm start
```

---

## 📝 Notes

- Основной код в папке `src/`
- Стили: Tailwind CSS + CSS Modules
- База данных: db.json (LowDB)
- Аутентификация в админке по паролю
