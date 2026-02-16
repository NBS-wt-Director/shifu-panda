'use client';
import styles from './AdminItemList.module.css';

interface AdminItemListProps {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
}

export default function AdminItemList({ items, onEdit, onDelete }: AdminItemListProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemContent}>
            <h3 className={styles.itemTitle}>{item.name || item.title || `Элемент ${item.id}`}</h3>
            <p className={styles.itemId}>ID: {item.id}</p>
          </div>
          <div className={styles.actions}>
            <button onClick={() => onEdit(item)} className={styles.editBtn}>✏️ Редактировать</button>
            <button onClick={() => onDelete(item.id)} className={styles.deleteBtn}>🗑️ Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
}
