'use client';
import styles from './HomeSocialButtons.module.css';

interface SocialItem {
  id: string;
  title: string;
  url: string;
}

interface HomeSocialButtonsProps {
  social: SocialItem[];
}

export default function HomeSocialButtons({ social }: HomeSocialButtonsProps) {
  return (
    <div className={styles.grid}>
      {social.map(socialItem => (
        <SocialButton key={socialItem.id} item={socialItem} />
      ))}
    </div>
  );
}

function SocialButton({ item }: { item: SocialItem }) {
  const isDisabled = !item.url || item.url.trim() === '';
  const icons: Record<string, string> = {
    vk: '📘',
    telegram: '📱',
    balloo: '🎈',
    max: '⭐'
  };

  return (
    <div className={`${styles.button} ${isDisabled ? styles.disabled : ''}`}>
      {isDisabled ? (
        <div className={styles.icon}>{icons[item.id] || '🌐'}</div>
      ) : (
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={item.title}
        >
          <span className={styles.icon}>{icons[item.id] || '🌐'}</span>
          <span>{item.title}</span>
        </a>
      )}
    </div>
  );
}
