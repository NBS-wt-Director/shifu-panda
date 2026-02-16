'use client';
import { useState } from 'react';
import FileInput from '@/components/ui/FileInput';
import styles from './AdminSchedulePrices.module.css';

interface SchedulePriceItem {
  id: number;
  image: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface AdminSchedulePricesProps {
  schedule: SchedulePriceItem[];
  prices: SchedulePriceItem[];
  news: NewsItem[];
  onSaveSchedule: (schedule: SchedulePriceItem[]) => void;
  onSavePrices: (prices: SchedulePriceItem[]) => void;
  onAddNews: (news: NewsItem) => void;
}

export default function AdminSchedulePrices({ 
  schedule: initialSchedule = [], 
  prices: initialPrices = [],
  news,
  onSaveSchedule, 
  onSavePrices, 
  onAddNews 
}: AdminSchedulePricesProps) {
  
  // ✅ ЛОКАЛЬНЫЕ состояния - НЕ сбрасываются
  const [localSchedule, setLocalSchedule] = useState<SchedulePriceItem[]>([
    { id: 1, image: '/расписание1.jpg' },
    { id: 2, image: '/расписание2.jpg' }
  ]);
  const [localPrices, setLocalPrices] = useState<SchedulePriceItem[]>([
    { id: 1, image: '/цены1.jpg' }
  ]);
  
  // ✅ File состояния
  const [scheduleImage, setScheduleImage] = useState<File | null>(null);
  const [scheduleImagePreview, setScheduleImagePreview] = useState('');
  const [schedule2Image, setSchedule2Image] = useState<File | null>(null);
  const [schedule2ImagePreview, setSchedule2ImagePreview] = useState('');
  const [pricesImage, setPricesImage] = useState<File | null>(null);
  const [pricesImagePreview, setPricesImagePreview] = useState('');
  
  // ✅ Очередь сохранения файлов
  const [pendingSave, setPendingSave] = useState<{
    schedule1?: File;
    schedule2?: File;
    prices1?: File;
  }>({});
  
  const [publishNews, setPublishNews] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // ✅ Шаблоны новостей
  const [templates, setTemplates] = useState({
    schedule: {
      title: 'Обновлено расписание [%DATE%]',
      description: 'Расписание занятий обновлено [%DATE%]. Проверяйте актуальное время проведения групповых занятий!'
    },
    prices: {
      title: 'Обновлены цены [%DATE%]',
      description: 'Цены на абонементы и услуги обновлены [%DATE%]. Ознакомьтесь с актуальными тарифами!'
    }
  });

  const createNews = (type: 'schedule' | 'prices', image: string) => {
    if (!publishNews) return;
    
    const now = new Date();
    const timeStr = now.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const title = templates[type].title.replace('%DATE%', timeStr);
    const description = templates[type].description.replace('%DATE%', timeStr);
    
    const newsItem: NewsItem = {
      id: Date.now(),
      title,
      description,
      image
    };
    
    onAddNews(newsItem);
  };

  // ✅ РАСПИСАНИЕ #1
  const updateScheduleImage = () => {
    if (!scheduleImage) return;
    
    const newSchedule = localSchedule.map((item, index) => 
      index === 0 ? { ...item, image: '/расписание1.jpg' } : item
    );
    
    setLocalSchedule(newSchedule);
    setPendingSave(prev => ({ ...prev, schedule1: scheduleImage }));
    setHasChanges(true);
    
    if (publishNews) createNews('schedule', '/расписание1.jpg');
    
    setScheduleImage(null);
    setScheduleImagePreview('');
  };

  // ✅ РАСПИСАНИЕ #2
  const updateSchedule2Image = () => {
    if (!schedule2Image) return;
    
    const newSchedule = localSchedule.map((item, index) => 
      index === 1 ? { ...item, image: '/расписание2.jpg' } : item
    );
    
    setLocalSchedule(newSchedule);
    setPendingSave(prev => ({ ...prev, schedule2: schedule2Image }));
    setHasChanges(true);
    
    if (publishNews) createNews('schedule', '/расписание2.jpg');
    
    setSchedule2Image(null);
    setSchedule2ImagePreview('');
  };

  // ✅ ЦЕНЫ #1
  const updatePricesImage = () => {
    if (!pricesImage) return;
    
    const newPrices = localPrices.map((item, index) => 
      index === 0 ? { ...item, image: '/цены1.jpg' } : item
    );
    
    setLocalPrices(newPrices);
    setPendingSave(prev => ({ ...prev, prices1: pricesImage }));
    setHasChanges(true);
    
    if (publishNews) createNews('prices', '/цены1.jpg');
    
    setPricesImage(null);
    setPricesImagePreview('');
  };

  const deleteItem = (id: number, type: 'schedule' | 'prices') => {
    if (type === 'schedule') {
      const newSchedule = localSchedule.filter(item => item.id !== id);
      setLocalSchedule(newSchedule);
      setHasChanges(true);
      if (publishNews) createNews('schedule', '/deleted-image.jpg');
    } else {
      const newPrices = localPrices.filter(item => item.id !== id);
      setLocalPrices(newPrices);
      setHasChanges(true);
      if (publishNews) createNews('prices', '/deleted-image.jpg');
    }
  };

  // ✅ ГЛАВНОЕ - СОХРАНЕНИЕ ФАЙЛОВ + БД
  const saveChanges = async () => {
    try {
      // ✅ 1. СОХРАНЯЕМ РАСПИСАНИЯ
      if (pendingSave.schedule1 || pendingSave.schedule2) {
        const formData = new FormData();
        if (pendingSave.schedule1) formData.append('scheduleFiles', pendingSave.schedule1);
        if (pendingSave.schedule2) formData.append('scheduleFiles', pendingSave.schedule2);
        
        await fetch('/api/admin/save-schedule', {
          method: 'POST',
          body: formData,
        });
      }

      // ✅ 2. СОХРАНЯЕМ ЦЕНЫ
      if (pendingSave.prices1) {
        const formData = new FormData();
        formData.append('priceFiles', pendingSave.prices1);
        
        await fetch('/api/admin/save-prices', {
          method: 'POST',
          body: formData,
        });
      }

      // ✅ 3. СОХРАНЯЕМ ССЫЛКИ В БД
      onSaveSchedule(localSchedule);
      onSavePrices(localPrices);
      
      // ✅ 4. СБРАСЫВАЕМ
      setHasChanges(false);
      setPendingSave({});
      
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>📅 Расписание + 💰 Цены {hasChanges && '✨'}</h3>
        
        {/* ✅ 3 FILEINPUT */}
        <div className={styles.uploadSection}>
          <div className={styles.uploadGroup}>
            <h4>📅 Расписание #1</h4>
            <FileInput
              accept="image/*"
              onChange={(file, preview) => {
                setScheduleImage(file);
                setScheduleImagePreview(preview);
              }}
              preview={scheduleImagePreview}
            />
            <button 
              onClick={updateScheduleImage}
              className={styles.updateBtn}
              disabled={!scheduleImage}
            >
              🔄 Заменить → public/расписание1.jpg
            </button>
          </div>

          <div className={styles.uploadGroup}>
            <h4>📅 Расписание #2</h4>
            <FileInput
              accept="image/*"
              onChange={(file, preview) => {
                setSchedule2Image(file);
                setSchedule2ImagePreview(preview);
              }}
              preview={schedule2ImagePreview}
            />
            <button 
              onClick={updateSchedule2Image}
              className={styles.updateBtn}
              disabled={!schedule2Image}
            >
              🔄 Заменить → public/расписание2.jpg
            </button>
          </div>

          <div className={styles.uploadGroup}>
            <h4>💰 Цены #1</h4>
            <FileInput
              accept="image/*"
              onChange={(file, preview) => {
                setPricesImage(file);
                setPricesImagePreview(preview);
              }}
              preview={pricesImagePreview}
            />
            <button 
              onClick={updatePricesImage}
              className={styles.updateBtn}
              disabled={!pricesImage}
            >
              🔄 Заменить → public/цены1.jpg
            </button>
          </div>
        </div>

        <div className={styles.headerActions}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={publishNews}
              onChange={(e) => setPublishNews(e.target.checked)}
            />
            📰 Автоновости
          </label>
          <button 
            onClick={saveChanges}
            className={`${styles.saveBtn} ${hasChanges ? styles.saveBtnActive : ''}`}
            disabled={!hasChanges}
          >
            💾 Сохранить в public/ ({localSchedule.length + localPrices.length})
          </button>
        </div>
      </div>

      {/* ✅ ПРЕДПРОСМОТР */}
      <div className={styles.previewSection}>
        <div className={styles.previewItem}>
          <h4>📅 Расписание ({localSchedule.length})</h4>
          <div className={styles.previewGrid}>
            {localSchedule.map(item => (
              <div key={item.id} className={styles.previewCard}>
                <div 
                  className={styles.previewImage}
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <button 
                  className={styles.deleteBtn}
                  onClick={() => deleteItem(item.id, 'schedule')}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.previewItem}>
          <h4>💰 Цены ({localPrices.length})</h4>
          <div className={styles.previewGrid}>
            {localPrices.map(item => (
              <div key={item.id} className={styles.previewCard}>
                <div 
                  className={styles.previewImage}
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <button 
                  className={styles.deleteBtn}
                  onClick={() => deleteItem(item.id, 'prices')}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ ШАБЛОНЫ */}
      <div className={styles.templatesSection}>
        <h4>📝 Шаблоны автоновостей</h4>
        <div className={styles.templateGroup}>
          <div className={styles.templateItem}>
            <h5>📅 Расписание</h5>
            <textarea
              value={templates.schedule.title}
              onChange={(e) => setTemplates({
                ...templates,
                schedule: { ...templates.schedule, title: e.target.value }
              })}
              className={styles.templateInput}
              rows={2}
              placeholder="Обновлено расписание [%DATE%]"
            />
            <textarea
              value={templates.schedule.description}
              onChange={(e) => setTemplates({
                ...templates,
                schedule: { ...templates.schedule, description: e.target.value }
              })}
              className={styles.templateInput}
              rows={3}
              placeholder="Расписание занятий обновлено..."
            />
          </div>
          
          <div className={styles.templateItem}>
            <h5>💰 Цены</h5>
            <textarea
              value={templates.prices.title}
              onChange={(e) => setTemplates({
                ...templates,
                prices: { ...templates.prices, title: e.target.value }
              })}
              className={styles.templateInput}
              rows={2}
              placeholder="Обновлены цены [%DATE%]"
            />
            <textarea
              value={templates.prices.description}
              onChange={(e) => setTemplates({
                ...templates,
                prices: { ...templates.prices, description: e.target.value }
              })}
              className={styles.templateInput}
              rows={3}
              placeholder="Цены на абонементы обновлены..."
            />
          </div>
        </div>
      </div>

      <div className={styles.status}>
        {publishNews && '📰 Автоновости включены | '}
        {hasChanges && `✨ ${Object.keys(pendingSave).length} файлов ждут сохранения`}
      </div>
    </div>
  );
}
