'use client';
import { useState, useEffect } from 'react';
import styles from './AdminPrograms.module.css';

interface Photo {
  url: string;
  caption: string;
  views: number;
}

interface Program {
  id: number;
  image: string;
  name: string;
  type: string;
  description: string;
  photoAlbum: Photo[];
  trainers: any[];
  trainings: any[];
  reviews: any[];
}

interface AdminProgramsProps {
  programs: Program[];
  onSave: (programs: Program[]) => void;
}

export default function AdminPrograms({ programs: initialPrograms = [] as Program[], onSave }: AdminProgramsProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [localPrograms, setLocalPrograms] = useState<Program[]>([]);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState('');
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // ✅ БЕЗОПАСНАЯ загрузка данных
    const safePrograms = (initialPrograms || []).map(program => ({
      ...program,
      photoAlbum: program.photoAlbum || [],
      trainers: program.trainers || [],
      trainings: program.trainings || [],
      reviews: program.reviews || [],
      description: program.description || ''
    }));
    setPrograms(safePrograms);
    setLocalPrograms(safePrograms);
  }, [initialPrograms]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setNewImagePreview(reader.result as string);
    }
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProgram) {
      setEditingImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImagePreview(reader.result as string);
        setEditingProgram({
          ...editingProgram,
          image: reader.result as string
        });
      };
    }
  };

  const addProgram = () => {
    if (!newImage || !newProgram.name.trim()) return;
    
    const program: Program = {
      id: Date.now(),
      image: URL.createObjectURL(newImage),
      name: newProgram.name,
      type: 'trainer',
      description: newProgram.description || '',
      photoAlbum: [],
      trainers: [],
      trainings: [],
      reviews: []
    };
    
    const newPrograms = [program, ...localPrograms];
    setLocalPrograms(newPrograms);
    setPrograms(newPrograms);
    setNewProgram({ name: '', description: '', image: '' });
    setNewImage(null);
    setNewImagePreview('');
    setEditingProgram(null);
    setHasChanges(true);
  };

  const updateProgram = (program: Program) => {
    if (!editingProgram) return;
    const newPrograms = localPrograms.map(p => p.id === editingProgram.id ? program : p);
    setLocalPrograms(newPrograms);
    setPrograms(newPrograms);
    setHasChanges(true);
    setEditingProgram(null);
  };

  const deleteProgram = (id: number) => {
    const newPrograms = localPrograms.filter(p => p.id !== id);
    setLocalPrograms(newPrograms);
    setPrograms(newPrograms);
    setHasChanges(true);
  };

  const addPhotoToAlbum = (programId: number, photo: Photo) => {
    const newPrograms = localPrograms.map(program => {
      if (program.id === programId) {
        return { 
          ...program, 
          photoAlbum: [...(program.photoAlbum || []), photo] 
        };
      }
      return program;
    });
    setLocalPrograms(newPrograms);
    setPrograms(newPrograms);
    setHasChanges(true);
  };

  const saveChanges = () => {
    onSave(localPrograms);
    setHasChanges(false);
  };

  // ✅ БЕЗОПАСНЫЕ геттеры
  const safeProgramStats = (program: Program) => ({
    photoAlbumLength: (program.photoAlbum || []).length,
    trainersLength: (program.trainers || []).length,
    descriptionPreview: (program.description || '').substring(0, 80)
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>🎯 Программы ({programs.length})</h3>
      </div>

      <div className={styles.content}>
        {/* 1. ФОРМА НОВОЙ ПРОГРАММЫ */}
        <div className={styles.formsSection}>
          <h4>➕ Создать новую программу</h4>
          <div className={styles.addSection}>
            <input
              value={newProgram.name}
              onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
              placeholder="Название программы"
              className={styles.input}
            />
            <textarea
              value={newProgram.description}
              onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
              placeholder="Описание программы"
              className={styles.textarea}
              rows={3}
            />
            <div className={styles.imagePreview}>
              {newImagePreview && (
                <img src={newImagePreview} alt="Preview" className={styles.previewImg} />
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect} 
              className={styles.fileInput} 
            />
            <button 
              onClick={addProgram} 
              className={styles.addBtn} 
              disabled={!newImage || !newProgram.name.trim()}
            >
              ➕ Создать программу
            </button>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* 2. ФОРМА РЕДАКТИРОВАНИЯ */}
          <div className={styles.formSection}>
            {editingProgram ? (
              <div className={styles.editForm}>
                <h4>✏️ Редактировать: {editingProgram.name}</h4>
                <div className={styles.formFields}>
                  <div className={styles.field}>
                    <label>Название</label>
                    <input 
                      value={editingProgram.name}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram, name: e.target.value
                      })}
                      className={styles.input} 
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label>Описание</label>
                    <textarea 
                      value={editingProgram.description || ''}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram, description: e.target.value
                      })}
                      className={styles.textarea} 
                      rows={6} 
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label>Главное фото</label>
                    <div className={styles.imagePreview}>
                      <img 
                        src={editingProgram.image} 
                        alt="Preview" 
                        className={styles.previewImg}
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageSelect}
                      className={styles.fileInput}
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label>Фотогалерея ({(editingProgram.photoAlbum || []).length})</label>
                    <div className={styles.photoAlbumPreview}>
                      {(editingProgram.photoAlbum || []).slice(0, 6).map((photo, index) => (
                        <div key={index} className={styles.photoMini}>
                          <img src={photo.url} alt={photo.caption} />
                          <span>{photo.caption}</span>
                        </div>
                      ))}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && editingProgram) {
                          const photo: Photo = {
                            url: URL.createObjectURL(file),
                            caption: `Фото ${((editingProgram.photoAlbum || []).length + 1)}`,
                            views: 0
                          };
                          addPhotoToAlbum(editingProgram.id, photo);
                        }
                      }}
                      className={styles.fileInput} 
                    />
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    className={styles.saveProgramBtn} 
                    onClick={() => updateProgram(editingProgram)}
                  >
                    💾 Обновить
                  </button>
                  <button 
                    className={styles.deleteProgramBtn} 
                    onClick={() => deleteProgram(editingProgram.id)}
                  >
                    🗑️ Удалить
                  </button>
                  <button 
                    className={styles.cancelBtn} 
                    onClick={() => setEditingProgram(null)}
                  >
                    ❌ Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.noSelection}>
                <h4>👆 Выберите программу для редактирования</h4>
                <p>Используйте кнопки ✏️ на плитках справа</p>
              </div>
            )}
          </div>

          {/* 3. ПЛИТКИ */}
          <div className={styles.programsList}>
  <h4>📋 Все программы ({programs.length})</h4>
  <div className={styles.divider}></div>
  <div className={styles.grid}>
    {programs.map(program => {
      const stats = safeProgramStats(program);
      return (
        <div key={program.id} className={styles.programCard}>
          {/* ✅ КНОПКИ ПРЯМО ПЕРВЫМИ */}
          <div className={styles.programButtons}>
            <button 
              className={styles.editProgramBtn}
              onClick={(e) => {
                e.stopPropagation();
                setEditingProgram(program);
              }}
              title="Редактировать"
            >
              ✏️
            </button>
            <button 
              className={styles.deleteProgramBtn}
              onClick={(e) => {
                e.stopPropagation();
                deleteProgram(program.id);
              }}
              title="Удалить"
            >
              🗑️
            </button>
          </div>
          
          <div 
            className={styles.programImage} 
            style={{ backgroundImage: `url(${program.image})` }} 
          />
          <div className={styles.programInfo}>
            <h5>{program.name}</h5>
            <p>{stats.descriptionPreview}...</p>
            <div className={styles.programStats}>
              <span>📸 {stats.photoAlbumLength}</span>
              <span>👨‍🏫 {stats.trainersLength}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

        </div>

        <div className={styles.saveSection}>
          <button 
            onClick={saveChanges}
            className={`${styles.saveBtn} ${hasChanges ? styles.saveBtnActive : ''}`}
            disabled={!hasChanges}
          >
            💾 Сохранить все изменения {hasChanges && '(изменено)'}
          </button>
        </div>

        <div className={styles.status}>
          {hasChanges ? '✨ Изменения ждут сохранения' : '✅ Все изменения сохранены'}
        </div>
      </div>
    </div>
  );
}
