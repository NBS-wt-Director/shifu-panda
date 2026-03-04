'use client';
import styles from './AdminTabs.module.css';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    { id: 'sliders', label: '📸 Слайдер', countKey: 'sliders' },
    { id: 'schedulePrices', label: '📅💰 Расписание и Цены', countKey: 'schedulePrices' },
    { id: 'workouts', label: '📋 Тренировки', countKey: 'workouts' },
    { id: 'programs', label: '🎯 Программы', countKey: 'programs' },
    { id: 'staff', label: '👨‍🏫 Сотрудники', countKey: 'staff' },
    { id: 'news', label: '📰 Новости', countKey: 'news' },
    { id: 'contacts', label: '📞 Контакты', countKey: 'contacts' },
    { id: 'sections', label: '🏗️ Разделы', countKey: 'sections' }, 
    { id: 'dividers', label: '🎨 Разделители', countKey: 'dividers' },
    { id: 'settings', label: '⚙️ Настройки', countKey: 'settings' },
    { id: 'stats', label: '📊 Статистика', countKey: 'stats' },
    { id: 'autoupload', label: '☁️ Автозагрузка', countKey: 'autoupload'},
    { id: 'files', label: '📁 Файлы и память', countKey: 'files'}
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.tabIcon}>{tab.label.split(' ')[0]}</span>
          <span className={styles.tabLabel}>{tab.label.split(' ').slice(1).join(' ')}</span>
        </button>
      ))}
    </div>
  );
}
