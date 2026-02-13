'use client';
import { useState, useEffect } from 'react';
import { Lock, Trash2, Edit3, Plus, Loader2 } from 'lucide-react';

export default function AdminPanel() {
  // Состояния
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('sliders');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState<any>({});
  const [changesCount, setChangesCount] = useState(0);
  const [data, setData] = useState({
    sliders: [],
    trainers: [],
    employees: [],
    programs: [],
    news: [],
    contacts: { address: '', phone: '', email: '', telegram: '', vk: '' },
    emailConfig: {
      smtpHost: 'smtp.yandex.ru',
      smtpPort: 465,
      smtpSecure: true,
      smtpUser: '',
      smtpPass: '',
      fromName: 'Шифу Панда',
      adminEmail: 'i@o8eryuhtin.ru',
      errorEmail: 'i@o8eryuhtin.ru'
    }
  });
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    name: '',
    desc: '',
    img: null as File | null,
    type: 'trainer' as 'trainer' | 'employee',
    position: '',
    isDirector: false,
    specialization: '',
    photoAlbum: [] as Array<{image: string, caption: string}>
  });
  const [loading, setLoading] = useState(false);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/db');
        const serverData = await res.json();
        setOriginalData(serverData);
        setData({
          sliders: serverData.sliders || [],
          trainers: serverData.trainers || [],
          employees: serverData.employees || [],
          programs: serverData.programs || [],
          news: serverData.news || [],
          contacts: serverData.contacts || { address: '', phone: '', email: '', telegram: '', vk: '' },
          emailConfig: serverData.emailConfig || {
            smtpHost: 'smtp.yandex.ru', smtpPort: 465, smtpSecure: true,
            smtpUser: '', smtpPass: '', fromName: 'Шифу Панда',
            adminEmail: 'i@o8eryuhtin.ru', errorEmail: 'i@o8eryuhtin.ru'
          }
        });
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      }
    };
    loadData();
  }, []);

  // Отслеживание изменений
  useEffect(() => {
    const countChanges = () => {
      let count = 0;
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            const origItems = originalData[key] || [];
            if (origItems.some((orig: any) => orig.id === item.id && JSON.stringify(orig) !== JSON.stringify(item))) {
              count++;
            }
          });
        }
      });
      setChangesCount(count);
    };
    if (Object.keys(originalData).length > 0) countChanges();
  }, [data, originalData]);

  // Функции
  const login = () => {
    if (password === 'цфр2026') {
      setIsAuth(true);
    } else {
      alert('Неверный пароль!');
    }
  };

  const logout = () => {
    setIsAuth(false);
    setPassword('');
  };

  const editItem = (id: number) => {
    setEditingId(id);
    const items = data[activeTab as keyof typeof data] as any[];
    const item = items.find((i: any) => i.id === id);
    
    if (item) {
      setFormData({
        title: item.title || '',
        text: item.experience || item.text || '',
        name: item.name || '',
        desc: item.description || '',
        img: null, // Новая аватарка только при выборе
        type: (item.type as 'trainer' | 'employee') || 'trainer',
        position: item.position || '',
        isDirector: !!item.isDirector,
        specialization: item.specialization || '',
        photoAlbum: item.photoAlbum || [] // ✅ Загружаем фотогалерею из БД
      });
    }
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '', text: '', name: '', desc: '', img: null,
      type: 'trainer', position: '', isDirector: false, 
      specialization: '', photoAlbum: []
    });
    setShowForm(false);
  };

  const saveAll = async () => {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetch('/api/send-changes-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changesCount })
        }).catch(console.error);
        alert(`✅ Сохранено! Изменений: ${changesCount}`);
        setOriginalData({ ...data });
      } else {
        alert('❌ Ошибка сохранения');
      }
    } catch {
      alert('❌ Ошибка сети');
    }
  };

  const uploadFile = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
      const json = await res.json();
      return json.success ? json.url : null;
    } catch {
      return null;
    }
  };

  // ✅ Функция загрузки фото в галерею
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData.type === 'trainer') {
      setLoading(true);
      try {
        const url = await uploadFile(file);
        if (url) {
          setFormData({
            ...formData,
            photoAlbum: [...formData.photoAlbum, { image: url, caption: `Фото ${formData.photoAlbum.length + 1}` }]
          });
        } else {
          alert('Ошибка загрузки фото');
        }
      } catch {
        alert('Ошибка загрузки фото');
      } finally {
        setLoading(false);
      }
    }
  };

  const saveItem = async () => {
    if (!formData.name.trim()) {
      alert('Введите ФИО!');
      return;
    }
    if (!formData.img && editingId === null) {
      alert('Выберите основную картинку!');
      return;
    }
    if (formData.type === 'employee' && !formData.position.trim()) {
      alert('Введите должность сотрудника!');
      return;
    }

    setLoading(true);
    try {
      let imgUrl = formData.img ? await uploadFile(formData.img) : null;
      if (formData.img && !imgUrl) throw new Error('Ошибка загрузки аватарки');

      const itemData: any = {
        id: editingId || Date.now(),
        ...(imgUrl && { image: imgUrl }),
        name: formData.name,
        type: formData.type
      };

      // Логика сохранения по вкладкам
      if (activeTab === 'sliders') {
        itemData.description = formData.desc || 'Новый слайд';
      } else if (activeTab === 'programs') {
        itemData.description = formData.text || 'Описание программы';
        itemData.photoAlbum = formData.photoAlbum || [];
      } else if (activeTab === 'news') {
        itemData.title = formData.title || 'Новость';
        itemData.text = formData.text || 'Текст';
      } else if (activeTab === 'trainers' || activeTab === 'employees') {
        if (formData.type === 'employee') {
          itemData.position = formData.position;
        } else { // trainer
          itemData.experience = formData.text || '';
          itemData.description = formData.desc || '';
          itemData.specialization = formData.specialization || '';
          itemData.isDirector = !!formData.isDirector;
          itemData.photoAlbum = formData.photoAlbum || [];
        }
      }

      if (editingId !== null) {
        setData(prev => ({
          ...prev,
          [activeTab]: (prev[activeTab as keyof typeof prev] as any[]).map((item: any) =>
            item.id === editingId ? { ...item, ...itemData } : item
          )
        }));
        alert('✅ Тренер/сотрудник обновлен!');
      } else {
        setData(prev => ({
          ...prev,
          [activeTab]: [...(prev[activeTab as keyof typeof prev] as any[]), itemData]
        }));
        alert('✅ Тренер/сотрудник добавлен!');
      }
    } catch (error) {
      console.error(error);
      alert('❌ Ошибка при сохранении!');
    } finally {
      setLoading(false);
      cancelEdit();
    }
  };

  const deleteItem = (id: number) => {
    if (confirm('Удалить навсегда?')) {
      setData(prev => ({
        ...prev,
        [activeTab]: (prev[activeTab as keyof typeof prev] as any[]).filter((item: any) => item.id !== id)
      }));
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900">
        <div className="bg-white/10 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-white/20">
          <Lock className="w-24 h-24 mx-auto mb-8 text-yellow-400 drop-shadow-lg" />
          <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-xl">🔐 Админка</h1>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-6 bg-white/20 border-2 border-white/30 rounded-3xl text-white placeholder-gray-300 text-xl mb-8 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
            placeholder="Введите пароль"
          />
          <button
            onClick={login}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-6 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Шапка */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-12 border border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              🐼 Шифу Панда - Админка
            </h1>
            <div className="flex gap-4">
              <button
                onClick={saveAll}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
              >
                💾 Сохранить все ({changesCount})
              </button>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                🚪 Выход
              </button>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-2xl mb-12 border border-gray-200 flex flex-wrap gap-2 justify-center">
          {['sliders', 'programs', 'trainers', 'employees', 'news', 'contacts'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setShowForm(false);
              }}
              className={`px-6 py-6 rounded-2xl font-bold text-xl transition-all flex-1 min-w-[140px] ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-xl scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:scale-[1.02]'
              }`}
            >
              {tab === 'sliders' && '🖼️ Слайдеры'}
              {tab === 'programs' && '🎯 Программы'}
              {tab === 'trainers' && '👨‍🏫 Тренеры'}
              {tab === 'employees' && '👥 Сотрудники'}
              {tab === 'news' && '📰 Новости'}
              {tab === 'contacts' && '📞 Контакты'}
            </button>
          ))}
        </div>

        {/* Форма добавления/редактирования */}
        {showForm && activeTab !== 'contacts' && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl mb-12 border border-gray-200">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800">
                {editingId ? '✏️ Редактировать' : '➕ Добавить'} {activeTab === 'sliders' ? 'слайд' : 
                activeTab === 'programs' ? 'программу' : 
                activeTab === 'trainers' || activeTab === 'employees' ? 
                (formData.type === 'trainer' ? 'тренера' : 'сотрудника') : 'новость'}
              </h2>
              <button onClick={cancelEdit} className="text-4xl hover:scale-110 transition-all">✕</button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                {/* Выбор типа для trainers/employees */}
                {(activeTab === 'trainers' || activeTab === 'employees') && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200">
                    <label className="flex items-center gap-4 text-xl font-bold mb-4">
                      <span>Тип:</span>
                      <div className="flex gap-4 p-4 bg-white rounded-2xl border-2 border-gray-200 w-full">
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl hover:bg-blue-50 flex-1 transition-all">
                          <input 
                            type="radio" 
                            name="type" 
                            checked={formData.type === 'trainer'}
                            onChange={() => setFormData({...formData, type: 'trainer' as const})}
                            className="w-6 h-6 text-blue-600 border-4 border-gray-300 rounded"
                          />
                          <div>
                            <span className="font-bold text-lg block">👨‍🏫 Тренер</span>
                            <span className="text-sm text-blue-700">Описание, фотогалерея, страница</span>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl hover:bg-green-50 flex-1 transition-all">
                          <input 
                            type="radio" 
                            name="type" 
                            checked={formData.type === 'employee'}
                            onChange={() => setFormData({...formData, type: 'employee' as const})}
                            className="w-6 h-6 text-green-600 border-4 border-gray-300 rounded"
                          />
                          <div>
                            <span className="font-bold text-lg block">👤 Сотрудник</span>
                            <span className="text-sm text-green-700">Имя, должность</span>
                          </div>
                        </label>
                      </div>
                    </label>
                  </div>
                )}

                {/* Поля формы */}
                {activeTab === 'sliders' && (
                  <input 
                    value={formData.desc} 
                    onChange={e => setFormData({...formData, desc: e.target.value})} 
                    placeholder="Подпись к слайду" 
                    className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold" 
                  />
                )}
                
                {(activeTab === 'trainers' || activeTab === 'employees') && (
                  <>
                    <input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      placeholder="ФИО *" 
                      className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold" 
                    />
                    
                    {formData.type === 'employee' && (
                      <input 
                        value={formData.position} 
                        onChange={e => setFormData({...formData, position: e.target.value})} 
                        placeholder="Должность (Администратор, Уборщик и т.д.) *" 
                        className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-green-300 font-semibold" 
                      />
                    )}
                    
                    {formData.type === 'trainer' && (
                      <>
                        <input 
                          value={formData.specialization} 
                          onChange={e => setFormData({...formData, specialization: e.target.value})} 
                          placeholder="Специализация (например: Кроссфит, Йога)" 
                          className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold" 
                        />
                        <textarea 
                          value={formData.text} 
                          onChange={e => setFormData({...formData, text: e.target.value})} 
                          placeholder="Опыт работы" 
                          rows={3} 
                          className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-blue-300 resize-vertical font-semibold" 
                        />
                        <textarea 
                          value={formData.desc} 
                          onChange={e => setFormData({...formData, desc: e.target.value})} 
                          placeholder="Подробное описание тренера" 
                          rows={6} 
                          className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-blue-300 resize-vertical font-semibold" 
                        />
                        
                        {/* Директор */}
                        <label className="flex items-center gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl border-2 border-yellow-200 cursor-pointer hover:border-yellow-300 transition-all">
                          <input 
                            type="checkbox" 
                            checked={formData.isDirector} 
                            onChange={e => setFormData({...formData, isDirector: e.target.checked})} 
                            className="w-7 h-7 rounded text-yellow-600 border-4 border-gray-300" 
                          />
                          <div>
                            <span className="text-2xl font-black text-yellow-900">👑 Директор</span>
                            <p className="text-sm text-yellow-800 mt-1">Только один тренер может быть директором</p>
                          </div>
                        </label>

                        {/* ✅ ФОТОГАЛЕРЕЯ */}
                        <div className="p-8 border-2 border-dashed border-emerald-300 rounded-3xl hover:border-emerald-400 bg-emerald-50/50">
                          <h4 className="font-bold text-2xl mb-6 pb-4 border-b border-emerald-200 flex items-center gap-2">
                            🖼️ Фотогалерея ({formData.photoAlbum.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {formData.photoAlbum.map((photo, index) => (
                              <div key={index} className="group relative bg-gray-100 rounded-2xl overflow-hidden hover:ring-4 ring-red-300 hover:scale-105 transition-all">
                                <img 
                                  src={photo.image} 
                                  alt={photo.caption} 
                                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-200" 
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                  <button 
                                    onClick={() => setFormData({
                                      ...formData, 
                                      photoAlbum: formData.photoAlbum.filter((_, i) => i !== index)
                                    })}
                                    className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:bg-red-600 transition-all"
                                    title="Удалить фото"
                                  >
                                    ×
                                  </button>
                                </div>
                                <p className="text-xs px-2 py-1 bg-white/90 truncate text-center font-medium">{photo.caption}</p>
                              </div>
                            ))}
                          </div>
                          
                          {/* Кнопка добавления фото */}
                          <div className="border-2 border-dashed border-emerald-400 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer group relative">
                            <Plus className="w-16 h-16 text-emerald-500 group-hover:scale-110 transition-all mb-4" />
                            <span className="text-xl font-bold text-emerald-700 mb-2">Добавить фото в галерею</span>
                            <span className="text-sm text-emerald-600">Кликните или перетащите</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handlePhotoUpload}
                              disabled={loading}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {activeTab === 'programs' && (
                  <>
                    <input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      placeholder="Название программы" 
                      className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 font-semibold" 
                    />
                    <textarea 
                      value={formData.text} 
                      onChange={e => setFormData({...formData, text: e.target.value})} 
                      placeholder="Описание программы" 
                      rows={6} 
                      className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 resize-vertical font-semibold" 
                    />
                  </>
                )}

                {activeTab === 'news' && (
                  <>
                    <input 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      placeholder="Заголовок новости" 
                      className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold" 
                    />
                    <textarea 
                      value={formData.text} 
                      onChange={e => setFormData({...formData, text: e.target.value})} 
                      placeholder="Текст новости" 
                      rows={5} 
                      className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-blue-300 resize-vertical font-semibold" 
                    />
                  </>
                )}
              </div>

              <div>
                <label className="block mb-6 font-bold text-2xl text-gray-800">📁 Основная картинка (аватарка)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFormData({...formData, img: e.target.files?.[0] || null})}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-3xl hover:border-blue-400 text-xl cursor-pointer"
                />
                {formData.img && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-2xl text-center">
                    <img 
                      src={URL.createObjectURL(formData.img)} 
                      alt="Предпросмотр аватарки" 
                      className="max-h-80 max-w-full mx-auto rounded-2xl shadow-xl object-contain" 
                    />
                    <p className="text-sm text-gray-600 mt-2">Новая аватарка готова к загрузке</p>
                  </div>
                )}
                {editingId && !formData.img && (
                  <p className="text-sm text-gray-500 mt-2 italic">★ Текущая аватарка сохранится</p>
                )}
              </div>
            </div>

            <div className="flex gap-6 pt-8">
              <button
                onClick={saveItem}
                disabled={loading || (!formData.img && editingId === null) || (!formData.name.trim())}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 text-white py-8 px-12 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Plus className="w-10 h-10" />}
                {loading ? 'Загрузка...' : editingId ? 'Обновить' : 'Добавить'}
              </button>
              <button 
                onClick={cancelEdit} 
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-8 px-12 rounded-3xl font-bold text-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Контакты */}
        {activeTab === 'contacts' && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-16 shadow-2xl border border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              📞 Контакты
            </h2>
            <div className="space-y-8">
              <input 
                value={data.contacts.address} 
                onChange={e => setData(prev => ({...prev, contacts: {...prev.contacts, address: e.target.value}}))} 
                placeholder="г. Екатеринбург, ул. Ленина, 25" 
                className="w-full p-8 border-2 border-gray-200 rounded-3xl text-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold" 
              />
              <input 
                value={data.contacts.phone} 
                onChange={e => setData(prev => ({...prev, contacts: {...prev.contacts, phone: e.target.value}}))} 
                placeholder="+7 (343) 123-45-67" 
                className="w-full p-8 border-2 border-gray-200 rounded-3xl text-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold" 
              />
              <input 
                value={data.contacts.email} 
                onChange={e => setData(prev => ({...prev, contacts: {...prev.contacts, email: e.target.value}}))} 
                placeholder="email@example.com" 
                className="w-full p-8 border-2 border-gray-200 rounded-3xl text-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold" 
              />
              <input 
                value={data.contacts.telegram} 
                onChange={e => setData(prev => ({...prev, contacts: {...prev.contacts, telegram: e.target.value}}))} 
                placeholder="@telegram или t.me/link" 
                className="w-full p-8 border-2 border-gray-200 rounded-3xl text-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold" 
              />
              <input 
                value={data.contacts.vk} 
                onChange={e => setData(prev => ({...prev, contacts: {...prev.contacts, vk: e.target.value}}))} 
                placeholder="vk.com/group" 
                className="w-full p-8 border-2 border-gray-200 rounded-3xl text-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold" 
              />
              <button 
                onClick={saveAll} 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-10 px-16 rounded-3xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all block mx-auto"
              >
                💾 Сохранить контакты
              </button>
            </div>
          </div>
        )}

        {/* Список элементов */}
        {activeTab !== 'contacts' && !showForm && (
          <>
            <div className="flex justify-center mb-16">
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-20 py-10 rounded-3xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all flex items-center gap-4"
              >
                <Plus className="w-12 h-12" />
                Добавить {activeTab === 'sliders' ? 'слайд' : activeTab === 'programs' ? 'программу' : activeTab === 'trainers' ? 'тренера' : activeTab === 'employees' ? 'сотрудника' : 'новость'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.isArray(data[activeTab as keyof typeof data]) && data[activeTab as keyof typeof data].length > 0 ? 
                data[activeTab as keyof typeof data].map((item: any) => {
                  const isChanged = originalData[activeTab as keyof typeof originalData]?.some((orig: any) => 
                    orig.id === item.id && JSON.stringify(orig) !== JSON.stringify(item)
                  );
                  return (
                    <div key={item.id} className={`group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:-translate-y-4 transition-all duration-300 border border-gray-200 overflow-hidden h-full relative ${isChanged ? 'ring-4 ring-yellow-300 border-yellow-400' : ''}`}>
                      {isChanged && (
                        <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          ✏️ Изменено
                        </div>
                      )}
                      
                      <div className="relative mb-6">
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                          onError={e => (e.target as HTMLImageElement).src = '/placeholder.jpg'}
                        />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-sm p-3 rounded-2xl">
                          <button onClick={() => editItem(item.id)} className="p-2 hover:bg-blue-500/20 rounded-xl transition-all" title="Редактировать">
                            <Edit3 className="w-5 h-5 text-white" />
                          </button>
                          <button onClick={() => deleteItem(item.id)} className="p-2 hover:bg-red-500/20 rounded-xl transition-all" title="Удалить">
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Контент плитки */}
                      {activeTab === 'sliders' && (
                        <div>
                          <p className="text-xl font-bold text-gray-800 line-clamp-2 mb-2">{item.description || 'Без подписи'}</p>
                          <p className="text-sm text-gray-500">Слайд #{item.id}</p>
                        </div>
                      )}
                      
                      {(activeTab === 'trainers' || activeTab === 'employees') && (
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                          {item.type === 'trainer' ? (
                            <div>
                              <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm mb-2">🏋️ Тренер</span>
                              {item.isDirector && <span className="ml-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold mb-2">👑 Директор</span>}
                              <p className="text-lg text-gray-700 mb-1 line-clamp-1">{item.experience}</p>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                              {item.photoAlbum?.length > 0 && (
                                <p className="text-xs bg-blue-100 px-2 py-1 rounded flex items-center gap-1">
                                  📸 {item.photoAlbum.length} фото
                                </p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p className="text-lg text-blue-700 font-semibold line-clamp-1">{item.position}</p>
                              <p className="text-sm text-gray-500">👤 Сотрудник</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {activeTab === 'programs' && (
                        <div>
                          <h3 className="text-2xl font-bold text-emerald-900 mb-2 line-clamp-2">{item.name || 'Без названия'}</h3>
                          <p className="text-gray-700 mb-4 line-clamp-3 bg-emerald-50 p-3 rounded-xl">{item.description || 'Описание не указано'}</p>
                          <p className="text-sm text-gray-500">🎯 Программа #{item.id}</p>
                        </div>
                      )}
                      
                      {activeTab === 'news' && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.title || 'Без заголовка'}</h3>
                          <p className="text-gray-700 mb-4 line-clamp-3">{item.text || 'Без текста'}</p>
                          <p className="text-sm text-gray-500">#{item.id}</p>
                        </div>
                      )}
                    </div>
                  );
                }) : (
                  <div className="col-span-full text-center py-32">
                    <div className="text-6xl mb-8">📭</div>
                    <h3 className="text-4xl font-bold text-gray-500 mb-4">Пусто</h3>
                    <p className="text-xl text-gray-400 mb-12">Добавьте первый элемент</p>
                  </div>
                )
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
