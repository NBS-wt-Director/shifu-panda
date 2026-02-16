'use client';
import { useState, useEffect } from 'react';
import styles from './AdminNews.module.css';
import FileInput from '@/components/ui/FileInput';
interface NewsItem {
  id: number;
  image: string;
  title: string;
  text: string;
}

interface AdminNewsProps {
  news: NewsItem[];
  onSave: (news: NewsItem[]) => void;
}

export default function AdminNews({ news: initialNews = [], onSave }: AdminNewsProps) {
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newNews, setNewNews] = useState({
    title: '',
    text: ''
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState('');
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const safeNews = (initialNews || []).map((item: any) => ({
      ...item,
      title: item.title || '',
      text: item.text || ''
    }));
    setLocalNews(safeNews);
  }, [initialNews]);


  const addNews = () => {
    if (!newImage || !newNews.title.trim() || !newNews.text.trim()) return;
    
    const newsItem: NewsItem = {
      id: Date.now(),
      image: URL.createObjectURL(newImage),
      title: newNews.title,
      text: newNews.text
    };
    
    const newNewsList = [newsItem, ...localNews];
    setLocalNews(newNewsList);
    resetNewNews();
    setHasChanges(true);
  };

  const updateNews = () => {
    if (!editingNews) return;
    const newNewsList = localNews.map(item => 
      item.id === editingNews.id ? editingNews : item
    );
    setLocalNews(newNewsList);
    setHasChanges(true);
    setEditingNews(null);
  };

  const deleteNews = (id: number) => {
    const newNewsList = localNews.filter(item => item.id !== id);
    setLocalNews(newNewsList);
    setHasChanges(true);
  };

  const resetNewNews = () => {
    setNewNews({ title: '', text: '' });
    setNewImage(null);
    setNewImagePreview('');
  };

  const saveChanges = () => {
    onSave(localNews);
    setHasChanges(false);
  };

  const safeTextPreview = (text: string) => text.length > 80 
    ? text.substring(0, 80) + '...' 
    : text;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>📰 Новости ({localNews.length})</h3>
      </div>

      <div className={styles.content}>
        {/* ✅ ФОРМА НОВОЙ НОВОСТИ */}
        <div className={styles.addSection}>
          <h4>➕ Новая новость</h4>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Заголовок</label>
              <input
                value={newNews.title}
                onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                className={styles.input}
                placeholder="Введите заголовок новости"
              />
            </div>
            <div className={styles.field}>
              <label>Текст</label>
              <textarea
                value={newNews.text}
                onChange={(e) => setNewNews({...newNews, text: e.target.value})}
                className={styles.textarea}
                rows={4}
                placeholder="Краткий текст новости..."
              />
            </div>
            <div className={styles.field}>
              <label>Главное изображение</label>
              <div className={styles.imagePreview}>
                {newImagePreview && (
                  <img src={newImagePreview} alt="Preview" className={styles.previewImg} />
                )}
              </div>
<FileInput
  accept="image/*"
  onChange={(file, preview) => {
    setNewImage(file);
    setNewImagePreview(preview);
  }}
  preview={newImagePreview}
  label="Главное изображение"
/>
            </div>
            <button 
              className={styles.addBtn}
              onClick={addNews}
              disabled={!newImage || !newNews.title.trim() || !newNews.text.trim()}
            >
              ➕ Опубликовать новость
            </button>
          </div>
        </div>

        {/* ✅ ОСНОВНАЯ СЕТКА */}
        <div className={styles.mainGrid}>
          {/* ФОРМА РЕДАКТИРОВАНИЯ */}
          <div className={styles.formSection}>
            {editingNews ? (
              <div className={styles.editForm}>
                <h4>✏️ Редактировать: {editingNews.title}</h4>
                <div className={styles.formFields}>
                  <div className={styles.field}>
                    <label>Заголовок</label>
                    <input 
                      value={editingNews.title}
                      onChange={(e) => setEditingNews({
                        ...editingNews, 
                        title: e.target.value
                      })}
                      className={styles.input} 
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Текст</label>
                    <textarea 
                      value={editingNews.text}
                      onChange={(e) => setEditingNews({
                        ...editingNews, 
                        text: e.target.value
                      })}
                      className={styles.textarea} 
                      rows={8} 
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Изображение</label>
                    <div className={styles.imagePreview}>
                      <img 
                        src={editingImagePreview || editingNews.image} 
                        alt="Preview" 
                        className={styles.previewImg}
                      />
                    </div>
                   <FileInput
  accept="image/*"
  onChange={(file, preview) => {
    setEditingImage(file);
    setEditingImagePreview(preview);
    setEditingNews({ ...editingNews!, image: preview });
  }}
  preview={editingImagePreview || editingNews?.image}
  label="Новое изображение"
/>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button className={styles.saveNewsBtn} onClick={updateNews}>
                    💾 Обновить новость
                  </button>
                  <button className={styles.deleteNewsBtn} onClick={() => deleteNews(editingNews.id)}>
                    🗑️ Удалить
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setEditingNews(null)}>
                    ❌ Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.noSelection}>
                <h4>👆 Выберите новость для редактирования</h4>
                <p>Кликните ✏️ на плитке справа</p>
              </div>
            )}
          </div>

          {/* ПЛИТКИ */}
          <div className={styles.newsList}>
            <h4>📋 Все новости ({localNews.length})</h4>
            <div className={styles.divider}></div>
            <div className={styles.grid}>
              {localNews.map((item) => (
                <div key={item.id} className={styles.newsCard}>
                  <div className={styles.cardButtons}>
                    <button 
                      className={styles.editBtn}
                      onClick={() => {
                        setEditingNews(item);
                        setEditingImagePreview(item.image);
                      }}
                    >
                      ✏️
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => deleteNews(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <div 
                    className={styles.newsImage} 
                    style={{ backgroundImage: `url(${item.image})` }} 
                  />
                  <div className={styles.newsInfo}>
                    <h5>{item.title}</h5>
                    <p>{safeTextPreview(item.text)}</p>
                    <div className={styles.newsMeta}>
                      <span>🆔 {item.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.saveSection}>
          <button 
            className={`${styles.saveBtn} ${hasChanges ? styles.saveBtnActive : ''}`}
            onClick={saveChanges}
            disabled={!hasChanges}
          >
            💾 Сохранить все изменения {hasChanges && '(новые)'}
          </button>
        </div>

        <div className={styles.status}>
          {hasChanges ? '✨ Изменения ждут сохранения' : '✅ Все сохранено'}
        </div>
      </div>
    </div>
  );
}
