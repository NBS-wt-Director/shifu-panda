'use client';
import styles from './SectionSpacer.module.css';

interface SectionSpacerProps {
  height?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'gradientBlue' | 'gradientGreen';
}

export default function SectionSpacer({ 
  height = 'md', 
  background = 'default' 
}: SectionSpacerProps) {
  return (
    <div className={`${styles.spacer} ${styles[height]} ${styles[background]}`} />
  );
}