'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GridSettings from '@/components/ui/GridSettings';
import styles from './HomePrograms.module.css';

interface Program {
  id: number | string;
  image: string;
  name: string;
  description: string;
  photoAlbum?: { image: string; caption?: string }[];
}

interface HomeProgramsProps {
  programs?: Program[];
  openCallModal?: (reason: string) => void;
  openImageModal?: (url: string, alt: string) => void;
}

export default function HomePrograms({
  programs = [],
  openCallModal = () => {},
  openImageModal = () => {}
}: HomeProgramsProps) {
  const [gridCols, setGridCols] = useState(3);
  
  const safePrograms: Program[] = Array.isArray(programs) 
    ? programs.filter((p): p is Program => p && p.id && p.name && p.image)
    : [];

  // Определяем класс сетки
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  }[gridCols] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="programs" className={styles.programs}>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-2xl">
          Программы тренировок
        </h2>
        
        {safePrograms.length > 0 ? (
          <>
            {/* Настройки сетки */}
            <GridSettings defaultCols={3} onChange={setGridCols} />
            
            {/* ✅ ПЛИТКИ С КНОПКАМИ */}
            <div className={`grid ${gridClass} gap-6 mb-16`}>
              {safePrograms.map((program) => {
                const photoCount = program.photoAlbum?.length || 0;
                return (
                <div 
                  key={program.id} 
                  className="group cursor-pointer hover:translate-y-[-4px] transition-all duration-300 bg-white shadow-md hover:shadow-xl overflow-hidden border-2 border-gray-200 hover:border-emerald-500"
                >
                  {/* Отогнутый уголок - синий для программ */}
                  <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-bl from-transparent to-blue-500 z-10" />
                  <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-bl from-transparent to-blue-400 opacity-50 translate-x-2 -translate-y-2" />
                  
                  {/* ✅ КАРТИНКА */}
                  <div 
                    className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative"
                    onClick={() => openImageModal(program.image, program.name)}
                  >
                    {photoCount > 0 && (
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold z-5 flex items-center gap-1">
                        📷 {photoCount}
                      </div>
                    )}
                    <Image
                      src={program.image}
                      alt={program.name}
                      width={400}
                      height={320}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* ✅ КОНТЕНТ */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-black text-gray-900 leading-tight">
                      {program.name}
                    </h3>
                    
                    {/* ✅ ДВЕ КНОПКИ ПОД КАЖДОЙ ПЛИТКОЙ */}
                    <div className="flex gap-3 justify-center">
                      <button 
                        className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCallModal(`Программа: ${program.name}`);
                        }}
                      >
                        Записаться
                      </button>
                      
                      <Link 
                        href={`/programs/${program.id}`}
                        className="px-4 py-3 bg-white text-emerald-600 font-bold border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {/* ✅ КНОПКА "ВСЕ ПРОГРАММЫ" ПОД ПЛИТКАМИ */}
            <div className="text-center">
              <Link 
                href="/programs"
                className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 text-white font-black rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 text-xl backdrop-blur-xl border border-emerald-400/30 hover:from-emerald-700 hover:to-green-700 group"
              >
                <span>🏋️‍♂️ Все программы</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <div className="inline-block p-16 bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl shadow-2xl border border-emerald-200 max-w-2xl mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-black text-white">💪</span>
              </div>
              <h3 className="text-4xl font-black text-gray-800 mb-6">Программы в разработке</h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
                Мы готовим для вас самые эффективные и современные тренировочные программы. 
                Скоро здесь появится полный каталог!
              </p>
              <Link 
                href="/programs"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 text-lg"
              >
                Посмотреть все программы →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
