'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Program {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка данных программ
  useEffect(() => {
    fetch('/api/programs')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Program[]) => {
        console.log('✅ Программы загружены:', data);
        setPrograms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Ошибка загрузки программ:', err);
        setError('Ошибка загрузки данных');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-8" />
          <p className="text-2xl">Загрузка программ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Заголовок */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent drop-shadow-2xl mb-8">
            🥋 Программы тренировок
          </h1>
       
        </div>
      </section>

      {/* Плитки программ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {error || programs.length === 0 ? (
            <div className="text-center py-32">
              <ImageIcon className="w-32 h-32 text-gray-300 mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-black text-gray-400 mb-6">
                Данные не заполнены
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Программы тренировок скоро появятся. Следите за обновлениями!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {programs.map((program) => (
                <Link 
                  key={program.id} 
                  href={`/programs/${program.id}`}
                  className="group relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 hover:scale-105 border border-gray-100 hover:border-yellow-200 overflow-hidden h-[420px] flex flex-col"
                >
                  {/* Фото программы */}
                  <div className="relative flex-shrink-0 mb-6 h-64 rounded-2xl bg-cover bg-center shadow-2xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                    <div 
                      style={{ backgroundImage: `url(${program.image})` }} 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:bg-black/20 transition-all duration-500" />
                  </div>
                  
                  {/* Название */}
                  <div className="flex-1 flex flex-col justify-end">
                    <h3 className="text-2xl md:text-3xl font-black text-center mb-4 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent group-hover:scale-105 transition-all">
                      {program.name}
                    </h3>
                    {program.description && (
                      <p className="text-lg text-gray-600 text-center leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Overlay при ховере */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <span className="text-white text-xl font-bold bg-yellow-400/90 px-6 py-3 rounded-2xl shadow-2xl">
                      Подробнее →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
