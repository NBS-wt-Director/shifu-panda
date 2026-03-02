'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HomeSlider.module.css'

interface SliderItem {
  id: number
  title?: string
  image: string
  interval?: number
  link?: string
}

interface HomeSliderProps {
  sliders: SliderItem[]
  defaultInterval?: number
}

export default function HomeSlider({ 
  sliders, 
  defaultInterval = 5 
}: HomeSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!sliders?.length) return

    const currentInterval = sliders[currentSlide]?.interval || defaultInterval
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length)
    }, currentInterval * 1000)

    return () => clearInterval(interval)
  }, [sliders, currentSlide, defaultInterval])

  if (!sliders?.length) return null

  const currentSlideData = sliders[currentSlide]
  const hasTitle = currentSlideData.title?.trim()
  const hasText = hasTitle // показываем блок только если есть title

  const goPrev = () => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)
  const goNext = () => setCurrentSlide((prev) => (prev + 1) % sliders.length)

  return (
    <section className={styles.slider}>
      {sliders.map((slide, index) => (
        <div key={slide.id} className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}>
          <Image 
            src={slide.image} 
            alt={slide.title || 'Слайд'}
            fill 
            className={styles.slideImage} 
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
      
      {hasText && (
        <div className={styles.sliderText}>
          {currentSlideData.link ? (
            <Link href={currentSlideData.link} className={styles.slideLink}>
              <h1 className={styles.slideTitle}>{currentSlideData.title}</h1>
            </Link>
          ) : (
            <h1 className={styles.slideTitle}>{currentSlideData.title}</h1>
          )}
        </div>
      )}

      <button className={styles.navPrev} onClick={goPrev} aria-label="Предыдущий слайд">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>
      
      <button className={styles.navNext} onClick={goNext} aria-label="Следующий слайд">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>

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
  )
}
