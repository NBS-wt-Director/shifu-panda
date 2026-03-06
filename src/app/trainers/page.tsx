'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Users, UserCog } from 'lucide-react';
import SiteHeader from '@/components/ui/SiteHeader';
import Footer from '@/components/Footer';
import CallModal from '@/components/ui/CallModal';

interface Trainer {
  id: string;
  name: string;
  image: string;
  experience?: string;
  specialization?: string;
  photoAlbum?: { image: string; caption?: string }[];
}

interface Staff {
  id: string;
  name: string;
  image: string;
  role?: string;
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [siteSettings, setSiteSettings] = useState({ clientNotification: '' });
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callReason, setCallReason] = useState('Общий запрос');
  const [gridCols, setGridCols] = useState(3);

  const openCallModal = (reason: string) => {
    setCallReason(reason);
    setCallModalOpen(true);
  };
  // Загрузка данных тренеров и сотрудников
  useEffect(() => {
    Promise.all([
      fetch('/api/trainers'),
      fetch('/api/employees')
    ])
      .then(([trainersRes, staffRes]) => {
        if (!trainersRes.ok) throw new Error('Ошибка загрузки тренеров');
        if (!staffRes.ok) throw new Error('Ошибка загрузки сотрудников');
        return Promise.all([trainersRes.json(), staffRes.json()]);
      })
      .then(([trainersData, staffData]) => {
        console.log('✅ Тренеры:', trainersData);
        console.log('✅ Сотрудники:', staffData);
        setTrainers(trainersData);
        setStaff(staffData);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Ошибка загрузки:', err);
        setError('Ошибка загрузки данных');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-8" />
          <p className="text-2xl">Загрузка команды...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader 
        pageTitle="Наша команда"
        onOpenCallModal={openCallModal}
      />
      
      {/* Команда тренеров */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-black text-gray-400 mb-6">
                Наши тренеры
              </h3>
          </div>

          {trainers.length === 0 ? (
            <div className="text-center py-32">
              <Users className="w-32 h-32 text-gray-300 mx-auto mb-8" />
              <h3 className="text-4xl md:text-5xl font-black text-gray-400 mb-6">
                Данные не заполнены
              </h3>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Тренера скоро появятся в админке!
              </p>
            </div>
          ) : (
            <>
              {/* Настройки сетки */}
              
              {/* Определяем класс сетки */}
              <div className={`grid ${
                gridCols === 1 ? 'grid-cols-1' :
                gridCols === 2 ? 'grid-cols-1 md:grid-cols-2' :
                gridCols === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                gridCols === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
              } gap-6`}>
                {trainers.map((trainer) => {
                  return (
                <Link 
                  key={trainer.id} 
                  href={`/trainers/${trainer.id}`}
                  className="group relative bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-200 hover:border-red-500 overflow-hidden flex flex-col"
                >
                {/* Фото */}
                <div className="relative flex-shrink-0 mb-4 h-64 overflow-hidden mx-auto w-full bg-gray-100">
  <img 
    src={trainer.image} 
    alt={trainer.name}
    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
  />
</div>
                  
                  {/* Имя */}
                  <div className="flex-1 flex flex-col justify-end">
                    <h3 className="text-xl font-black text-center mb-2 text-gray-900">
                      {trainer.name}
                    </h3>
                  </div>
                </Link>
              )})}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Помощники - показываем только если есть сотрудники */}
      {staff.length > 0 && (
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-black text-gray-400 mb-6">
                персоонал
              </h3>
          </div>

          {staff.length === 0 ? (
            <div className="text-center py-32">
              <UserCog className="w-32 h-32 text-gray-300 mx-auto mb-8" />
              <h3 className="text-4xl md:text-5xl font-black text-gray-400 mb-6">
                тут пусто
              </h3>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Работаем над этим! Скоро добавим администраторов, менеджеров и других помощников тренеров.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {staff.map((member) => (
                <div
                  className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100 hover:border-yellow-200 overflow-hidden h-[480px] flex flex-col"
                >
                 {/* Фото БЕЗ обрезки */}
<div className="relative flex-shrink-0 mb-8 h-72 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 overflow-hidden mx-auto">
  <img 
    src={member.image} 
    alt={member.name}
    className="w-full h-full object-contain bg-gray-100 rounded-3xl group-hover:scale-105 transition-transform duration-500"  // ← object-contain
  />
  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
</div>
                  
                  {/* Имя и роль */}
                  <div className="flex-1 flex flex-col justify-end">
                    <h3 className="text-3xl font-black text-center mb-4 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-xl text-gray-600 text-center font-semibold">
                        {member.role}
                      </p>
                    )}
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      <Footer />

      <CallModal 
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        reason={callReason}
      />
    </div>
  );
}
