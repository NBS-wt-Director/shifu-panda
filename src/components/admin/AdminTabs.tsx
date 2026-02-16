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
    { id: 'programs', label: '🎯 Программы', countKey: 'programs' },
    { id: 'staff', label: '👨‍🏫 Сотрудники', countKey: 'staff' },
    { id: 'news', label: '📰 Новости', countKey: 'news' },
    { id: 'contacts', label: '📞 Контакты', countKey: 'contacts' },
    { id: 'sections', label: '🏗️ Разделы', countKey: 'sections' }, 
    { id: 'settings', label: '⚙️ Настройки', countKey: 'settings' },
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
