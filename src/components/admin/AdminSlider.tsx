'use client';
import { useState, useEffect, DragEvent } from 'react';
import styles from './AdminSlider.module.css';

interface SliderItem {
  id: number;
  title: string;
  image: string;
}

interface AdminSliderProps {
  sliders: SliderItem[];
  onSave: (sliders: SliderItem[]) => void;
}

export default function AdminSlider({ sliders: initialSliders, onSave }: AdminSliderProps) {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [localSliders, setLocalSliders] = useState<SliderItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<SliderItem | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  // ✅ ДОБАВЬ состояния после useState:
const [newImage, setNewImage] = useState<File | null>(null);
const [newImagePreview, setNewImagePreview] = useState<string>('');

// ✅ НОВАЯ функция для выбора изображения:
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setNewImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

// ✅ ИЗМЕНИ addSlider функцию:
const addSlider = () => {
  if (!newImage) return;
  
  const newSlider: SliderItem = {
    id: Date.now(),
    title: newTitle || `Слайд ${localSliders.length + 1}`,
    image: URL.createObjectURL(newImage) // ✅ Реальное изображение
  };
  
  setLocalSliders([newSlider, ...localSliders]);
  setSliders([newSlider, ...sliders]);
  setNewTitle('');
  setNewImage(null);
  setNewImagePreview('');
  setHasChanges(true);
};


  useEffect(() => {
    setSliders(initialSliders);
    setLocalSliders(initialSliders);
  }, [initialSliders]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: SliderItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newSliders = [...localSliders];
    const draggedIndex = newSliders.findIndex(s => s.id === draggedItem.id);
    
    newSliders.splice(draggedIndex, 1);
    newSliders.splice(targetIndex, 0, draggedItem);
    
    setLocalSliders(newSliders);
    setSliders(newSliders);
    setDraggedItem(null);
    setHasChanges(true);
  };

  const updateTitle = (id: number, title: string) => {
    const newSliders = localSliders.map(slider => 
      slider.id === id ? { ...slider, title } : slider
    );
    setLocalSliders(newSliders);
    setSliders(newSliders);
    setHasChanges(true);
  };

  const deleteSlider = (id: number) => {
    const newSliders = localSliders.filter(s => s.id !== id);
    setLocalSliders(newSliders);
    setSliders(newSliders);
    setHasChanges(true);
  };

  const saveChanges = () => {
    onSave(localSliders);
    setHasChanges(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
  <h3>📸 Слайдер (предпросмотр)</h3>
  <div className={styles.headerActions}>
    <div className={styles.addSection}>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Заголовок слайда"
        className={styles.addInput}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className={styles.imageInput}
      />
      <button onClick={addSlider} className={styles.addBtn} disabled={!newImage}>
        ➕ Добавить
      </button>
    </div>
    <button 
      onClick={saveChanges}
      className={`${styles.saveBtn} ${hasChanges ? styles.saveBtnActive : ''}`}
      disabled={!hasChanges}
    >
      💾 Сохранить {hasChanges && '(изменено)'}
    </button>
  </div>
</div>
           {/* ✅ ПРЕДПРОСМОТР */}
      <div className={styles.preview}>
        <div className={styles.sliderTrack}>
          {sliders.slice(0, 3).map((slider, index) => (
            <div key={slider.id} className={styles.previewSlide}>
              <div 
                className={styles.previewImage} 
                style={{ backgroundImage: `url(${slider.image})` }}
              >
                <div className={styles.previewOverlay}>
                  <span className={styles.previewTitle}>{slider.title}</span>
                  <span className={styles.previewIndex}>{index + 1}/3</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {sliders.length > 3 && (
          <div className={styles.moreSlides}>+{sliders.length - 3} дополнительных</div>
        )}
      </div>

      {/* ✅ РЕДАКТОР */}
      <div className={styles.editor}>
        <h4>📝 Редактировать слайды ({sliders.length})</h4>
        <div className={styles.list}>
          {localSliders.map((slider, index) => (
            <div
              key={slider.id}
              className={`${styles.sliderItem} ${draggedItem?.id === slider.id ? styles.dragging : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, slider)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className={styles.dragHandle}>☰</div>
              <div className={styles.index}>{index + 1}</div>
              
              <div className={styles.sliderPreview}>
                <div 
                  className={styles.sliderImage}
                  style={{ backgroundImage: `url(${slider.image})` }}
                />
              </div>
              
              <div className={styles.sliderContent}>
                <input
                  value={slider.title}
                  onChange={(e) => updateTitle(slider.id, e.target.value)}
                  className={styles.titleInput}
                  placeholder="Заголовок слайда"
                />
              </div>
              
              <button 
                onClick={() => deleteSlider(slider.id)}
                className={styles.deleteBtn}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.status}>
        {hasChanges 
          ? `✨ ${localSliders.length} слайдов изменено` 
          : `✅ ${sliders.length} слайдов готово`}
      </div>
    </div>
  );
}
