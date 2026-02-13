'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

interface SiteData {
  contacts: {
    address: string;
    phone: string;
    email: string;
    telegram?: string;
    vk?: string;
  };
}

interface FooterProps {
  data?: SiteData;
  onCallClick?: (reason: string) => void;
}

export default function Footer({ 
  data, 
  onCallClick 
}: FooterProps) {
  // Данные по умолчанию
  const defaultData: SiteData = {
    contacts: {
      address: 'г. Екатеринбург, ул. Ленина, 25',
      phone: '+7 (343) 123-45-67',
      email: 'centr-fr@yandex.ru',
      telegram: '',
      vk: ''
    }
  };

  const contacts = data?.contacts || defaultData.contacts;

  const handleCallClick = () => {
    onCallClick?.('заказать звонок из футера');
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12 w-full">
          {/* Левая колонка - Контакты */}
          <div className="">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">🐼</span>
              </div>
              <div>
                <h3 className="text-2xl font-black">Шифу Панда</h3>
                <p className="text-yellow-400 font-semibold">Кунг-фу для всех</p>
              </div>
            </div>

            {/* Адрес */}
            <a 
              href="https://yandex.ru/profile/-/CPQK4QYu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 border border-white/20"
            >
              <MapPin className="w-6 h-6 mt-0.5 flex-shrink-0 text-yellow-400 group-hover:scale-110 transition-all" />
              <div>
                <p className="font-semibold text-lg mb-1">Адрес</p>
                <p className="text-gray-300 leading-relaxed">{contacts.address}</p>
              </div>
            </a>

            {/* Телефон */}
            <a 
              href={`tel:${contacts.phone.replace(/\D/g, '')}`}
              className="group flex items-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-white/20"
              onClick={handleCallClick}
            >
              <Phone className="w-6 h-6 flex-shrink-0 text-yellow-400 group-hover:scale-110 transition-all" />
              <div>
                <p className="font-semibold text-lg mb-1">{contacts.phone}</p>
                <p className="text-sm text-gray-400">Позвонить</p>
              </div>
            </a>

            {/* Email */}
            <a 
              href={`mailto:${contacts.email}`}
              className="group flex items-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 border border-white/20"
            >
              <Mail className="w-6 h-6 flex-shrink-0 text-yellow-400 group-hover:scale-110 transition-all" />
              <div>
                <p className="font-semibold text-lg mb-1">{contacts.email}</p>
                <p className="text-sm text-gray-400">Написать</p>
              </div>
            </a>
          </div>

          {/* Центральные колонки */}
          <div className="">
            {/* Навигация */}
            <div>
              <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                <span>📋</span>
                <span>Перейти к</span>
              </h4>
              <nav className="space-y-3">
                <Link href="/" className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/20 hover:-translate-x-2 transition-all duration-300">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-110 transition-all" />
                  <span className="text-gray-300 hover:text-white font-medium">Главная</span>
                </Link>
               
              </nav>
            </div>

            {/* Быстрые действия */}
          
          </div>

        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-white/10 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <center><p className="text-gray-400 text-sm">
              © 2026 Шифу Панда. Все права защищены. Екатеринбург.
            </p></center>
          </div>
        </div>
      </div>
    </footer>
  );
}
