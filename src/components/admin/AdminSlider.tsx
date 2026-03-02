'use client'

import { useState, useEffect, DragEvent } from 'react'
import styles from './AdminSlider.module.css'

interface SliderItem {
  id: number
  title?: string
  subtitle?: string  // Новое поле!
  image: string
  interval?: number
  link?: string
}

interface AdminSliderProps {
  sliders: SliderItem[]
  onSave: (sliders: SliderItem[], defaultInterval: number) => void
}

export default function AdminSlider({ sliders: initialSliders, onSave }: AdminSliderProps) {
  const [localSliders, setLocalSliders] = useState<SliderItem[]>([])
  const [draggedItem, setDraggedItem] = useState<SliderItem | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')  // Новое поле
  const [newImage, setNewImage] = useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = useState('')
  const [newInterval, setNewInterval] = useState(5)
  const [newLink, setNewLink] = useState('')
  const [defaultInterval, setDefaultInterval] = useState(5)
  const [hasChanges, setHasChanges] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showFormHelp, setShowFormHelp] = useState(false)

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/', { method: 'POST', body: formData })
      const result = await response.json()
      if (result.success && result.url) return result.url
      throw new Error(result.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setNewImagePreview(reader.result as string)
      reader.readAsDataURL(file)
      setNewImage(file)
    }
  }

  const addSlider = async () => {
    if (!newImage || !newTitle.trim()) return
    
    try {
      const uploadedImageUrl = await uploadImage(newImage)
      
      const newSlider: SliderItem = {
        id: Date.now(),
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || undefined,
        image: uploadedImageUrl,
        interval: newInterval || undefined,
        link: newLink.trim() || undefined
      }
      
      setLocalSliders([newSlider, ...localSliders])
      resetForm()
      setHasChanges(true)
    } catch (error) {
      alert(`Ошибка загрузки: ${error}`)
    }
  }

  const resetForm = () => {
    setNewTitle('')
    setNewSubtitle('')
    setNewImage(null)
    setNewImagePreview('')
    setNewInterval(5)
    setNewLink('')
  }

  useEffect(() => {
    setLocalSliders(initialSliders)
    if (initialSliders[0]?.interval) setDefaultInterval(initialSliders[0].interval)
  }, [initialSliders])

  // Drag & drop функции (без изменений)
  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: SliderItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const newSliders = [...localSliders]
    const draggedIndex = newSliders.findIndex(s => s.id === draggedItem.id)
    newSliders.splice(draggedIndex, 1)
    newSliders.splice(targetIndex, 0, draggedItem)
    
    setLocalSliders(newSliders)
    setHasChanges(true)
    setDraggedItem(null)
  }

  const updateField = (id: number, field: keyof SliderItem, value: string | number) => {
    const newSliders = localSliders.map(slider => 
      slider.id === id ? { ...slider, [field]: value || undefined } : slider
    )
    setLocalSliders(newSliders)
    setHasChanges(true)
  }

  const deleteSlider = (id: number) => {
    const newSliders = localSliders.filter(s => s.id !== id)
    setLocalSliders(newSliders)
    setHasChanges(true)
  }

  const saveChanges = () => {
    onSave(localSliders, defaultInterval)
    setHasChanges(false)
  }

  return (
    <div className={styles.container}>
      {/* Глобальные настройки */}
      <div className={styles.globalSettings}>
        <h3>📱 Слайдер ({localSliders.length} слайдов)</h3>
        <div className={styles.globalInterval}>
          <label title="Интервал для слайдов без своего времени">
            ⏱️ Интервал по умолчанию: 
            <input
              type="number"
              min="1"
              max="60"
              value={defaultInterval}
              onChange={e => {
                setDefaultInterval(Number(e.target.value))
                setHasChanges(true)
              }}
              className={styles.intervalInput}
            /> сек
          </label>
        </div>
      </div>

      {/* Форма создания - ЧЕТКАЯ! */}
      <div className={styles.createForm}>
        <h4>➕ Создать новый слайд</h4>
        <button 
          className={styles.helpToggle}
          onClick={() => setShowFormHelp(!showFormHelp)}
          title="Показать подсказки"
        >
          ❓
        </button>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>📝 Заголовок <span className={styles.required}>*</span></label>
            <input 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)} 
              placeholder="Тренировки для стоп"
              className={styles.formInput}
            />
            {showFormHelp && <small>Главный текст слайда (обязательно)</small>}
          </div>

          <div className={styles.formGroup}>
            <label>📄 Подзаголовок</label>
            <input 
              value={newSubtitle}
              onChange={e => setNewSubtitle(e.target.value)}
              placeholder="Улучшите координацию и баланс"
              className={styles.formInput}
            />
            {showFormHelp && <small>Дополнительный текст под заголовком</small>}
          </div>

          <div className={styles.formGroup}>
            <label>🖼️ Изображение <span className={styles.required}>*</span></label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect} 
              className={styles.fileInput}
              disabled={uploading}
            />
            {newImagePreview && (
              <div className={styles.imagePreview}>
                <img src={newImagePreview} alt="Превью" />
              </div>
            )}
            {showFormHelp && <small>Рекомендуемый размер: 1920x1080</small>}
          </div>

          <div className={styles.formGroup}>
            <label>⏱️ Интервал показа</label>
            <input
              type="number"
              min="1"
              max="60"
              value={newInterval}
              onChange={e => setNewInterval(Number(e.target.value))}
              className={styles.intervalInput}
            />
            {showFormHelp && <small>Секунды показа этого слайда (по умолчанию 5 сек)</small>}
          </div>

          <div className={styles.formGroup}>
            <label>🔗 Ссылка</label>
            <input
              value={newLink}
              onChange={e => setNewLink(e.target.value)}
              placeholder="/trainings/feet или https://..."
              className={styles.formInput}
            />
            {showFormHelp && <small>Ссылка при клике на заголовок (опционально)</small>}
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            onClick={addSlider} 
            className={styles.addBtn}
            disabled={!newImage || !newTitle.trim() || uploading}
          >
            {uploading ? '⏳ Загрузка...' : '➕ Создать слайд'}
          </button>
          <button 
            onClick={resetForm}
            className={styles.resetBtn}
          >
            🔄 Очистить
          </button>
        </div>
      </div>

      {/* Кнопка сохранения */}
      <div className={styles.saveSection}>
        <button 
          onClick={saveChanges} 
          className={`${styles.saveBtn} ${hasChanges ? styles.saveBtnActive : ''}`}
          disabled={!hasChanges}
        >
          {hasChanges ? '💾 Сохранить все изменения' : '✅ Все сохранено'}
        </button>
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <h4>👀 Превью</h4>
        <div className={styles.sliderTrack}>
          {localSliders.slice(0, 5).map((slider, index) => (
            <div key={slider.id} className={styles.previewSlide}>
              <div className={styles.previewImage} style={{ backgroundImage: `url(${slider.image})` }} />
              <div className={styles.previewOverlay}>
                <div className={styles.previewTitle}>{slider.title || 'Без названия'}</div>
                {slider.subtitle && <div className={styles.previewSubtitle}>{slider.subtitle}</div>}
                {slider.link && <span className={styles.previewLink}>🔗</span>}
                <span className={styles.previewIndex}>{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
        {localSliders.length > 5 && (
          <div className={styles.moreSlides}>+{localSliders.length - 5} дополнительных</div>
        )}
      </div>

      {/* Редактор */}
      <div className={styles.editor}>
        <h4>✏️ Редактирование ({localSliders.length})</h4>
        <div className={styles.list}>
          {localSliders.map((slider, index) => (
            <div 
              key={slider.id} 
              className={`${styles.sliderItem} ${draggedItem?.id === slider.id ? styles.dragging : ''}`}
              draggable
              onDragStart={e => handleDragStart(e, slider)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, index)}
            >
              <div className={styles.dragHandle}>☰</div>
              <div className={styles.index}>{index + 1}.</div>
              <div className={styles.sliderPreview}>
                <div className={styles.sliderImage} style={{ backgroundImage: `url(${slider.image})` }} />
              </div>
              <div className={styles.sliderContent}>
                <input 
                  value={slider.title || ''} 
                  onChange={e => updateField(slider.id, 'title', e.target.value)} 
                  placeholder="Заголовок"
                  className={styles.inlineInput}
                />
                <input 
                  value={slider.subtitle || ''} 
                  onChange={e => updateField(slider.id, 'subtitle', e.target.value)} 
                  placeholder="Подзаголовок"
                  className={styles.inlineInput}
                />
                <div className={styles.inlineActions}>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={slider.interval || ''}
                    onChange={e => updateField(slider.id, 'interval', Number(e.target.value))}
                    className={styles.inlineInterval}
                    title="Интервал"
                  />
                  <input
                    type="url"
                    value={slider.link || ''}
                    onChange={e => updateField(slider.id, 'link', e.target.value)}
                    placeholder="Ссылка"
                    className={styles.inlineLink}
                  />
                  <button 
                    onClick={() => deleteSlider(slider.id)} 
                    className={styles.deleteBtn}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasChanges && (
          <div className={styles.status}>🔄 Есть несохранённые изменения</div>
        )}
      </div>
    </div>
  )
}
