'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GridSettings from '@/components/ui/GridSettings';
import styles from './HomeTrainers.module.css';

interface Trainer {
  id: number;
  image: string;
  name: string;
  specialty: string;
  photoAlbum?: { image: string; caption?: string }[];
}

interface HomeTrainersProps {
  trainers: Trainer[];
  openCallModal: (reason: string) => void;
  openImageModal: (url: string, alt: string) => void;
}

export default function HomeTrainers({ 
  trainers = [], 
  openCallModal, 
  openImageModal 
}: HomeTrainersProps) {
  const [gridCols, setGridCols] = useState(3);
  const safeTrainers: Trainer[] = Array.isArray(trainers) ? trainers : [];

  // Определяем класс сетки
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  }[gridCols] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="trainers" className={styles.trainers}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl">
          Наши тренеры
        </h2>
        
        {safeTrainers.length > 0 ? (
          <>
            {/* Настройки сетки */}
            <GridSettings defaultCols={3} onChange={setGridCols} />
            
            <div className={`grid ${gridClass} gap-6 mb-12`}>
              {safeTrainers.map((trainer) => {
                return (
                <div key={trainer.id} className="text-center group">
                  <div className="relative bg-white shadow-md overflow-hidden border-2 border-gray-200 hover:border-red-500 transition-all hover:shadow-xl">
                    <div 
                      className="w-full h-64 mx-auto bg-gray-100 overflow-hidden cursor-pointer relative"
                      onClick={() => openImageModal(trainer.image, trainer.name)}
                    >
                      <Image 
                        src={trainer.image} 
                        alt={trainer.name} 
                        width={320} 
                        height={400} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900">{trainer.name}</h3>
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
                          onClick={() => openCallModal(`Тренер ${trainer.name}`)}
                        >
                          Записаться
                        </button>
                        <Link 
                          href={`/trainers/${trainer.id}`}
                          className="px-4 py-2 bg-white text-red-600 font-semibold text-sm border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all"
                        >
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Тренеров скоро добавят</p>
          </div>
        )}

        {/* ✅ КНОПКА ВЕСЬ КОЛЛЕКТИВ */}
        <div className="text-center">
          <Link 
            href="/trainers"
            className="inline-flex px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 text-xl"
          >
            Весь наш коллектив →
          </Link>
        </div>
      </div>
    </section>
  );
}
