'use client';
import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminItemForm from '@/components/admin/AdminItemForm';
import AdminItemList from '@/components/admin/AdminItemList';
import AdminSections from '@/components/admin/AdminSections';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminSlider from '@/components/admin/AdminSlider';
import AdminSchedulePrices from '@/components/admin/AdminSchedulePrices';
import AdminPrograms from '@/components/admin/AdminPrograms';
import AdminStaffPrograms from '@/components/admin/AdminStaffPrograms'; 
import AdminSettings from '@/components/admin/AdminSettings';
import AdminNews from '@/components/admin/AdminNews';
import styles from './page.module.css';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [dbData, setDbData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const [activeTab, setActiveTab] = useState('sliders');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [changesCount, setChangesCount] = useState(0);
    const tabConfig = {

    programs: { component: 'programs' },
    sliders: { component: 'slider' }, 
    schedulePrices: { component: 'schedulePrices' },
     staff: { component: 'staff' },
     news: { component: 'news' },
   sections: { component: 'sections' },
    contacts: { component: 'contacts' },
    settings: { component: 'settings' },
  };


  // ✅ АВТОРИЗАЦИЯ
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin-auth') === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/db');
      const data = await response.json();
      setDbData(data);
      setOriginalData(JSON.parse(JSON.stringify(data))); // Копия для сравнения
      setChangesCount(0);
    } catch {
      console.error('Ошибка загрузки БД');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/db');
      const db = await response.json();
      const correctPassword = db.adminPassword || db.settings?.adminPassword || 'цфр2026';

      if (password === correctPassword) {
        localStorage.setItem('admin-auth', 'true');
        setIsAuthenticated(true);
        setDbData(db);
        setOriginalData(JSON.parse(JSON.stringify(db)));
        setError('');
      } else {
        setError('❌ Неверный пароль!');
      }
    } catch {
      if (password === 'цфр2026') {
        localStorage.setItem('admin-auth', 'true');
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('❌ Неверный пароль!');
      }
    }
  };

  const saveAllChanges = async () => {
    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbData)
      });
      
      if (response.ok) {
        setOriginalData(JSON.parse(JSON.stringify(dbData)));
        setChangesCount(0);
        console.log('✅ Все изменения сохранены!');
      }
    } catch {
      console.error('Ошибка сохранения');
    }
  };

  const handleItemSave = (itemData: any) => {
    const newData = { ...dbData };
    const items = newData[activeTab] || [];
    
    if (editingItem) {
      newData[activeTab] = items.map((item: any) => 
        item.id === editingItem.id ? itemData : item
      );
    } else {
      newData[activeTab] = [...items, { ...itemData, id: Date.now() }];
    }
    
    setDbData(newData);
    setEditingItem(null);
    updateChangesCount(newData);
  };

  const handleItemDelete = (id: number) => {
    const newData = { ...dbData };
    newData[activeTab] = (newData[activeTab] || []).filter((item: any) => item.id !== id);
    setDbData(newData);
    updateChangesCount(newData);
  };

  const updateChangesCount = (currentData: any) => {
    const changes = JSON.stringify(currentData) !== JSON.stringify(originalData) ? 1 : 0;
    setChangesCount(changes);
  };
  const defaultContacts = {
  address: "г. Екатеринбург, ул. 8 Марта, 70 (налево за постом охраны, этаж 2)",
  email: "centr-fr@yandex.ru",
  phone: "+7 (902) 258-45-47",
  vk: "https://vk.com/tsentrrazvitiya",
  telegram: "https://t.me/+OUEDmEm3UT5kM2Qy",
  social: [
    {"id": "vk", "title": "ВКонтакте", "url": "https://vk.com/tsentrrazvitiya"},
    {"id": "telegram", "title": "Telegram", "url": "https://t.me/+OUEDmEm3UT5kM2Qy"},
    {"id": "balloo", "title": "мы в BALLOO (скоро)", "url": ""},
    {"id": "max", "title": "мы в MAX (скоро)", "url": ""}
  ]
};


  const currentConfig = tabConfig[activeTab as keyof typeof tabConfig] || { fields: [] };
  const currentItems = dbData[activeTab] || [];
const defaultSections = [
  { id: "schedule", title: "Расписание занятий", background: "yellow-orange" },
  { id: "prices", title: "Наши цены", background: "green-blue" },

];
  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    setDbData({});
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1>🔐 Админ панель</h1>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="цфр2026"
              autoFocus
            />
            <button type="submit">Войти</button>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <AdminHeader 
        changesCount={changesCount}
        onSave={saveAllChanges}
        dbData={dbData}
        onLogout={handleLogout}
      />
      
      <div className={styles.content}>
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className={styles.mainGrid}>
          {currentConfig.component === 'settings' ? (
  <AdminSettings 
    siteSettings={dbData.siteSettings || { logo: '', favicon: '' }}
    emailConfig={dbData.emailConfig || {}}
    onSave={(newSiteSettings, newEmailConfig) => {
      const newData = { 
        ...dbData, 
        siteSettings: newSiteSettings,
        emailConfig: newEmailConfig
      };
      setDbData(newData);
      updateChangesCount(newData);
    }}
  />
) :currentConfig.component === 'news' ? (
  <AdminNews 
    news={dbData.news || []}
    onSave={(newNews) => {
      const newData = { ...dbData, news: newNews };
      setDbData(newData);
      updateChangesCount(newData);
    }}
  />
) :currentConfig.component === 'staff' ? (  // ← НОВОЕ УСЛОВИЕ
    <AdminStaffPrograms 
      trainers={dbData.trainers || []}
      staff={dbData.staff || []}
      onSave={(newTrainers, newStaff) => {  // ← ДВА параметра!
        const newData = { 
          ...dbData, 
          trainers: newTrainers, 
          staff: newStaff 
        };
        setDbData(newData);
        updateChangesCount(newData);
      }}
    />
  ) :currentConfig.component === 'programs' ? (
  <AdminPrograms 
    programs={dbData.programs || []}
    onSave={(newPrograms) => {
      const newData = { ...dbData, programs: newPrograms };
      setDbData(newData);
      updateChangesCount(newData);
    }}
  />
) : currentConfig.component === 'schedulePrices' ? (
  <AdminSchedulePrices 
    schedule={dbData.schedule || []}
    prices={dbData.prices || []}
    news={dbData.news || []}
    onSaveSchedule={(newSchedule) => {
      const newData = { ...dbData, schedule: newSchedule };
      setDbData(newData);
      updateChangesCount(newData);
    }}
    onSavePrices={(newPrices) => {
      const newData = { ...dbData, prices: newPrices };
      setDbData(newData);
      updateChangesCount(newData);
    }}
    onAddNews={(newNews) => {
      const newData = { 
        ...dbData, 
        news: [...(dbData.news || []), newNews] 
      };
      setDbData(newData);
      updateChangesCount(newData);
    }}
  />
) :currentConfig.component === 'slider' ? (
  <AdminSlider 
    sliders={dbData.sliders || []}
    onSave={(newSliders) => {
      const newData = { ...dbData, sliders: newSliders };
      setDbData(newData);
      updateChangesCount(newData);
    }}
  />
):currentConfig.component === 'contacts' ? (
  <AdminContacts 
    data={dbData.contacts || defaultContacts}
    onSave={(newContacts) => {
      const newData = { ...dbData, contacts: newContacts };
      setDbData(newData);
      updateChangesCount(newData);
    }}
  />
) :currentConfig.component === 'sections' ? (
    <AdminSections 
      sections={dbData.sections || defaultSections}
      onSave={(newSections) => {
        const newData = { ...dbData, sections: newSections };
        setDbData(newData);
        updateChangesCount(newData);
      }}
    />
  ) : (
    <h1>Секция в разработке!</h1>
  )}
</div>
      </div>
    </div>
  );
}
