'use client';
import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import styles from './FullScreenImageModal.module.css';

interface FullScreenImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  alt?: string;
  onClose: () => void;
}

export default function FullScreenImageModal({ 
  isOpen, 
  imageUrl, 
  alt = '', 
  onClose 
}: FullScreenImageModalProps) {
  const [loaded, setLoaded] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    setLoaded(false);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={32} />
        </button>
        
        <div className={styles.imageContainer}>
          {!loaded && <div className={styles.loading}>Загрузка...</div>}
          <img
            src={imageUrl}
            alt={alt}
            className={`${styles.image} ${loaded ? styles.loaded : ''}`}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}
