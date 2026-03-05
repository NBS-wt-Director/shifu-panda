'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, ImageIcon } from 'lucide-react';
import SiteHeader from '@/components/ui/SiteHeader';
import Footer from '@/components/Footer';
import SectionSpacer from '@/components/ui/SectionSpacer';
import FullScreenImageModal from '@/components/ui/FullScreenImageModal';
import GridSettings from '@/components/ui/GridSettings';
import styles from './page.module.css';
import Image from 'next/image';
import CallModal from "@/components/ui/CallModal";


interface Program {
  id: string | number;
  name: string;
  image: string;
  description?: string;
  photoAlbum?: { image: string; caption?: string }[];
}

export default function ProgramsPage() {
  const [siteSettings, setSiteSettings] = useState({ clientNotification: '' });
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalImage, setModalImage] = useState({ open: false, url: '', alt: '' });
  const [callModalOpen, setCallModalOpen] = useState(false);  // ✅ CallModal состояние
  const [callReason, setCallReason] = useState('Общий запрос');
  const [gridCols, setGridCols] = useState(3);

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
         setSiteSettings(data.settings || {});
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

  // Определяем класс сетки
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  }[gridCols] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader 
        pageTitle="Все программы тренировок"
        onOpenCallModal={openCallModal}
      />

      <SectionSpacer height="lg" background="default" />

      {/* ✅ ПЛИТКИ - ТОЧНАЯ КОпиЯ HomePrograms */}
      <section className={styles.programsSection}>
        <div className="max-w-6xl mx-auto px-4">
          {error || safePrograms.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-12 bg-gray-100 shadow-2xl">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">🏋️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Программы скоро появятся</h3>
                <p className="text-xl text-gray-500 max-w-md mx-auto">Следите за обновлениями!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Настройки сетки */}
              <GridSettings defaultCols={3} onChange={setGridCols} />
              
              <div className={`grid ${gridClass} gap-6 mb-16`}>
                {safePrograms.map((program) => {
                  return (
                  <div 
                    key={program.id} 
                    className="group cursor-pointer hover:translate-y-[-4px] transition-all duration-300 bg-white shadow-md hover:shadow-xl overflow-hidden border-2 border-gray-200 hover:border-emerald-500"
                  >
                    {/* ✅ КАРТИНКА - КЛИК = МОДАЛКА */}
                    <div 
                      className="w-full h-48 bg-gray-100 overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500"
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
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                      
                      {/* ✅ ДВЕ КНОПКИ - ТОЧНАЯ КОпиЯ HomePrograms */}
                      <div className="flex gap-3 justify-center">
                        <button 
                          className="px-6 py-2 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-md text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCallModal(`Программа: ${program.name}`);  // ✅ РАБОТАЕТ!
                          }}
                        >
                          Записаться
                        </button>
                        
                        <Link 
                          href={`/programs/${program.id}`}
                          className="px-6 py-2 bg-white text-emerald-600 font-semibold border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-md text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  </div>
                )})}
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
