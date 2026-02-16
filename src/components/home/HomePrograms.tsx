'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomePrograms.module.css';

interface Program {
  id: number | string;
  image: string;
  name: string;
  description: string;
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

  return (
    <section id="programs" className={styles.programs}>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-2xl">
          Программы тренировок
        </h2>
        
        {safePrograms.length > 0 ? (
          <>
            {/* ✅ ПЛИТКИ С КНОПКАМИ */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {safePrograms.map((program) => (
                <div 
                  key={program.id} 
                  className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  {/* ✅ КАРТИНКА */}
                  <div 
                    className="w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl overflow-hidden relative"
                    onClick={() => openImageModal(program.image, program.name)}
                  >
                    <Image
                      src={program.image}
                      alt={program.name}
                      width={400}
                      height={320}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* ✅ КОНТЕНТ */}
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">
                      {program.name}
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-lg line-clamp-3">
                      {program.description}
                    </p>
                    
                    {/* ✅ ДВЕ КНОПКИ ПОД КАЖДОЙ ПЛИТКОЙ */}
                    <div className="flex gap-4 justify-center">
                      <button 
                        className="flex-1 px-6 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCallModal(`Программа: ${program.name}`);
                        }}
                      >
                        Записаться
                      </button>
                      
                      <Link 
                        href={`/programs/${program.id}`}
                        className="px-6 py-4 bg-white text-emerald-600 font-bold rounded-xl border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Подробнее →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
