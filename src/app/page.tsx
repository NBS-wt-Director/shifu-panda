'use client';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X, Phone, CheckCircle, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formReason, setFormReason] = useState(''); 
  
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '', reason: '' });
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null); 
  const [hoveredTrainer, setHoveredTrainer] = useState(false);
const [hoveredPrograms, setHoveredPrograms] = useState(false);
const [hoveredTrainers, setHoveredTrainers] = useState(false);
const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false); 
const [mobileTrainersOpen, setMobileTrainersOpen] = useState(false); 
const [showTrainerMenu, setShowTrainerMenu] = useState(false);
const [showProgramsMenu, setShowProgramsMenu] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, reason: formReason }) 
      });
      if (res.ok) {
        console.log('✅ Заявка отправлена!');
        setShowForm(false);
        setFormData({ name: '', phone: '', email: '', message: '', reason: '' });
        setFormReason('');
      } else {
        console.log('Ошибка отправки');
      }
    } catch {
      console.log('Ошибка сети');
    } finally {
      setLoading(false);
    }
 };
  useEffect(() => {
    fetch('/api/db')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Данные загружены:', data);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Ошибка загрузки:', err);
        setError('Ошибка загрузки данных. Используем демо-режим.');
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const handleClickOutside = () => {
    setShowTrainerMenu(false);
    setShowProgramsMenu(false);
  };
  
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
    if (!data?.sliders?.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === (data.sliders.length - 1) ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [data?.sliders?.length]);
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };
  const toggleMobilePrograms = () => setMobileProgramsOpen(prev => !prev);
const toggleMobileTrainers = () => setMobileTrainersOpen(prev => !prev);
  const openFormWithReason = (reason: string) => {
    setFormReason(reason);
    setShowForm(true);
  };
  const defaultData = {
    sliders: [{ id: 1, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=2000", description: "Кунг-фу для всех" }],
    trainers: [{ id: 1, name: "Мастер Шифу", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", experience: "15 лет" }],
    news: [{ id: 1, title: "Первое занятие бесплатно!", text: "Запишитесь на пробное занятие и получите первую тренировку бесплатно.", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400" }],
    contacts: { address: "г. Екатеринбург, ул. Ленина, 25", email: "centr-fr@yandex.ru", phone: "+7 (343) 123-45-67" }
  };
  const displayData = data || defaultData;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-8" />
          <p className="text-2xl">Загрузка сайта...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b">
  <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
    <button 
      onClick={() => openFormWithReason('заказать звонок')}
      className="flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-lg"
    >
      <Phone size={24} />
      <span>Заказать звонок</span>
    </button>
    
    <h1 
      className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-all"
      onClick={() => scrollTo('slider')}
    >
      Шифу Панда
    </h1>
    
    <button 
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="md:hidden p-3 rounded-2xl hover:bg-gray-100 transition-all"
    >
      {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
    
    {/* ДЕСКТОП МЕНЮ - HOVER */}
    <nav className="hidden md:flex items-center space-x-8">
      <button onClick={() => scrollTo('schedule')} className="text-xl font-semibold hover:text-yellow-500 transition-all py-2 px-4 hover:bg-yellow-50 rounded-xl">
        📅 Расписание
      </button>
      
      {/* ПРОГРАММЫ - HOVER */}
      <div 
        className="relative group"
        onMouseEnter={() => setHoveredPrograms(true)}
        onMouseLeave={() => setHoveredPrograms(false)}
      >
        <button 
          onClick={() => scrollTo('programs')}
          className="text-xl font-semibold hover:text-yellow-500 transition-all py-2 px-4 hover:bg-yellow-50 rounded-xl flex items-center gap-2"
        >
          🎯 Программы
          <ChevronDown size={20} className="transition-transform duration-300 group-hover:rotate-180" />
        </button>
        
        {hoveredPrograms && displayData.programs?.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200 py-4 z-50">
            <a href="/programs" className="flex items-center gap-3 px-6 py-4 text-lg font-bold hover:bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl hover:text-emerald-700 transition-all mx-2 mb-2 border-b border-emerald-100">
              🎯 Все программы
            </a>
            <div className="max-h-64 overflow-y-auto">
              {displayData.programs.slice(0, 6).map((program: any) => (
                <a 
                  key={program.id}
                  href={`/programs/${program.id}`}
                  className="flex items-center gap-3 px-6 py-3 text-base hover:bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:translate-x-2 transition-all mx-2"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-sm">P{program.id}</span>
                  </div>
                  <span className="font-medium truncate">{program.name}</span>
                </a>
              ))}
            </div>
            {displayData.programs.length > 6 && (
              <p className="px-6 py-2 text-xs text-gray-500 text-center">+{displayData.programs.length - 6} ещё</p>
            )}
          </div>
        )}
      </div>
      
      {/* ТРЕНЕРЫ - HOVER */}
{/* ТРЕНЕРЫ - РАБОЧИЙ вариант */}
<div 
  className="relative group"
  onMouseEnter={() => setHoveredTrainers(true)}
  onMouseLeave={() => setHoveredTrainers(false)}
>
  <button 
    onClick={() => scrollTo('trainers')}
    className="text-xl font-semibold hover:text-yellow-500 transition-all py-2 px-4 hover:bg-yellow-50 rounded-xl flex items-center gap-2 group-hover:scale-105"
  >
    👨‍🏫 Тренеры
    <ChevronDown size={20} className="transition-transform duration-300 group-hover:rotate-180" />
  </button>
  
  {hoveredTrainers && displayData.trainers?.length > 0 && (
    <div className="absolute top-full left-0 mt-2 w-96 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200 py-6 z-50">
      {/* Заголовок */}
      <div className="px-6 pb-4 mb-4 border-b border-gray-200">
        <a href="/trainers" className="flex items-center gap-3 text-xl font-black hover:bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:text-blue-700 transition-all p-4 w-full block">
          👥 Наш коллектив ({displayData.trainers.length})
          <ChevronRight size={20} className="ml-auto text-blue-500" />
        </a>
      </div>
      
      {/* Список тренеров */}
      <div className="max-h-72 overflow-y-auto px-2 space-y-2">
        {displayData.trainers.map((trainer: any) => (
          <a 
            key={trainer.id}
            href={`/trainers/${trainer.id}`}
            className="flex items-center gap-4 px-6 py-4 hover:bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:translate-x-2 hover:shadow-md transition-all group/item mx-2 text-left"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-all overflow-hidden border-4 border-white/50">
              <span className="text-blue-700 font-black text-lg bg-white/90 px-3 py-2 rounded-xl shadow-sm">
                {trainer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-lg text-gray-900 truncate group-hover/item:text-blue-700">
                {trainer.name}
              </div>
              {trainer.specialization && (
                <div className="text-sm text-gray-600 mt-1 line-clamp-1">{trainer.specialization}</div>
              )}
              {trainer.experience && (
                <div className="text-xs text-gray-500 mt-0.5">{trainer.experience} опыта</div>
              )}
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover/item:text-blue-500 ml-2 flex-shrink-0 transition-all" />
          </a>
        ))}
      </div>
      
      {displayData.trainers.length > 8 && (
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 mt-4 border-t border-blue-100">
          <a href="/trainers" className="flex items-center justify-center gap-2 text-blue-700 font-bold hover:text-blue-900 transition-all">
            👥 Показать всех ({displayData.trainers.length})
            <ChevronRight size={18} />
          </a>
        </div>
      )}
    </div>
  )}
</div>

      <button onClick={() => scrollTo('news')} className="text-xl font-semibold hover:text-yellow-500 transition-all py-2 px-4 hover:bg-yellow-50 rounded-xl">
        📰 Новости
      </button>
      <button onClick={() => scrollTo('contacts')} className="text-xl font-semibold hover:text-yellow-500 transition-all py-2 px-4 hover:bg-yellow-50 rounded-xl">
        📞 Контакты
      </button>
    </nav>
  </div>
  
  {/* МОБИЛЬНОЕ МЕНЮ остается прежним */}
 {mobileMenuOpen && (
  <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl px-4 py-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
    {/* Блок Заказать звонок */}
    <div className="pt-4 border-t border-gray-200">
      <button 
        onClick={() => {
          openFormWithReason('заказать звонок');
          setMobileMenuOpen(false);
        }}
        className="w-full flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-6 py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg justify-center"
      >
        <Phone size={24} />
        <span>📞 Заказать звонок</span>
      </button>
    </div>

    {/* Навигация */}
    <nav className="space-y-4">
      <button 
        onClick={() => {
          scrollTo('schedule');
          setMobileMenuOpen(false);
        }}
        className="w-full text-left flex items-center space-x-4 p-6 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 rounded-2xl font-semibold text-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-gray-200"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-bold text-lg">📅</span>
        </div>
        <span>Расписание</span>
      </button>

      {/* Программы */}
      <div>
        <button 
          onClick={() => {
            scrollTo('programs');
            setMobileMenuOpen(false);
          }}
          className="w-full text-left flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl font-semibold text-xl shadow-sm hover:shadow-md transition-all border border-emerald-100 hover:border-emerald-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 font-bold text-lg">🎯</span>
            </div>
            <span>Программы</span>
            {displayData.programs?.length > 0 && (
              <span className="text-sm bg-white px-3 py-1 rounded-full text-emerald-700 font-bold">
                {displayData.programs.length}
              </span>
            )}
          </div>
          <ChevronDown size={20} className="text-gray-500" />
        </button>
        
        {/* Подменю программ */}
        {displayData.programs?.length > 0 && (
          <div className="ml-4 mt-2 space-y-2 animate-in slide-in-from-right-2">
            {displayData.programs.slice(0, 4).map((program: any) => (
              <a 
                key={program.id}
                href={`/programs/${program.id}`}
                className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-gradient-to-r from-emerald-50 to-teal-50 hover:translate-x-2 transition-all shadow-sm border border-gray-100 text-base font-medium text-gray-800 block w-full"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold text-sm">P{program.id}</span>
                </div>
                <span className="truncate">{program.name}</span>
              </a>
            ))}
            {displayData.programs.length > 4 && (
              <a href="/programs" className="flex items-center justify-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl text-emerald-700 font-semibold hover:bg-emerald-100 transition-all">
                +{displayData.programs.length - 4} ещё
              </a>
            )}
          </div>
        )}
      </div>

      {/* Тренеры */}
      <div>
        <button 
          onClick={() => {
            scrollTo('trainers');
            setMobileMenuOpen(false);
          }}
          className="w-full text-left flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl font-semibold text-xl shadow-sm hover:shadow-md transition-all border border-blue-100 hover:border-blue-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-lg">👨‍🏫</span>
            </div>
            <span>Тренеры</span>
            {displayData.trainers?.length > 0 && (
              <span className="text-sm bg-white px-3 py-1 rounded-full text-blue-700 font-bold">
                {displayData.trainers.length}
              </span>
            )}
          </div>
          <ChevronDown size={20} className="text-gray-500" />
        </button>
        
        {/* Подменю тренеров */}
        {displayData.trainers?.length > 0 && (
          <div className="ml-4 mt-2 space-y-2 animate-in slide-in-from-right-2">
            {displayData.trainers.slice(0, 4).map((trainer: any) => (
              <a 
                key={trainer.id}
                href={`/trainers/${trainer.id}`}
                className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-gradient-to-r from-blue-50 to-indigo-50 hover:translate-x-2 transition-all shadow-sm border border-gray-100 text-base font-medium text-gray-800 block w-full"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white/50">
                  <span className="text-blue-700 font-bold text-sm bg-white/90 px-2 py-1 rounded">
                    {trainer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold truncate block">{trainer.name}</span>
                  {trainer.specialization && (
                    <span className="text-xs text-gray-600 truncate block">{trainer.specialization}</span>
                  )}
                </div>
              </a>
            ))}
            {displayData.trainers.length > 4 && (
              <a href="/trainers" className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-blue-700 font-semibold hover:bg-blue-100 transition-all">
                +{displayData.trainers.length - 4} ещё
              </a>
            )}
          </div>
        )}
      </div>

      <button 
        onClick={() => {
          scrollTo('news');
          setMobileMenuOpen(false);
        }}
        className="w-full flex items-center space-x-4 p-6 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-2xl font-semibold text-xl shadow-sm hover:shadow-md transition-all border border-orange-100 hover:border-orange-200"
      >
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-orange-600 font-bold text-lg">📰</span>
        </div>
        <span>Новости</span>
      </button>

      <button 
        onClick={() => {
          scrollTo('contacts');
          setMobileMenuOpen(false);
        }}
        className="w-full flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl font-semibold text-xl shadow-sm hover:shadow-md transition-all border border-purple-100 hover:border-purple-200"
      >
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-purple-600 font-bold text-lg">📞</span>
        </div>
        <span>Контакты</span>
      </button>
    </nav>

    {/* Нижняя часть - контакты */}
    <div className="pt-6 border-t-2 border-gray-100 space-y-4">
      <div className="text-center py-4 px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
        <p className="text-2xl font-black text-gray-900 mb-2">🐼 Шифу Панда</p>
        <p className="text-lg text-gray-600">{displayData.contacts?.address || 'Екатеринбург'}</p>
      </div>
      
      <button 
        onClick={() => {
          setMobileMenuOpen(false);
          window.open(`tel:${displayData.contacts?.phone || '+73431234567'}`, '_self');
        }}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
      >
        <Phone size={24} />
        <span>Позвонить сейчас</span>
      </button>
    </div>
  </div>
)}
</header>
      {/* Слайдер */}
      <section id="slider" className="relative h-screen overflow-hidden">
        {displayData.sliders.map((slide: any, idx: number) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div 
              className="w-full h-full bg-cover bg-center relative" 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
              <div className="relative z-10 flex items-center justify-center h-full text-white px-8">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-black mb-8 drop-shadow-2xl animate-fade-in">Шифу Панда</h1>
                  <p className="text-xl md:text-3xl mb-12 drop-shadow-xl leading-relaxed">{slide.description}</p>
                  <button 
                    onClick={() => openFormWithReason('записаться на тренировку')}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-16 py-6 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                  >
                    Записаться на тренировку
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => setCurrentSlide((prev) => prev === 0 ? displayData.sliders.length - 1 : prev - 1)}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-xl p-4 rounded-full shadow-xl hover:shadow-2xl transition-all"
          aria-label="Предыдущий слайд"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => prev === displayData.sliders.length - 1 ? 0 : prev + 1)}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-xl p-4 rounded-full shadow-xl hover:shadow-2xl transition-all"
          aria-label="Следующий слайд"
        >
          <ChevronRight size={32} />
        </button>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-4">
          {displayData.sliders.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-4 h-4 rounded-full transition-all ${
                idx === currentSlide ? 'bg-white scale-125 shadow-lg' : 'bg-white/60 hover:bg-white'
              }`}
              aria-label={`Перейти к слайду ${idx + 1}`}
            />
          ))}
        </div>
      </section>
      {/* Расписание */}
      <section id="schedule" className="py-24 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent drop-shadow-2xl">
            📅 Расписание тренировок
          </h2>
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 overflow-hidden max-w-3xl mx-auto">
              <img 
                src="/рассписание1.jpg" 
                alt="Расписание взрослых" 
                className="w-full h-auto max-h-[500px] object-contain rounded-t-3xl shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e892?w=800";
                  (e.target as HTMLImageElement).className = "w-full h-auto max-h-[500px] object-contain rounded-t-3xl shadow-lg";
                }}
              />
            </div>
            <div className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 overflow-hidden max-w-3xl mx-auto">
              <img 
                src="/рассписание2.jpg" 
                alt="Расписание детей" 
                className="w-full h-auto max-h-[500px] object-contain rounded-t-3xl shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800";
                  (e.target as HTMLImageElement).className = "w-full h-auto max-h-[500px] object-contain rounded-t-3xl shadow-lg";
                }}
              />
            </div>
          </div>
        </div>
      </section>
        {/*  "Наши программы" */}
      <section id="programs" className="py-24  bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-emerald-900 via-green-900 to-teal-900 bg-clip-text text-transparent drop-shadow-2xl">
            🎯 Наши программы
          </h2>
          
          {displayData.programs && displayData.programs.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {displayData.programs.map((program: any) => (
                  <div 
                    key={program.id}
                    className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 hover:scale-105 border border-gray-100 hover:border-emerald-200 cursor-pointer overflow-hidden"
                    onClick={() => {
                      // ← Закомментировано
                      // router.push(`/programms/${program.id}`);
                      console.log(`Переход на programms/${program.id}`);
                    }}
                  >
                    {/* Фото БЕЗ обрезки */}
                    <img 
                      src={program.image} 
                      alt={program.name} 
                      className="w-full h-auto max-h-[400px] object-contain rounded-t-3xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800";
                        (e.target as HTMLImageElement).className = "w-full h-auto max-h-[400px] object-contain rounded-t-3xl shadow-lg group-hover:scale-105 transition-transform duration-500";
                      }}
                    />
                    
                    <div className="p-8">
                      <h3 className="text-3xl font-black text-center mb-6 bg-gradient-to-r from-emerald-900 to-teal-900 bg-clip-text text-transparent group-hover:scale-105 transition-all">
                        {program.name}
                      </h3>
                      
                      {/* Кнопка записаться */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openFormWithReason(`записаться на программу "${program.name}"`);
                        }}
                        className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white py-4 px-8 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all mb-4"
                      >
                        Записаться на программу
                      </button>

                      {/* Описание - раскрывается при наведении */}
                      <div className="overflow-hidden transition-all duration-500 ease-in-out">
                        <div 
                          className={`bg-gradient-to-r from-gray-50 to-emerald-50 p-6 rounded-2xl text-gray-700 leading-relaxed transition-all duration-500 ${
                            expandedProgram === program.id 
                              ? 'max-h-96 opacity-100 shadow-inner' 
                              : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p className="text-lg">{program.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Кнопка "Все программы" - закомментирована */}
              <div className="text-center">
                <button 
                  onClick={() => {
                    // ← Закомментировано
                    // router.push('/programms');
                    console.log('Переход на /programms');
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
                >
                  🎯 Все программы
                </button>
              </div>
            </>
          ) : (
            /* ← Красочное предупреждение если нет программ */
            <div className="text-center py-32">
              <div className="inline-block p-12 bg-gradient-to-br from-rose-100 via-pink-100 to-orange-100 rounded-3xl shadow-2xl border-4 border-dashed border-rose-300 animate-pulse mb-8">
                <div className="text-8xl mb-6">🚧</div>
                <h3 className="text-4xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-4">
                  Программы в разработке
                </h3>
                <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Скоро здесь появятся наши уникальные программы кунг-фу для детей и взрослых!
                </p>
                <button 
                  onClick={() => openFormWithReason('узнать о программах')}
                  className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  Оставить заявку
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Тренеры - ПРЯМОУГОЛЬНЫЕ плитки одинакового размера */}
      <section id="trainers" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent drop-shadow-2xl">
            👨‍🏫 Наши тренеры
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {displayData.trainers.map((trainer: any) => (
              <div 
                key={trainer.id} 
                className="group relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 hover:scale-105 border border-gray-100 hover:border-yellow-200 cursor-pointer"
                onClick={() => {
                  // ← Пока закомментировано
                  // router.push(`/trainers/${trainer.id}`);
                  console.log(`Переход на trainers/${trainer.id}`);
                }}
              >
                {/* Фото БЕЗ обрезки - object-contain */}
                 <img 
                src={trainer.image} 
                alt={trainer.name} 
                className="w-full h-auto max-h-[500px] object-contain rounded-t-3xl shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800";
                  (e.target as HTMLImageElement).className = "w-full h-auto max-h-[500px] object-contain rounded-t-3xl shadow-lg";
                }}
              />
              
                <h3 className="text-3xl font-black text-center mb-4 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent group-hover:scale-105 transition-all">
                  {trainer.name}
                </h3>
                <p className="text-xl text-gray-600 text-center mb-8">{trainer.experience}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // ← Предотвращаем переход на страницу тренера
                    openFormWithReason(`записаться к ${trainer.name}`);
                  }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-4 px-8 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  Записаться к тренеру
                </button>
              </div>
            ))}
            {displayData.trainers.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-2xl text-gray-500 mb-8">Тренеры скоро появятся</p>
                <button 
                  onClick={() => openFormWithReason('оставить заявку')} // ← Добавили reason
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-12 py-6 rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  Оставить заявку
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Новости */}
      <section id="news" className="py-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent drop-shadow-2xl">
            📰 Последние новости
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayData.news.slice(0, 30).map((newsItem: any) => (
              <div key={newsItem.id} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden">
                    <img 
                src={newsItem.image} 
                alt={newsItem.title} 
                className="w-full h-auto max-h-[500px] object-contain rounded-t-3xl shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800";
                  (e.target as HTMLImageElement).className = "w-full h-auto max-h-[500px] object-contain rounded-t-3xl shadow-lg";
                }}
              />
              
                <h3 className="text-2xl font-bold mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors">{newsItem.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{newsItem.text}</p>
                <button 
                  onClick={() => openFormWithReason(`узнать подробнее о новости ${newsItem.title}`)} // ← Добавили reason
                  className="w-full border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white py-3 px-6 rounded-2xl font-bold transition-all group-hover:shadow-lg"
                >
                  Подробнее
                </button>
              </div>
            ))}
            {displayData.news.length === 0 && (
              <div className="col-span-full text-center py-20 md:col-span-1">
                <p className="text-2xl text-gray-500 mb-8">Новости скоро появятся</p>
              </div>
            )}
          </div>
        </div>
      </section>
          {/* Контакты */}
<section id="contacts" className="py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-black">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-20">
      <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
        📞 Контактная информация
      </h2>
    </div>
    <div className="grid lg:grid-cols-5 gap-12 items-start">
      {/* Левая колонка - 2/5 (40%) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Адрес */}
        <a 
          href={`https://yandex.ru/profile/-/CPQK4QYu`}
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:translate-y-[-10px] transition-all duration-500 block p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/20 hover:border-yellow-400 w-full"
        >
          <h3 className="text-2xl font-bold mb-4 text-white hover:text-yellow-400 transition-colors">Адрес</h3>
          <p className="text-xl leading-relaxed text-white/90 hover:text-yellow-300 transition-colors font-semibold">
            {displayData.contacts.address}
          </p>
        </a>
        
        {/* Email */}
        <a 
          href={`mailto:${displayData.contacts.email}`}
          className="group hover:translate-y-[-10px] transition-all duration-500 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/20 hover:border-yellow-400 block w-full"
        >
          <h3 className="text-2xl font-bold mb-4 text-white hover:text-yellow-400 transition-colors"> ✉️ Email</h3>
          <p className="text-xl text-white/90 hover:text-yellow-300 transition-colors underline decoration-2 underline-offset-4">
            {displayData.contacts.email}
          </p>
        </a>
        
        {/* Телефон */}
        <a 
          href={`tel:${displayData.contacts.phone.replace(/\D/g, '')}`}
          className="group hover:translate-y-[-10px] transition-all duration-500 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/20 hover:border-yellow-400 block w-full"
        >
          <h3 className="text-2xl font-bold mb-4 text-white hover:text-yellow-400 transition-colors">📱Телефон</h3>
          <p className="text-2xl font-bold text-white/90 hover:text-yellow-300 transition-colors">
            {displayData.contacts.phone}
          </p>
        </a>

        {/* ← 4 КНОПКИ СОЦСЕТЕЙ (горизонтально) */}
       
      </div>
      
      {/* Правая колонка - 3/5 (60%) - КАРТА БОЛЬШЕ */}
      <div className="lg:col-span-3 relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-700 to-gray-800 h-[400px] flex items-center justify-center group hover:scale-[1.02] transition-transform duration-500">
        <a href="https://yandex.ru/profile/-/CPQK4QYu" target="_blank">
                <img src="https://api-maps.yandex.ru/services/constructor/1.0/static/?um=constructor%3A2630c3036e9771a5f944cd6a91245b9db19c793cad92778467244ac6f382aec9&amp;width=600&amp;height=450&amp;lang=ru_RU" alt=""  />
              </a>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 pt-4">
          {/* Telegram */}
          <a 
            href={displayData.contacts.telegram || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:border-blue-400 hover:translate-y-[-5px] transition-all duration-500 text-center"
          >
            <div className="text-3xl group-hover:text-blue-400 transition-colors">TG</div>
            <span className="font-bold text-lg text-white hover:text-blue-300 transition-colors">
              Мы в Telegram
            </span>
          </a>
          
          {/* Пустая кнопка 2 */}
          <div className="group flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 cursor-not-allowed opacity-50">
            <div className="text-3xl text-gray-400"></div>
            <span className="font-bold text-lg text-gray-400"></span>
          </div>
          
          {/* Пустая кнопка 3 */}
          <div className="group flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 cursor-not-allowed opacity-50">
            <div className="text-3xl text-gray-400"></div>
            <span className="font-bold text-lg text-gray-400"></span>
          </div>
          
          {/* VK */}
          <a 
            href={displayData.contacts.vk || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:border-purple-400 hover:translate-y-[-5px] transition-all duration-500 text-center"
          >
            <div className="text-3xl group-hover:text-purple-400 transition-colors">📘</div>
            <span className="font-bold text-lg text-white hover:text-purple-300 transition-colors">
              Мы в VK
            </span>
          </a>
        </div>
  </div>
</section>

      {/* Форма заказа звонка - ДОБАВЛЕНО ПОЛЕ reason */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                📞 Заказать звонок
              </h2>
              <button 
                onClick={() => setShowForm(false)}
                className="p-3 hover:bg-gray-200 rounded-2xl transition-all hover:scale-110"
              >
                <X size={32} />
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Ваше имя *" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl font-semibold focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all shadow-sm"
              />
              <input 
                type="tel" 
                placeholder="+7 (___) ___-__-__ *" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl font-semibold focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all shadow-sm"
              />
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl font-semibold focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all shadow-sm"
              />
              {/* ← НОВОЕ ПОЛЕ Желание (reason) */}
              <input 
                type="text" 
                placeholder="Желание" 
                value={formReason}
                readOnly // ← Только для чтения, заполняется автоматически
                className="w-full p-6 border-2 border-yellow-200 bg-yellow-50 rounded-3xl text-xl font-semibold shadow-sm cursor-not-allowed"
              />
              <textarea 
                placeholder="Вопрос (необязательно)" 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full p-6 border-2 border-gray-200 rounded-3xl text-xl font-semibold focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all shadow-sm resize-vertical"
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-8 px-12 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle size={32} />}
                <span>{loading ? 'Отправляем...' : 'Отправить заявку'}</span>
              </button>
            </form>
            <p className="text-center text-gray-500 mt-8 text-lg">
              Перезвоним в рабочее время.
            </p>
          </div>
        </div>
      )}
      {/* Error Banner */}
      {error && (
        <div className="fixed top-24 right-4 bg-yellow-500 text-black px-6 py-4 rounded-2xl shadow-2xl z-40 animate-pulse">
          ⚠️ {error} (админка работает)
        </div>
      )}
    </div>
  );
}
