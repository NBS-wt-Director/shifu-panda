'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionSpacer from '@/components/ui/SectionSpacer';
import FullScreenImageModal from '@/components/ui/CallModal'; // ✅ CallModal тоже!
import styles from './page.module.css';
import Image from 'next/image';
import CallModal from "@/components/ui/CallModal";


interface Program {
  id: string | number;
  name: string;
  image: string;
  description?: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalImage, setModalImage] = useState({ open: false, url: '', alt: '' });
  const [callModalOpen, setCallModalOpen] = useState(false);  // ✅ CallModal состояние
  const [callReason, setCallReason] = useState('Общий запрос');

  // ✅ openCallModal ФУНКЦИЯ
  const openCallModal = (reason: string = 'Общий запрос') => {
    setCallReason(reason);
    setCallModalOpen(true);
  };

  // ✅ ЗАГРУЗКА ДАННЫХ
  useEffect(() => {
    fetch('/api/db')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: any) => {
        const safePrograms: Program[] = Array.isArray(data.programs)
          ? data.programs.filter((p: any): p is Program => 
              p && p.id && p.name && p.image
            )
          : [];
        setPrograms(safePrograms);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Ошибка:', err);
        setError('Ошибка загрузки');
        setLoading(false);
      });
  }, []);

  const openImageModal = (url: string, alt: string) => {
    setModalImage({ open: true, url, alt });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-500">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-8" />
          <p className="text-2xl font-bold">Загрузка...</p>
        </div>
      </div>
    );
  }

  const safePrograms = Array.isArray(programs) ? programs : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header С OpenCallModal */}
      <Header 
        pageTitle="Все программы тренировок"
        openCallModal={openCallModal}  // ✅ ПЕРЕДАЁМ!
      />

      {/* ✅ Заголовок */}
      
      <SectionSpacer height="lg" background="default" />

      {/* ✅ ПЛИТКИ - ТОЧНАЯ КОпиЯ HomePrograms */}
      <section className={styles.programsSection}>
        <div className="max-w-6xl mx-auto px-4">
          {error || safePrograms.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-12 bg-gray-100 rounded-br-[1%] shadow-2xl">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">🏋️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Программы скоро появятся</h3>
                <p className="text-xl text-gray-500 max-w-md mx-auto">Следите за обновлениями!</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {safePrograms.map((program) => (
                  <div 
                    key={program.id} 
                    className="group cursor-pointer hover:scale-[1.02] transition-all duration-300"
                  >
                    {/* ✅ КАРТИНКА - КЛИК = МОДАЛКА */}
                    <div 
                      className="w-full h-80 bg-gray-100 rounded-br-[1%] overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
                      onClick={() => openImageModal(program.image, program.name)}
                    >
                      <Image
                        src={program.image}
                        alt={program.name}
                        width={400}
                        height={320}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* ✅ КОНТЕНТ + КНОПКИ - ТОЧНАЯ КОпиЯ */}
                    <div className="mt-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{program.name}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                      
                      {/* ✅ ДВЕ КНОПКИ - ТОЧНАЯ КОпиЯ HomePrograms */}
                      <div className="flex gap-4 justify-center">
                        <button 
                          className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCallModal(`Программа: ${program.name}`);  // ✅ РАБОТАЕТ!
                          }}
                        >
                          Записаться
                        </button>
                        
                        <Link 
                          href={`/programs/${program.id}`}
                          className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-md border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Подробнее →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ КНОПКА "ВСЕ ПРОГРАММЫ" - ТОЧНАЯ КОпиЯ */}
              <div className="text-center">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 text-white font-black rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 text-xl backdrop-blur-xl border border-emerald-400/30 hover:from-emerald-700 hover:to-green-700 group"
                >
                  <span>🏠 На главную</span>
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />

      {/* ✅ МОДАЛКИ */}
      <FullScreenImageModal 
        isOpen={modalImage.open}
        imageUrl={modalImage.url}
        alt={modalImage.alt}
        onClose={() => setModalImage({ open: false, url: '', alt: '' })}
      />
      
      <CallModal 
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        reason={callReason}
      />
    </div>
  );
}
