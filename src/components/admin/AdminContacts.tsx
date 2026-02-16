'use client';
import { useState, useEffect } from 'react';
import styles from './AdminContacts.module.css';

interface Social {
  id: string;
  title: string;
  url: string;
}

interface ContactsData {
  address: string;
  email: string;
  phone: string;
  vk?: string;
  telegram?: string;
  social: Social[];
}

interface AdminContactsProps {
  data: ContactsData;
  onSave: (data: ContactsData) => void;
}

export default function AdminContacts({ data: initialData, onSave }: AdminContactsProps) {
  const [data, setData] = useState<ContactsData>(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const updateField = (field: keyof Omit<ContactsData, 'social'>, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    setHasChanges(true);
  };

  const updateSocial = (index: number, field: 'title' | 'url', value: string) => {
    const newSocial = [...data.social];
    newSocial[index] = { ...newSocial[index], [field]: value };
    const newData = { ...data, social: newSocial };
    setData(newData);
    setHasChanges(true);
  };

  const saveChanges = () => {
    onSave(data);
    setHasChanges(false);
  };

  const socialData = [
    { id: 'vk', title: 'ВКонтакте', url: data.vk || '' },
    { id: 'telegram', title: 'Telegram', url: data.telegram || '' },
    { id: 'balloo', title: 'мы в BALLOO (скоро)', url: '' },
    { id: 'max', title: 'мы в MAX (скоро)', url: '' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3>📍 Основные контакты</h3>
        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <label>Адрес</label>
            <input
              value={data.address}
              onChange={(e) => updateField('address', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>Телефон</label>
            <input
              value={data.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>🌐 Социальные сети</h3>
        <div className={styles.socialList}>
          {socialData.map((social, index) => (
            <div key={social.id} className={styles.socialItem}>
              <div className={styles.socialIcon}>{social.id.toUpperCase()}</div>
              <div className={styles.socialFields}>
                <input
                  value={social.title}
                  onChange={(e) => updateSocial(index, 'title', e.target.value)}
                  placeholder="Название"
                  className={styles.input}
                />
                <input
                  value={social.url}
                  onChange={(e) => updateSocial(index, 'url', e.target.value)}
                  placeholder="Ссылка"
                  className={styles.input}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          onClick={saveChanges}
          className={`${styles.saveBtn} ${hasChanges ? styles.saveBtnActive : ''}`}
          disabled={!hasChanges}
        >
          💾 Сохранить {hasChanges && '(изменено)'}
        </button>
      </div>

      <div className={styles.status}>
        {hasChanges 
          ? '✨ Изменения ждут сохранения' 
          : '✅ Все изменения сохранены'}
      </div>
    </div>
  );
}
