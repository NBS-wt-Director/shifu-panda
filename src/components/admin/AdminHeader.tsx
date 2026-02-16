'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './AdminHeader.module.css';

export default function AdminHeader({ 
  changesCount, 
  onSave, 
  dbData,
  onLogout 
}: { 
  changesCount: number; 
  onSave: () => void; 
  dbData: any; 
  onLogout: () => void;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.homeLink}>
          🏠 Главная
        </Link>
        <span className={styles.title}>🛠️ Админ панель</span>
      </div>

      <div className={styles.right}>
        <div className={styles.saveSection}>
          <button onClick={onSave} className={styles.saveBtn} disabled={changesCount === 0}>
            💾 Сохранить
            {changesCount > 0 && (
              <span className={styles.changesCount}>{changesCount}</span>
            )}
          </button>
        </div>
        
        <div className={styles.stats}>
          <span>📊 {Object.keys(dbData || {}).length} разделов</span>
        </div>

        <button onClick={onLogout} className={styles.logoutBtn}>
          🚪 Выход
        </button>
      </div>
    </header>
  );
}
