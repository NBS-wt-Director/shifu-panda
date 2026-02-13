import Image from 'next/image';
import { Trainer } from '@/lib/db';

interface Props {
  trainer: Trainer;
}

export default function TrainerCard({ trainer }: Props) {
  return (
    <div className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-6 h-[500px]">
      {/* Изображение */}
      <div className="relative h-4/5 overflow-hidden">
        <Image
          src={trainer.image}
          alt={trainer.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.currentTarget.src = '/images/trainer-placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </div>

      {/* Информация */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-sm border-t-4 border-panda-500">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-panda-600 transition-colors">
          {trainer.name}
        </h3>
       
      </div>

      {/* Соцсети */}
      
    </div>
  );
}
