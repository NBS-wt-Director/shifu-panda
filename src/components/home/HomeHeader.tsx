'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Menu, X } from 'lucide-react';
import styles from './HomeHeader.module.css';

interface HomeHeaderProps {
  displayData: any;
  logo?: string;
  openCallModal: (reason: string) => void;
}

export default function HomeHeader({ displayData, logo, openCallModal }: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isTrainersOpen, setIsTrainersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const trainersForMenu = displayData.trainers?.map((t: any) => ({
    id: t.id,
    name: t.name
  })) || [];

  const programsForMenu = displayData.programs?.map((p: any) => ({
    id: p.id,
    name: p.name
  })) || [];

  // ✅ ЗАКРЫТИЕ ПОДМЕНЮ
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProgramsOpen(false);
        setIsTrainersOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsProgramsOpen(false);
      setIsTrainersOpen(false);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={styles.header}>
      {/* ✅ ЛОГОТИП С АНИМАЦИЕЙ */}
      <Link href="/" className={styles.logoLink}>
       
          <Image 
            src='/logo.png'
            alt="Логотип" 
            className={styles.logo}
            width={48}
            height={48}
            priority
          />
             </Link>

      {/* ✅ МОБИЛЬНАЯ КНОПКА */}
      <button 
        className={styles.mobileToggle}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Меню"
      >
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* ✅ ДЕСКТОП МЕНЮ */}
      <nav className={styles.desktopNav} ref={dropdownRef}>
        <ul className={styles.navList}>
          <li><a href="#schedule" className={styles.navLink}>Расписание</a></li>
          <li><a href="#prices" className={styles.navLink}>Цены</a></li>
          <li><a href="#programs" className={styles.navLink}>Программы</a></li>
          <li><a href="#trainers" className={styles.navLink}>Тренеры</a></li>
          <li><a href="#news" className={styles.navLink}>Новости</a></li>
          <li><a href="#contacts" className={styles.navLink}>Контакты</a></li>

          {/* ✅ ПОДМЕНЮ ПРОГРАММЫ */}
          <li className={styles.dropdown}>
            <span 
              className={styles.dropdownToggle}
              onClick={() => setIsProgramsOpen(!isProgramsOpen)}
            >
              Программы ▼
            </span>
            <div className={`${styles.dropdownMenu} ${isProgramsOpen ? styles.open : ''}`}>
              <a href="/programs" className={`${styles.dropdownLink} ${styles.dropdownHeader}`}>
                Все программы
              </a>
              {programsForMenu.map((program: any) => (
                <a key={program.id} href={`/programs/${program.id}`} className={styles.dropdownLink}>
                  {program.name}
                </a>
              ))}
            </div>
          </li>

          {/* ✅ ПОДМЕНЮ КОЛЛЕКТИВ */}
          <li className={styles.dropdown}>
            <span 
              className={styles.dropdownToggle}
              onClick={() => setIsTrainersOpen(!isTrainersOpen)}
            >
              Коллектив ▼
            </span>
            <div className={`${styles.dropdownMenu} ${isTrainersOpen ? styles.open : ''}`}>
              <a href="/trainers" className={`${styles.dropdownLink} ${styles.dropdownHeader}`}>
                Наш коллектив
              </a>
              {trainersForMenu.map((trainer: any) => (
                <a key={trainer.id} href={`/trainers/${trainer.id}`} className={styles.dropdownLink}>
                  {trainer.name}
                </a>
              ))}
            </div>
          </li>
        </ul>
      </nav>

      {/* ✅ КНОПКА ЗВОНКА */}
      <button 
        className={styles.callButton}
        onClick={() => openCallModal('Общий запрос')}
      >
        <Phone size={24} />
        Заказать звонок
      </button>

      {/* ✅ МОБИЛЬНОЕ МЕНЮ */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileOpen : ''}`} ref={mobileRef}>
        <ul className={styles.mobileNavList}>
          <li><a href="#schedule" className={styles.mobileNavLink}>Расписание</a></li>
          <li><a href="#prices" className={styles.mobileNavLink}>Цены</a></li>
          <li><a href="#programs" className={styles.mobileNavLink}>Программы</a></li>
          <li><a href="#trainers" className={styles.mobileNavLink}>Тренеры</a></li>
          <li><a href="#news" className={styles.mobileNavLink}>Новости</a></li>
          <li><a href="#contacts" className={styles.mobileNavLink}>Контакты</a></li>
          <li className={styles.mobileDropdown}>
            <span className={styles.mobileDropdownToggle}>Программы</span>
            <div className={styles.mobileDropdownMenu}>
              <a href="#programs" className={styles.mobileDropdownLink}>Все программы</a>
              {programsForMenu.map((program: any) => (
                <a key={program.id} href="#programs" className={styles.mobileDropdownLink}>
                  {program.name}
                </a>
              ))}
            </div>
          </li>
          <li className={styles.mobileDropdown}>
            <span className={styles.mobileDropdownToggle}>Коллектив</span>
            <div className={styles.mobileDropdownMenu}>
              <a href="#trainers" className={styles.mobileDropdownLink}>Наш коллектив</a>
              {trainersForMenu.map((trainer: any) => (
                <a key={trainer.id} href="#trainers" className={styles.mobileDropdownLink}>
                  {trainer.name}
                </a>
              ))}
            </div>
          </li>
        </ul>
        <button 
          className={styles.mobileCallButton}
          onClick={() => {
            openCallModal('Общий запрос');
            setMobileMenuOpen(false);
          }}
        >
          📞 Заказать звонок
        </button>
      </div>

      {/* ✅ ОВЕРЛЕЙ */}
      {mobileMenuOpen && <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />}
    </header>
  );
}
