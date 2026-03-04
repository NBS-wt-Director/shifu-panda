# Code Files Documentation

## Общее количество строк кода
**~18,247 строк** (TypeScript, TSX, CSS)

---

## Основные файлы проекта (src/)

### Страницы (app/)
| Файл | Описание | Строк |
|------|----------|-------|
| `src/app/page.tsx` | Главная страница | ~250 |
| `src/app/admin/page.tsx` | Админ-панель | ~300 |
| `src/app/programs/page.tsx` | Страница программ | ~200 |
| `src/app/trainers/page.tsx` | Страница тренеров | ~200 |
| `src/app/schedule/page.tsx` | Страница расписания | ~150 |
| `src/app/lk/page.tsx` | Личный кабинет | ~200 |
| `src/app/error.tsx` | Страница ошибки | ~100 |
| `src/app/not-found.tsx` | Страница 404 | ~50 |
| `src/app/layout.tsx` | Корневой layout | ~50 |
| `src/app/globals.css` | Глобальные стили | ~500 |

### API Routes
| Файл | Описание |
|------|----------|
| `src/app/api/db/route.ts` | Основное API БД |
| `src/app/api/trainers/route.ts` | API тренеров |
| `src/app/api/programs/route.ts` | API программ |
| `src/app/api/employees/route.ts` | API сотрудников |
| `src/app/api/send-email/route.ts` | Отправка email |
| `src/app/api/upload/route.ts` | Загрузка файлов |
| `src/app/api/stats/route.ts` | Статистика |

### UI Компоненты (components/ui/)
| Файл | Описание |
|------|----------|
| `SiteHeader.tsx` | Шапка сайта |
| `SiteHeader.module.css` | Стили шапки |
| `ProgramCard.tsx` | Карточка программы |
| `ProgramCard.module.css` | Стили карточки программы |
| `TrainerCard.tsx` | Карточка тренера |
| `TrainerCard.module.css` | Стили карточки тренера |
| `GridSettings.tsx` | Настройки сетки |
| `SectionSpacer.tsx` | Разделитель секций |
| `SectionSpacer.module.css` | Стили разделителя |
| `CallModal.tsx` | Модалка звонка |
| `CallModal.module.css` | Стили модалки |
| `FullScreenImageModal.tsx` | Полноэкранное фото |
| `ContactsSection.tsx` | Секция контактов |
| `StatsCollector.tsx` | Сбор статистики |
| `NewsCard.tsx` | Карточка новости |
| `FileInput.tsx` | Загрузка файлов |
| `GlobalPreloader.tsx` | Загрузчик |

### Home Компоненты (components/home/)
| Файл | Описание |
|------|----------|
| `HomePrograms.tsx` | Программы на главной |
| `HomeTrainers.tsx` | Тренеры на главной |
| `HomeSchedule.tsx` | Расписание |
| `HomePrices.tsx` | Цены |
| `HomeNews.tsx` | Новости |
| `HomeContacts.tsx` | Контакты |
| `HomeSlider.tsx` | Слайдер |
| `HomeHeader.tsx` | Заголовок главной |

### Admin Компоненты (components/admin/)
| Файл | Описание |
|------|----------|
| `AdminSettings.tsx` | Настройки сайта |
| `AdminPrograms.tsx` | Управление программами |
| `AdminStaffPrograms.tsx` | Управление тренерами |
| `AdminSchedulePrices.tsx` | Расписание и цены |
| `AdminSections.tsx` | Управление разделами |
| `AdminDividers.tsx` | Настройка разделителей |
| `AdminSlider.tsx` | Управление слайдером |
| `AdminNews.tsx` | Управление новостями |
| `AdminContacts.tsx` | Управление контактами |
| `AdminTabs.tsx` | Вкладки админки |
| `AdminHeader.tsx` | Шапка админки |
| `AdminStats.tsx` | Статистика |
| `AdminStorage.tsx` / `AdminStorageNew.tsx` | Файловый менеджер |
| `AutoUpload.tsx` | Автозагрузка |
| `AdminWorkouts.tsx` | Тренировки |

### Library (lib/)
| Файл | Описание |
|------|----------|
| `db.ts` | Работа с БД |
| `utils.ts` | Утилиты |
| `programParser.ts` | Парсер программ |

---

## Мусорные/дублирующие файлы

### Файлы в корне проекта (не используются)
```
/components/          # Дубликат - не используется
/lib/                 # Дубликат - не используется  
/app/                 # Дубликат - не используется
/types/               # Дубликат - не используется
```

### Неиспользуемые или устаревшие файлы
| Файл | Примечание |
|------|------------|
| `components/Header.tsx` | Не используется |
| `components/Header.module.css` | Не используется |
| `components/Metadata.tsx` | Не используется |
| `components/ui/Accordion.tsx` | Не используется |
| `components/ui/ActionButtons.tsx` | Не используется |
| `components/ui/NewsCarousel.tsx` | Не используется |
| `components/ui/TrainersGrid.tsx` | Не используется |
| `components/ui/TruncatedText.tsx` | Не используется |
| `components/home/HomeSchedule.tsx` | Устарел, используется HomeScheduleNew |
| `components/ui/DynamicMenu.tsx` | Не используется |
| `components/ui/HomeContactForm.tsx` | Не используется |
| `components/admin/AdminItemForm.tsx` | Не используется |
| `components/admin/AdminItemList.tsx` | Не используется |
| `components/admin/AuthForm.tsx` | Не используется |
| `components/admin/Header.tsx` | Дубликат AdminHeader |
| `components/admin/AdminVisits.tsx` | Не используется |
| `components/admin/AdminSocialSettings.tsx` | Не используется |

### Backup файлы
```
/backups/                 # Старые бэкапы БД
```

---

## Файлы конфигурации
| Файл | Описание |
|------|----------|
| `package.json` | Зависимости npm |
| `next.config.js` | Конфиг Next.js |
| `tsconfig.json` | Конфиг TypeScript |
| `tailwind.config.ts` | Конфиг Tailwind |
| `postcss.config.js` | Конфиг PostCSS |
| `.eslintrc.json` | Конфиг ESLint |

---

## Сборка

### Dev сборка
```bash
npm run dev
```

### Prod сборка
```bash
npm run build
npm start
```

---

## Примечание
Основной код находится в папке `src/`. Корневые папки `components/`, `lib/`, `app/` являются дубликатами и не используются в сборке.
