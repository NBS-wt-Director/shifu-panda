'use client';
import { useEffect, useState } from 'react';
import { Loader2, Calendar, Clock, MapPin, Filter, Image as ImageIcon } from 'lucide-react';
import SiteHeader from '@/components/ui/SiteHeader';
import Footer from '@/components/Footer';
import SectionSpacer from '@/components/ui/SectionSpacer';
import CallModal from '@/components/ui/CallModal';
import FullScreenImageModal from '@/components/ui/FullScreenImageModal';
import Link from 'next/link';
import Image from 'next/image';

interface Workout {
  id: number;
  day: string;
  time: string;
  programId: number | null;
  programName: string;
  params: string[];
}

interface Program {
  id: number;
  name: string;
  image: string;
}

interface ScheduleImage {
  id: number;
  image?: string;
}

const DAYS_ORDER = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export default function SchedulePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [scheduleImages, setScheduleImages] = useState<ScheduleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'static' | 'table' | 'list'>('table');
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callReason, setCallReason] = useState('Общий запрос');
  const [modalImage, setModalImage] = useState({ open: false, url: '', alt: '' });

  const openCallModal = (reason: string = 'Общий запрос') => {
    setCallReason(reason);
    setCallModalOpen(true);
  };

  const openImageModal = (url: string, alt: string) => {
    setModalImage({ open: true, url, alt });
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/workouts').then(r => r.json()),
      fetch('/api/programs').then(r => r.json()),
      fetch('/api/db').then(r => r.json())
    ]).then(([workoutsData, programsData, dbData]) => {
      setWorkouts(workoutsData);
      setPrograms(programsData);
      setScheduleImages(dbData.schedule || []);
      setLoading(false);
    }).catch(err => {
      console.error('Ошибка загрузки:', err);
      setLoading(false);
    });
  }, []);

  // Фильтрация тренировок
  const filteredWorkouts = selectedProgram === 'all' 
    ? workouts 
    : workouts.filter(w => String(w.programId) === selectedProgram || w.programName === selectedProgram);

  // Группировка по дням недели
  const workoutsByDay = DAYS_ORDER.reduce((acc, day) => {
    const dayWorkouts = filteredWorkouts
      .filter(w => w.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
    if (dayWorkouts.length > 0) {
      acc[day] = dayWorkouts;
    }
    return acc;
  }, {} as Record<string, Workout[]>);

  // Получить имя программы
  const getProgramName = (workout: Workout) => {
    if (workout.programName) return workout.programName;
    const program = programs.find(p => p.id === workout.programId);
    return program?.name || 'Общая тренировка';
  };

  // Получить изображение программы
  const getProgramImage = (workout: Workout): string | undefined => {
    const program = programs.find(p => p.id === workout.programId);
    return program?.image;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-8" />
          <p className="text-2xl font-bold">Загрузка расписания...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader 
        pageTitle="Расписание тренировок"
        onOpenCallModal={openCallModal}
      />
      
      <SectionSpacer height="lg" background="default" />

      <section className="max-w-6xl mx-auto px-4 pb-20">
        {/* Фильтры и переключатель вида */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all">Все программы</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'table' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-emerald-500'
              }`}
            >
              📊 Таблица
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-emerald-500'
              }`}
            >
              📋 Список
            </button>
          </div>
        </div>

        {filteredWorkouts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-12 bg-gray-100 rounded-2xl shadow-lg">
              <Calendar className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Расписание пока пустое</h3>
              <p className="text-gray-500">Скоро здесь появится расписание тренировок</p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* Таблица по дням */
          <div className="grid gap-6">
            {Object.entries(workoutsByDay).map(([day, dayWorkouts]) => (
              <div key={day} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {day}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {dayWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-emerald-700">{workout.time}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {getProgramImage(workout) && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                              <Image
                                src={getProgramImage(workout)}
                                alt={getProgramName(workout)}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <Link 
                              href={workout.programId ? `/programs/${workout.programId}` : '#'}
                              className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                            >
                              {getProgramName(workout)}
                            </Link>
                            {workout.params && workout.params.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {workout.params.map((param, i) => (
                                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    {param}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openCallModal(`Записаться на ${getProgramName(workout)} в ${day} в ${workout.time}`)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Записаться
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Список всех тренировок */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-100 font-semibold text-gray-600">
              <div>День</div>
              <div>Время</div>
              <div>Программа</div>
              <div></div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredWorkouts
                .sort((a, b) => {
                  const dayDiff = DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day);
                  if (dayDiff !== 0) return dayDiff;
                  return a.time.localeCompare(b.time);
                })
                .map((workout) => (
                  <div key={workout.id} className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-gray-50">
                    <div className="font-medium text-gray-900">{workout.day}</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">{workout.time}</span>
                    </div>
                    <div>
                      <Link 
                        href={workout.programId ? `/programs/${workout.programId}` : '#'}
                        className="hover:text-emerald-600 transition-colors"
                      >
                        {getProgramName(workout)}
                      </Link>
                      {workout.params && workout.params.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {workout.params.map((param, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {param}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => openCallModal(`Записаться на ${getProgramName(workout)}`)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Записаться
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
      
      <CallModal 
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        reason={callReason}
      />
    </div>
  );
}
