'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HomeSlider.module.css';

interface SliderItem {
  id: number;
  image: string;
  description?: string;
  bg_dscrptn?: string;
}

interface HomeSliderProps {
  sliders: SliderItem[];
}

export default function HomeSlider({ sliders = [] }: HomeSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  if (!sliders?.length) return null;

  const currentSlideData = sliders[currentSlide];

  return (
    <section className={styles.slider}>
      {sliders.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
        >
          <Image 
            src={slide.image} 
            alt={slide.description || 'Слайд'}
            fill 
            className={styles.slideImage}
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* ✅ ТЕКСТ НА СЛАЙДЕРЕ */}
      {(currentSlideData.description || currentSlideData.bg_dscrptn) && (
        <div className={styles.sliderText}>
          {currentSlideData.description && (
            <h1 className={styles.slideTitle}>{currentSlideData.description}</h1>
          )}
          {currentSlideData.bg_dscrptn && (
            <p className={styles.slideSubtitle}>{currentSlideData.bg_dscrptn}</p>
          )}
        </div>
      )}
      
      <div className={styles.dots}>
        {sliders.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
