'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface StatsCollectorProps {
  enabled?: boolean;
}

export default function StatsCollector({ enabled = true }: StatsCollectorProps) {
  const pathname = usePathname();
  const prevPathname = useRef<string>('');

  useEffect(() => {
    if (!enabled || !pathname || pathname === prevPathname.current) return;
    
    // Обновляем предыдущий путь
    prevPathname.current = pathname;

    // Отправляем статистику посещения страницы
    const sendStats = async () => {
      try {
        // Убеждаемся что pathname начинается со слэша
        const pagePath = pathname.startsWith('/') ? pathname : `/${pathname}`;
        
        await fetch('/api/admin/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pageview',
            page: pagePath
          })
        });
      } catch (e) {
        // Игнорируем ошибки статистики
      }
    };

    sendStats();
  }, [pathname, enabled]);

  return null;
}
