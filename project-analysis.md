# 🎯 Полный анализ проекта

**Дата:** 17.02.2026, 06:24:01

**Статистика:**
| Тип | Количество |
|----|------------|
| 📁 Все файлы | **206** |
| 📄 Текстовые | **125** |
| 🖼️ Медиа | **30** |
| 📏 Строк кода | **13 141** |
| 🎨 UI компонентов | **50** |
| 🚨 Одиноких UI | **10** |

## ⚠️ Пропущенные файлы (1)

```
package-lock.json (289.1KB)
```

## 🗂️ Структура проекта

```plaintext
  ./
    📄  deploy
    📄 .env
    📄 .gitignore
    📄 add-path-comments.js
    📄 db.json
    📄 deploy
    📄 docs
    📄 next-env.d.ts
    📄 next.config.js
    📄 package-lock.json
    📄 package.json
    📄 postcss.config.mjs
    📄 project-analysis.md
    📄 public
    📄 scripts
    📄 src
    📄 tailwind.config.ts
    📄 tsconfig.json
  deploy/
    📄 deploy.sh
    📄 ecosystem.config.js
    📄 nginx.conf
    📄 ssl-nginx.conf
    📄 ssl-selfsigned.sh
  public/
    📄 favicon.ico
    🖼️ logo.png
    📄 uploads
    🖼️ расписание1.jpg
    🖼️ расписание2.jpg
    🖼️ рассписание1.jpg
    🖼️ рассписание2.jpg
    🖼️ цены1.jpg
    uploads/
      🖼️ 1770799800687-qufrzrj5m.jpg
      🖼️ 1770800269002-nu4enuosc.jpg
      🖼️ 1770800420421-01mo77rht.jpg
      🖼️ 1770874411760-zmkygx311.jpg
      🖼️ 1770874476650-v8vpq8cm4.jpg
      🖼️ 1770874691772-omjksnmt0.jpg
      🖼️ 1770874980648-e0lk011br.jpg
      🖼️ 1770875029241-2s5jrthj0.jpg
      🖼️ 1770875064584-pg0kpxbs3.jpg
      🖼️ 1770875124924-t83qrstxw.jpg
      🖼️ 1770875159364-x3nekxoix.jpg
      🖼️ 1770875619726-70ktf11oc.jpg
      🖼️ 1770875655032-tisoj1mla.jpg
      🖼️ 1770878875542-isxyrcrdp.jpg
      🖼️ 1770878921390-ilzeg1rtt.jpg
      🖼️ 1770878960202-dwe9x62n1.jpg
      🖼️ 1770955215807-csc95dh2m.jpg
      🖼️ 1770957514291-kpwafm733.jpg
      🖼️ 1770958220930-5bk292aw9.jpg
      🖼️ 1770958234580-2m6vh0jvt.jpg
      🖼️ 1770958242861-adixw4ugp.jpg
      🖼️ 1770958251891-l6l825d6z.jpg
      🖼️ 1770958266447-90i59eqiu.jpg
      🖼️ 1770965676341-gzhm9dddo.jpg
  scripts/
    📄 analyze.js
  src/
    📄 app
    📄 components
    📄 lib
    📄 src
    app/
      📄 admin
      📄 api
      📄 error.tsx
      📄 globals.css
      📄 layout.tsx
      📄 not-found.tsx
      📄 page.tsx
      📄 programs
      📄 trainers
      admin/
        📄 page.module.css
        📄 page.tsx
      api/
        📄 admin
        📄 db
        📄 employees
        📄 error-report
        📄 programs
        📄 send-changes-notification
        📄 send-email
        📄 trainers
        📄 upload
        admin/
          📄 news
          📄 save-schedule
          📄 trainers
          news/
            📄 [id]
            📄 route.ts
            [id]/
              📄 route.ts
          save-schedule/
            📄 route.ts
          trainers/
            📄 [id]
            📄 route.ts
            [id]/
              📄 route.ts
        db/
          📄 route.ts
        employees/
          📄 route.ts
        error-report/
          📄 route.ts
        programs/
          📄 [id]
          📄 route.ts
          [id]/
            📄 route.ts
        send-changes-notification/
          📄 route.ts
        send-email/
          📄 route.ts
        trainers/
          📄 [id]
          📄 route.ts
          [id]/
            📄 route.ts
        upload/
          📄 route.ts
      programs/
        📄 [id]
        📄 page.module.css
        📄 page.tsx
        [id]/
          📄 page.tsx
      trainers/
        📄 [id]
        📄 page.tsx
        [id]/
          📄 page.tsx
    components/
      📄 Accordion.module.css css
      📄 Footer.tsx
      📄 Header.module.css
      📄 Header.tsx
      📄 Metadata.tsx
      📄 admin
      📄 home
      📄 ui
      admin/
        📄 AdminContacts.module.css
        📄 AdminContacts.tsx
        📄 AdminHeader.module.css
        📄 AdminHeader.tsx
        📄 AdminItemForm.module.css
        📄 AdminItemForm.tsx
        📄 AdminItemList.module.css
        📄 AdminItemList.tsx
        📄 AdminNews.module.css
        📄 AdminNews.tsx
        📄 AdminPrograms.module.css
        📄 AdminPrograms.tsx
        📄 AdminSchedulePrices.module.css
        📄 AdminSchedulePrices.tsx
        📄 AdminSections.module.css
        📄 AdminSections.tsx
        📄 AdminSettings.module.css
        📄 AdminSettings.tsx
        📄 AdminSlider.module.css
        📄 AdminSlider.tsx
        📄 AdminSocialSettings.tsx
        📄 AdminStaffPrograms.module.css
        📄 AdminStaffPrograms.tsx
        📄 AdminStorage.module.css
        📄 AdminStorage.tsx
        📄 AdminTabs.module.css
        📄 AdminTabs.tsx
        📄 AdminVisits.tsx
        📄 AuthForm.tsx
        📄 Header.tsx
      home/
        📄 HomeContacts.module.css
        📄 HomeContacts.tsx
        📄 HomeHeader.module.css
        📄 HomeHeader.tsx
        📄 HomeNews.module.css
        📄 HomeNews.tsx
        📄 HomePrices.module.css
        📄 HomePrices.tsx
        📄 HomePrograms.module.css
        📄 HomePrograms.tsx
        📄 HomeSchedule.module.css
        📄 HomeSchedule.tsx
        📄 HomeSlider.module.css
        📄 HomeSlider.tsx
        📄 HomeSocialButtons.module.css
        📄 HomeSocialButtons.tsx
        📄 HomeTrainers.module.css
        📄 HomeTrainers.tsx
      ui/
        📄 Accordion.module.css
        📄 Accordion.tsx
        📄 ActionButtons.module.css
        📄 ActionButtons.tsx
        📄 CallForm.tsx
        📄 CallModal.module.css
        📄 CallModal.tsx
        📄 ContactsSection.tsx
        📄 DynamicMenu.module.css
        📄 DynamicMenu.tsx
        📄 FileInput.module.css
        📄 FileInput.tsx
        📄 FullScreenImageModal.module.css
        📄 FullScreenImageModal.tsx
        📄 GlobalPreloader.module.css
        📄 GlobalPreloader.tsx
        📄 HomeContactForm.module.css
        📄 HomeContactForm.tsx
        📄 NewsCard.module.css
        📄 NewsCard.tsx
        📄 NewsCarousel.tsx
        📄 ProgramCard.module.css
        📄 ProgramCard.tsx
        📄 ScheduleSection.tsx
        📄 SectionSpacer.module.css
        📄 SectionSpacer.tsx
        📄 Slider.tsx
        📄 TrainerCard.tsx
        📄 TrainersGrid.tsx
        📄 TruncatedText.tsx
        📄 button.tsx
    lib/
      📄 db.ts
      📄 utils.ts
    src/
      📄 app
      📄 components
      app/
        📄 api
        api/
          📄 admin
          admin/
            📄 save-prices
            save-prices/
              📄 route.ts
      components/
        📄 admin
        admin/
          📄 AdminNews.tsx

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
