
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const safePrograms: Program[] = Array.isArray(programs) 
    ? programs.filter((p): p is Program => p && p.id && p.name && p.image)
    : [];

  // Фиксированная сетка 3 колонки
  const gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="programs" className={styles.programs}>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent drop-shadow-2xl">
          Программы тренировок
        </h2>
        
        {safePrograms.length > 0 ? (
          <>
            {/* ✅ ПЛИТКИ С КНОПКАМИ */}
            <div className={`grid ${gridClass} gap-6 mb-16`}>
              {safePrograms.map((program) => {
                return (
                <div 
                  key={program.id} 
                  className="group cursor-pointer hover:translate-y-[-4px] transition-all duration-300 bg-white shadow-md hover:shadow-xl overflow-hidden border-2 border-gray-200 hover:border-blue-500"
                >
                  {/* ✅ КАРТИНКА */}
                  <div 
                    className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative"
                    onClick={() => openImageModal(program.image, program.name)}
                  >
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
                        className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCallModal(`Программа: ${program.name}`);
                        }}
                      >
                        Записаться
                      </button>
                      
                      <Link 
                        href={`/programs/${program.id}`}
                        className="px-4 py-3 bg-white text-blue-600 font-bold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg text-sm"
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
                className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-black rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 text-xl backdrop-blur-xl border border-blue-400/30 hover:from-blue-700 hover:to-blue-800 group"
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
            <div className="inline-block p-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl border border-blue-200 max-w-2xl mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-black text-white">💪</span>
              </div>
              <h3 className="text-4xl font-black text-gray-800 mb-6">Программы в разработке</h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
                Мы готовим для вас самые эффективные и современные тренировочные программы. 
                Скоро здесь появится полный каталог!
              </p>
              <Link 
                href="/programs"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 text-lg"
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
