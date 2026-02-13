'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X, 
  Phone 
} from 'lucide-react';

interface SiteData {
  programs: Array<{ id: number; name: string; image?: string }>;
  trainers: Array<{ 
    id: number; 
    name: string; 
    specialization?: string; 
    experience?: string;
    image?: string;
  }>;
  contacts: {
    address: string;
    phone: string;
    email: string;
    telegram?: string;
    vk?: string;
  };
}

interface HeaderProps {
  data?: SiteData;
  onCallClick?: (reason: string) => void;
  onLogoClick?: () => void;
  onNavClick?: (section: string) => void;
  callReason?: string;
}

export default function Header({
  data,
  onCallClick,
  onLogoClick,
  onNavClick,
  callReason = 'заказать звонок'
}: HeaderProps) {
  const router = useRouter(); // ✅ Для редиректа
  
  // Состояния меню
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredPrograms, setHoveredPrograms] = useState(false);
  const [hoveredTrainers, setHoveredTrainers] = useState(false);

  // Данные по умолчанию
  const defaultData: SiteData = {
    programs: [],
    trainers: [],
    contacts: {
      address: 'г. Екатеринбург',
      phone: '+7 (343) 123-45-67',
      email: 'centr-fr@yandex.ru'
    }
  };

  const displayData = data || defaultData;

  // Закрытие мобильного меню при клике вне
  useEffect(() => {
    const handleClickOutside = () => {
      setMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: сначала на главную, потом scroll
  const scrollTo = (id: string) => {
    // Если мы НЕ на главной - переходим на главную
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      router.push('/'); 
      // После перехода scroll произойдет автоматически через onNavClick
    } else {
      // Если уже на главной - просто скроллим
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    
    setMobileMenuOpen(false);
    onNavClick?.(id);
  };

  const handleCallClick = (reason: string = callReason) => {
    onCallClick?.(reason);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    // ЛОГО всегда на главную + скролл к slider
    router.push('/');
    onLogoClick?.();
  };

  return (
    <>
      {/* ДЕСКТОП + МОБИЛЬНЫЙ HEADER */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          {/* КНОПКА ЗАКАЗАТЬ ЗВОНОК С КАСТОМНЫМ ПОВОДОМ */}
  
          {/* ЛОГО - ПЕРЕХОД НА ГЛАВНУЮ */}
          <h1 
            className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-all"
            onClick={handleLogoClick}
          >
            Шифу Панда
          </h1>
          
          {/* МОБИЛЬНАЯ КНОПКА МЕНЮ */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-2xl hover:bg-gray-100 transition-all"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          
          {/* ДЕСКТОП МЕНЮ */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollTo('schedule')} 
              className="text-xl font-semibold hover:text-yellow-500 transition-all py-2 px-4 hover:bg-yellow-50 rounded-xl"
            >
              📅 Расписание
            </button>
            
            {/* ПРОГРАММЫ - DROPDOWN */}
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
                    <p className="px-6 py-2 text-xs text-gray-500 text-center">
                      +{displayData.programs.length - 6} ещё
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* ТРЕНЕРЫ - DROPDOWN */}
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
                  <div className="px-6 pb-4 mb-4 border-b border-gray-200">
                    <a 
                      href="/trainers" 
                      className="flex items-center gap-3 text-xl font-black hover:bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:text-blue-700 transition-all p-4 w-full block"
                    >
                      👥 Наш коллектив ({displayData.trainers.length})
                      <ChevronRight size={20} className="ml-auto text-blue-500" />
                    </a>
                  </div>
                  
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
      </header>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl px-4 py-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
          {/* Заказать звонок */}
          <div className="pt-4 border-t border-gray-200">
            <button 
              onClick={() => handleCallClick(callReason)}
              className="w-full flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-6 py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg justify-center"
              title={`Заказать звонок: ${callReason}`}
            >
              <Phone size={24} />
              <span>📞 Заказать звонок</span>
            </button>
          </div>

          {/* Навигация */}
          <nav className="space-y-4">
            <button 
              onClick={() => scrollTo('schedule')}
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
                onClick={() => scrollTo('programs')}
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
                onClick={() => scrollTo('trainers')}
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
              onClick={() => scrollTo('news')}
              className="w-full flex items-center space-x-4 p-6 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-2xl font-semibold text-xl shadow-sm hover:shadow-md transition-all border border-orange-100 hover:border-orange-200"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-lg">📰</span>
              </div>
              <span>Новости</span>
            </button>

            <button 
              onClick={() => scrollTo('contacts')}
              className="w-full flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl font-semibold text-xl shadow-sm hover:shadow-md transition-all border border-purple-100 hover:border-purple-200"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-lg">📞</span>
              </div>
              <span>Контакты</span>
            </button>
          </nav>

          {/* Контакты внизу */}
          <div className="pt-6 border-t-2 border-gray-100 space-y-4">
            <div className="text-center py-4 px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <p className="text-2xl font-black text-gray-900 mb-2">🐼 Шифу Панда</p>
              <p className="text-lg text-gray-600">{displayData.contacts?.address}</p>
            </div>
            
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                window.open(`tel:${displayData.contacts?.phone}`, '_self');
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
            >
              <Phone size={24} />
              <span>Позвонить сейчас</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
