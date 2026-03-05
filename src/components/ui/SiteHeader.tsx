'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import styles from './SiteHeader.module.css';

interface MenuItem {
  id: number | string;
  name: string;
  href?: string;
}

interface SectionItem {
  id: string;
  title: string;
}

interface HeaderSettings {
  titleSuffix: string
  componentsEnabled: {
    callButton: boolean
    pageTitle: boolean
    menu: boolean
  }
  componentsOrder: string[]
  homeMenuEnabled: boolean
  logoAnimation: string
  secondLineText: string
  secondLineAnimation: string
}

interface SiteHeaderProps {
  pageTitle?: string;
  onOpenCallModal?: (reason: string) => void;
  isHomePage?: boolean;
}

export default function SiteHeader({ 
  pageTitle = 'Центр Функционального Развития "Шифу Панда"',
  onOpenCallModal,
  isHomePage = false
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [trainersOpen, setTrainersOpen] = useState(false);
  const [programsForMenu, setProgramsForMenu] = useState<MenuItem[]>([]);
  const [trainersForMenu, setTrainersForMenu] = useState<MenuItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const homeMenuRef = useRef<HTMLDivElement>(null);

  // Загрузка меню из БД
  useEffect(() => {
    fetch('/api/db')
      .then(res => res.json())
      .then(data => {
        setProgramsForMenu(
          Array.isArray(data.programs) 
            ? data.programs.map((p: any) => ({ id: p.id, name: p.name, href: `/?scrollTo=${p.id}` }))
            : []
        );
        setTrainersForMenu(
          Array.isArray(data.trainers) 
            ? data.trainers.map((t: any) => ({ id: t.id, name: t.name, href: `/trainers/${t.id}` }))
            : []
        );
        // Загружаем секции для меню разделов
        if (data.sections && Array.isArray(data.sections)) {
          setSections(data.sections.map((s: any) => ({ id: s.id, title: s.title })));
        }
        // Загружаем настройки хедера
        if (data.headerSettings) {
          setHeaderSettings(data.headerSettings);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Установка title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const suffix = headerSettings?.titleSuffix || ' | Шифу Панда';
      document.title = pageTitle + suffix;
    }
  }, [pageTitle, headerSettings]);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDesktopMenuOpen(false);
        setProgramsOpen(false);
        setTrainersOpen(false);
      }
      if (homeMenuRef.current && !homeMenuRef.current.contains(e.target as Node)) {
        setHomeMenuOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Обработчик звонка
  const handleCallClick = () => {
    const reason = `Заказ обратной со страницы "${pageTitle}"`;
    if (onOpenCallModal) {
      onOpenCallModal(reason);
    }
  };

  // Обработчик логотипа на главной - показывает меню разделов
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      setHomeMenuOpen(!homeMenuOpen);
    } else {
      window.location.href = '/';
    }
  };

  // Базовые пункты меню
  const baseMenuItems = [
    { name: 'Расписание', href: '/schedule' },
    { name: 'Программы', href: '/programs' },
    { name: 'Тренеры', href: '/trainers' },
    { name: 'Контакты', href: '/contacts' },
    { name: 'Личный кабинет', href: '/lk' },
  ];

  return (
    <header className={styles.header}>
      {/* Верхняя строка: логотип | кнопка звонка | заголовок | меню */}
      <div className={styles.topRow}>
        {/* 1. ЛОГОТИП */}
        <div className={styles.logoSection} ref={homeMenuRef}>
          <Link 
            href="/" 
            className={styles.logoLink}
            onClick={handleLogoClick}
          >
            <Image 
              src='/logo.png'
              alt="Логотип" 
              className={`${styles.logo} ${headerSettings?.logoAnimation && headerSettings.logoAnimation !== 'none' ? styles[headerSettings.logoAnimation] : ''}`}
              width={48}
              height={48}
              priority
            />
          </Link>
          
          {/* Меню разделов главной страницы (только на главной) */}
          {isHomePage && homeMenuOpen && sections.length > 0 && (
            <div className={styles.homeMenu}>
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`/?scrollTo=${section.id}`}
                  className={styles.homeMenuItem}
                  onClick={() => setHomeMenuOpen(false)}
                >
                  {section.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 2. КНОПКА ЗВОНКА */}
        <button 
          className={styles.callButton}
          onClick={handleCallClick}
        >
          <Phone size={18} />
          <span>Заказать звонок</span>
        </button>

        {/* 3. ЗАГОЛОВОК СТРАНИЦЫ */}
        <div className={styles.titleSection}>
          <h1 className={`${styles.pageTitle} ${headerSettings?.logoAnimation && headerSettings.logoAnimation !== 'none' ? styles[headerSettings.logoAnimation] : ''}`}>
            {pageTitle}
          </h1>
          {headerSettings?.secondLineText && (
            <div className={`${styles.secondLine} ${headerSettings?.secondLineAnimation && headerSettings.secondLineAnimation !== 'none' ? styles[headerSettings.secondLineAnimation] : ''}`}>
              {headerSettings.secondLineText}
            </div>
          )}
        </div>

        {/* 4. КНОПКА МЕНЮ (десктоп) */}
        <div className={styles.menuSection} ref={menuRef}>
          <button 
            className={`${styles.menuToggle} ${desktopMenuOpen ? styles.menuOpen : ''}`}
            onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
          >
            <Menu size={22} />
            <span>Меню</span>
            <ChevronDown size={16} className={styles.chevron} />
          </button>

          {/* Выпадающее меню (десктоп) */}
          <div className={`${styles.dropdownMenu} ${desktopMenuOpen ? styles.dropdownOpen : ''}`}>
            {/* Главная с подменю разделов (только не на главной) */}
            {!isHomePage && (
              <div className={styles.menuItemWithSubmenu}>
                <Link href="/" className={styles.menuItem}>
                  🏠 Главная
                </Link>
                {sections.length > 0 && (
                  <div className={styles.submenu}>
                    {sections.map((section) => (
                      <Link
                        key={section.id}
                        href={`/?scrollTo=${section.id}`}
                        className={styles.submenuItem}
                        onClick={() => setDesktopMenuOpen(false)}
                      >
                        → {section.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Базовые пункты */}
            {baseMenuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={styles.menuItem}
                onClick={() => setDesktopMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Программы (сворачиваемое подменю) */}
            {programsForMenu.length > 0 && (
              <div className={styles.menuItemWithSubmenu}>
                <button 
                  className={styles.menuItemButton}
                  onClick={() => setProgramsOpen(!programsOpen)}
                >
                  ▶ Программы
                  <ChevronDown 
                    size={14} 
                    className={`${styles.submenuChevron} ${programsOpen ? styles.submenuChevronOpen : ''}`}
                  />
                </button>
                {programsOpen && (
                  <div className={styles.submenu}>
                    {programsForMenu.map((program) => (
                      <Link 
                        key={program.id} 
                        href={program.href} 
                        className={styles.submenuItem}
                        onClick={() => {
                          setDesktopMenuOpen(false);
                          setProgramsOpen(false);
                        }}
                      >
                        • {program.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Тренеры (сворачиваемое подменю) */}
            {trainersForMenu.length > 0 && (
              <div className={styles.menuItemWithSubmenu}>
                <button 
                  className={styles.menuItemButton}
                  onClick={() => setTrainersOpen(!trainersOpen)}
                >
                  ★ Тренеры
                  <ChevronDown 
                    size={14} 
                    className={`${styles.submenuChevron} ${trainersOpen ? styles.submenuChevronOpen : ''}`}
                  />
                </button>
                {trainersOpen && (
                  <div className={styles.submenu}>
                    {trainersForMenu.map((trainer) => (
                      <Link 
                        key={trainer.id} 
                        href={trainer.href} 
                        className={styles.submenuItem}
                        onClick={() => {
                          setDesktopMenuOpen(false);
                          setTrainersOpen(false);
                        }}
                      >
                        • {trainer.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* МОБИЛЬНАЯ КНОПКА МЕНЮ */}
        <button 
          className={styles.mobileToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileOpen : ''}`} ref={mobileRef}>
        <div className={styles.mobileMenuContent}>
          {/* Главная (если не на главной) */}
          {!isHomePage && (
            <Link href="/" className={styles.mobileMenuItem} onClick={() => setMobileMenuOpen(false)}>
              🏠 Главная
            </Link>
          )}
          
          {baseMenuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={styles.mobileMenuItem}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Программы - сворачиваемое подменю в мобильной версии */}
          {programsForMenu.length > 0 && (
            <div className={styles.mobileAccordion}>
              <button 
                className={styles.mobileAccordionButton}
                onClick={() => setProgramsOpen(!programsOpen)}
              >
                <span>Программы</span>
                <ChevronDown size={18} className={`${styles.mobileChevron} ${programsOpen ? styles.mobileChevronOpen : ''}`} />
              </button>
              {programsOpen && (
                <div className={styles.mobileAccordionContent}>
                  {programsForMenu.map((program) => (
                    <Link 
                      key={program.id} 
                      href={program.href} 
                      className={styles.mobileMenuItem}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ▶ {program.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Тренеры - сворачиваемое подменю в мобильной версии */}
          {trainersForMenu.length > 0 && (
            <div className={styles.mobileAccordion}>
              <button 
                className={styles.mobileAccordionButton}
                onClick={() => setTrainersOpen(!trainersOpen)}
              >
                <span>Тренеры</span>
                <ChevronDown size={18} className={`${styles.mobileChevron} ${trainersOpen ? styles.mobileChevronOpen : ''}`} />
              </button>
              {trainersOpen && (
                <div className={styles.mobileAccordionContent}>
                  {trainersForMenu.map((trainer) => (
                    <Link 
                      key={trainer.id} 
                      href={trainer.href} 
                      className={styles.mobileMenuItem}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ★ {trainer.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <button 
            className={styles.mobileCallButton}
            onClick={() => {
              handleCallClick();
              setMobileMenuOpen(false);
            }}
          >
            <Phone size={20} />
            Заказать звонок
          </button>
        </div>
      </div>

      {/* Оверлей мобильного меню */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
}
