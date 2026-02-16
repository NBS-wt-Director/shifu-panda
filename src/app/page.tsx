'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import SectionSpacer from '@/components/ui/SectionSpacer';
import HomeHeader from '@/components/home/HomeHeader';
import HomeSlider from '@/components/home/HomeSlider';
import HomeSchedule from '@/components/home/HomeSchedule';
import HomePrices from '@/components/home/HomePrices';
import HomePrograms from '@/components/home/HomePrograms';
import HomeTrainers from '@/components/home/HomeTrainers';
import HomeNews from '@/components/home/HomeNews';
import HomeContacts from '@/components/home/HomeContacts';
import GlobalPreloader from '@/components/ui/GlobalPreloader';
import FullScreenImageModal from '@/components/ui/FullScreenImageModal';
import CallModal from '@/components/ui/CallModal'; // ✅ НОВЫЙ

export default function HomePage() {
  const [displayData, setDisplayData] = useState({});
  const [data, setData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState({ open: false, url: '', alt: '' });
  
  // ✅ ФОРМА ЗВОНКА
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callReason, setCallReason] = useState('Общий запрос');

  const router = useRouter();

  useEffect(() => {
    fetch('/api/db')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setDisplayData(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      setIsAdmin(!!adminToken);
    }
  }, []);

  // ✅ ФУНКЦИИ ДЛЯ ВСЕХ КОМПОНЕНТОВ
  const openImageModal = (url: string, alt: string) => {
    setModalImage({ open: true, url, alt });
  };

  const openCallModal = (reason: string = 'Общий запрос') => {
    setCallReason(reason);
    setCallModalOpen(true);
  };

  if (loading) return <GlobalPreloader />;

  return (
    <>


<section id="news">

</section>
      {/* ✅ БЕЗ ОТСТУПОВ МЕЖДУ РАЗДЕЛАМИ */}
      <HomeHeader 
        displayData={displayData}
        logo={data.logo}
        openCallModal={openCallModal}
      />
      
      <HomeSlider sliders={data.sliders || []} />
      
      <section id="schedule"><HomeSchedule openImageModal={openImageModal} /></section>
           <SectionSpacer height="sm" background="gradientBlue" />
      <section id="prices"><HomePrices openImageModal={openImageModal} /></section>
           <SectionSpacer height="sm" background="gradientBlue" />
           <section id="programs">
  <HomePrograms 
    programs={Array.isArray(data?.programs) ? data.programs : []}
    openCallModal={openCallModal}
    openImageModal={openImageModal}
  />
</section>
           <SectionSpacer height="sm" background="gradientBlue" />
      <section id="trainers"><HomeTrainers 
        trainers={data.trainers || []} 
        openCallModal={openCallModal}
        openImageModal={openImageModal}
      /></section>
           <SectionSpacer height="sm" background="gradientBlue" />
   <HomeNews 
    news={Array.isArray(data?.news) ? data.news : []}
    openImageModal={openImageModal}
  />
           <SectionSpacer height="sm" background="gradientBlue" />
      <section id="contacts"><HomeContacts contacts={data.contacts || {}} /></section>

      {/* ✅ МОДАЛКИ */}
      <FullScreenImageModal 
        isOpen={modalImage.open}
        imageUrl={modalImage.url}
        alt={modalImage.alt}
        onClose={() => setModalImage({ open: false, url: '', alt: '' })}
      />
      
      <CallModal 
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        reason={callReason}
      />
    </>
  );
}
