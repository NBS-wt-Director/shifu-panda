'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomeTrainers.module.css';

interface Trainer {
  id: number;
  image: string;
  name: string;
  specialty: string;
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
  const safeTrainers: Trainer[] = Array.isArray(trainers) ? trainers : [];

  return (
    <section id="trainers" className={styles.trainers}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl">
          Наши тренеры
        </h2>
        
        {safeTrainers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {safeTrainers.map((trainer) => (
              <div key={trainer.id} className="text-center group">
                <div 
                  className="w-80 h-96 mx-auto bg-white rounded-br-[1%] shadow-2xl overflow-hidden group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
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
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{trainer.name}</h3>
                  <p className="text-xl text-gray-600 mb-6">{trainer.specialty}</p>
                  <div className="flex gap-3">
                    <button 
                      className="flex-1 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                      onClick={() => openCallModal(`Тренер ${trainer.name}`)}
                    >
                      Записаться
                    </button>
                    <Link 
                      href={`/trainers/${trainer.id}`}
                      className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-md border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-md hover:shadow-lg"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
