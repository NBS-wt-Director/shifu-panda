'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

interface Program {
  id: string;
  name: string;
  description: string;
  image: string;
  gallery?: string[];
  trainers?: Array<{
    id: string;
    name: string;
    image: string;
    experience: string;
  }>;
  workouts?: Array<{
    day: string;
    time: string;
    trainer: string;
    location: string;
  }>;
}

export default function ProgramPage({ params }: { params: Promise<{ id: string }> }) { // ← params как Promise
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [formReason, setFormReason] = useState('');
  const [siteSettings, setSiteSettings] = useState({ clientNotification: '' });

  // ✅ ИСПРАВЛЕНО: await params
  useEffect(() => {
    const loadProgram = async () => {
      const { id } = await params; // ← await params.id
      fetch(`/api/programs/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: Program) => {
          setProgram(data);
          setFormReason(`записаться на программу "${data.name}"`);
          
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ Ошибка загрузки программы:', err);
          setError('Программа не найдена');
          setLoading(false);
        });
    };

    loadProgram();
  }, [params]); // ← params целиком в зависимостях

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData, reason: formReason };

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: '', phone: '', email: '', message: '' });
        alert('✅ Заявка отправлена!');
      }
    } catch {
      alert('Ошибка отправки');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-8" />
          <p className="text-2xl">Загрузка программы...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    notFound();
  }

  return (
    // ... остальной JSX код БЕЗ ИЗМЕНЕНИЙ
    <div className="min-h-screen bg-gray-50">
      <Header
         pageTitle={program.name}
      />
      
      <section className="pt-24 pb-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12">{program.description}</p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <img 
                src={program.image} 
                alt={program.name}
                className="w-full h-96 md:h-[500px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = 
                    '<div class="w-full h-96 md:h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-3xl"><ImageIcon className="w-24 h-24 text-gray-400 mx-auto" /></div>';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Остальные секции без изменений */}
      {program.gallery && program.gallery.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-20 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent drop-shadow-2xl">
              📸 Фотогалерея
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {program.gallery.map((photo, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <img 
                    src={photo} 
                    alt={`Фото ${idx + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Кнопка записи */}
      <section className="py-24 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 drop-shadow-2xl">
            Записаться на программу
          </h2>
          <p className="text-xl text-yellow-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Оставьте заявку и наш менеджер свяжется с вами в ближайшее рабочее время
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-gray-900 px-16 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 mb-12"
          >
            Записаться сейчас
          </button>
        </div>
      </section>

      {/* Форма */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-3xl border border-white/50">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                Запись на "{program.name}"
              </h2>
              <button onClick={() => setShowForm(false)} className="p-3 hover:bg-gray-200 rounded-2xl transition-all">
                <X size={32} />
              </button>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input type="text" placeholder="Ваше имя *" required
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl font-semibold focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100" />
              <input type="tel" placeholder="+7 (___) ___-__-__ *" required
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl font-semibold focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100" />
              <input type="email" placeholder="email@example.com"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl font-semibold focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100" />
              <input type="text" placeholder="Желание" value={formReason} readOnly
                className="w-full p-6 border-2 border-yellow-200 bg-yellow-50 rounded-3xl text-xl font-semibold cursor-not-allowed" />
              <textarea placeholder="Вопросы по программе" rows={4}
                value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl font-semibold focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100" />
              <button type="submit" 
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-8 px-12 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center justify-center space-x-3">
                <CheckCircle size={32} />
                <span>Записаться на программу</span>
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
