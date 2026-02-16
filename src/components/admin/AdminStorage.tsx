'use client';
import { useState, useEffect } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import styles from './AdminStorage.module.css';

export default function AdminStorage() {
  const [storageInfo, setStorageInfo] = useState({
    total: 0,
    used: 0,
    unused: 0
  });
  const [loading, setLoading] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} МБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ГБ`;
  };

  const cleanupStorage = async () => {
    if (!confirm('Удалить все неиспользуемые медиафайлы?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/cleanup-storage', { method: 'POST' });
      const result = await res.json();
      setStorageInfo(result);
      alert(`Освобождено: ${formatSize(result.cleaned)}`);
    } catch {
      alert('Ошибка очистки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/storage-info')
      .then(res => res.json())
      .then(setStorageInfo);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className="text-4xl font-bold mb-8">💾 Использование хранилища</h2>
      
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl text-center shadow-xl">
          <div className="text-4xl font-black text-blue-600 mb-2">{formatSize(storageInfo.used)}</div>
          <div className="text-lg text-gray-600">Занято</div>
        </div>
        <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl text-center shadow-xl">
          <div className="text-4xl font-black text-emerald-600 mb-2">{formatSize(storageInfo.unused)}</div>
          <div className="text-lg text-gray-600">Мусор</div>
        </div>
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl text-center shadow-xl">
          <div className="text-4xl font-black text-gray-700 mb-2">{formatSize(storageInfo.total)}</div>
          <div className="text-lg text-gray-600">Всего</div>
        </div>
      </div>

      <div className="flex gap-4 p-8 bg-red-50 border-2 border-red-200 rounded-3xl">
        <button
          onClick={cleanupStorage}
          disabled={loading}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-6 px-8 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Trash2 size={24} />}
          Освободить {formatSize(storageInfo.unused)}
        </button>
        <button
          onClick={() => fetch('/api/storage-info').then(res => res.json()).then(setStorageInfo)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all px-6"
        >
          Обновить
        </button>
      </div>
    </div>
  );
}
