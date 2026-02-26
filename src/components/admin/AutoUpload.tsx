'use client';
import { useState, useEffect } from 'react';
import styles from './AutoUpload.module.css';

interface AutoUploadData {
  status: 'idle' | 'scanning' | 'parsing' | 'success' | 'error' | 'auth';
  log: string[];
  progress: number;
  folderPath?: string;
  oauthToken?: string;
  isTokenValid?: boolean;
  scanResult?: any;
}

interface AutoUploadProps {
  autouploadData: AutoUploadData;
  onSave: (data: AutoUploadData) => void;
}

export default function AutoUpload({ autouploadData, onSave }: AutoUploadProps) {
  const [folderPath, setFolderPath] = useState('');
  const [oauthToken, setOauthToken] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeScanType, setActiveScanType] = useState<'programs' | 'trainers' | 'sliders'>('programs');

  console.log('🔄 RENDER AutoUpload:', { status: autouploadData?.status, hasToken: !!autouploadData?.oauthToken });

  const safeData = autouploadData || { 
    status: 'idle' as const, 
    log: [], 
    progress: 0,
    folderPath: '',
    oauthToken: '',
    isTokenValid: false,
    scanResult: null 
  };

  useEffect(() => {
    console.log('📥 useEffect: загрузка данных из БД');
    if (safeData.folderPath) {
      setFolderPath(safeData.folderPath);
      console.log('📁 Загружен folderPath:', safeData.folderPath);
    }
    if (safeData.oauthToken) {
      setOauthToken(safeData.oauthToken);
      console.log('🔑 Загружен oauthToken');
    }
  }, [safeData.folderPath, safeData.oauthToken]);

  const addLog = (message: string) => {
    console.log('📝 addLog:', message);
    const timestamp = new Date().toLocaleTimeString('ru-RU');
    const newLog = [...safeData.log, `${timestamp}: ${message}`].slice(-100);
    const newData = { ...safeData, log: newLog };
    onSave(newData);
  };

  const testToken = async () => {
    console.log('🚀 === TEST TOKEN НАЧАЛО ===');
    console.log('🔘 1. КНОПКА НАЖАТА! testToken вызвана');
    
    if (!oauthToken.trim()) {
      console.log('❌ 2. ТОКЕН ПУСТОЙ');
      addLog('❌ Введите OAuth токен');
      return false;
    }

    console.log('✅ 2. ТОКЕН ЕСТЬ:', oauthToken.slice(0, 15) + '...');
    
    // Обновляем UI
    addLog('🔑 Тестирую токен...');
    const authData = { ...safeData, status: 'auth' as const, progress: 30 };
    console.log('🔄 3. Обновляю статус на auth');
    onSave(authData);

    try {
      console.log('🌐 4. Отправляю fetch запрос...');
      const response = await fetch('https://cloud-api.yandex.net/v1/disk/resources?path=%2F', {
        method: 'GET',
        headers: { 
          'Authorization': `OAuth ${oauthToken}`,
          'Accept': 'application/json'
        }
      });

      console.log('📡 5. ПОЛУЧЕН ОТВЕТ:', response.status, response.statusText);
      console.log('📡 5.1 Headers:', Object.fromEntries(response.headers.entries()));
      addLog(`Токен: ${response.status} ${response.statusText}`);

      if (response.ok) {
        console.log('✅ 6. ТОКЕН РАБОТАЕТ! Парсю JSON...');
        const data = await response.json();
        console.log('📂 6.1 Корневых папок:', data._embedded?.items?.length || 0);
        console.log('📂 6.2 Первые папки:', data._embedded?.items?.slice(0, 3).map((i: any) => i.name));
        
        const rootFolders = data._embedded?.items?.length || 0;
        addLog(`✅ Токен работает! Корневых папок: ${rootFolders}`);
        
        const validData = { 
          ...safeData, 
          status: 'idle' as const, 
          progress: 100,
          oauthToken,
          isTokenValid: true 
        };
        console.log('💾 7. Сохраняю ВАЛИДНЫЙ токен');
        onSave(validData);
        console.log('✅ === TEST TOKEN УСПЕХ ===');
        return true;
      } else {
        console.log('❌ 6. ТОКЕН НЕ РАБОТАЕТ');
        const errorText = await response.text();
        console.error('❌ 6.1 ОШИБКА СЕРВЕРА:', errorText);
        addLog(`❌ Ошибка токена: ${errorText.slice(0, 100)}...`);
        
        const invalidData = { 
          ...safeData, 
          status: 'error' as const, 
          progress: 0,
          isTokenValid: false 
        };
        console.log('💾 7. Сохраняю НЕВАЛИДНЫЙ токен');
        onSave(invalidData);
        console.log('❌ === TEST TOKEN НЕВАЛИДЕН ===');
        return false;
      }
    } catch (error: any) {
      console.error('💥 6. СЕТЕВАЯ ОШИБКА:', error);
      addLog(`💥 Ошибка сети: ${error.message}`);
      const invalidData = { ...safeData, status: 'error' as const, isTokenValid: false };
      onSave(invalidData);
      console.log('💥 === TEST TOKEN СЕТЬ ОШИБКА ===');
      return false;
    }
  };

  const scanFolder = async () => {
    console.log('🔍 === SCAN FOLDER НАЧАЛО ===');
    
    if (!folderPath.trim()) {
      console.log('❌ folderPath пустой');
      addLog('❌ Укажите путь к папке');
      return;
    }
    if (!safeData.isTokenValid) {
      console.log('❌ Токен не авторизован');
      addLog('❌ Сначала авторизуйте токен');
      return;
    }

    setIsProcessing(true);
    const scanTypeLabel = activeScanType === 'programs' ? 'Программы' : 
                         activeScanType === 'trainers' ? 'Тренеров' : 'Слайдеры';
    
    console.log('🔍 Сканирую:', scanTypeLabel, folderPath);
    addLog(`🔍 Сканирую ${scanTypeLabel} в "${folderPath}"`);
    
    const scanData = { ...safeData, status: 'scanning' as const, progress: 10, scanResult: null };
    onSave(scanData);

    try {
      console.log('🌐 Отправляю POST /api/autoupload');
      const response = await fetch('/api/autoupload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          folderPath, 
          oauthToken: safeData.oauthToken, 
          scanType: activeScanType 
        }),
      });

      console.log('📡 API ответ:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API ОШИБКА:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ API УСПЕХ:', result);
      
      if (result.success) {
        addLog(`✅ ${result[`${activeScanType}Found`]||0} ${scanTypeLabel.toLowerCase()} найдено`);
        const finalData = { 
          ...safeData, 
          status: 'success' as const, 
          progress: 100, 
          scanResult: result 
        };
        onSave(finalData);
      } else {
        throw new Error(result.error || 'Неизвестная ошибка API');
      }
    } catch (error: any) {
      console.error('💥 SCAN ОШИБКА:', error);
      addLog(`❌ ${error.message}`);
      const errorData = { ...safeData, status: 'error' as const, progress: 0 };
      onSave(errorData);
    } finally {
      setIsProcessing(false);
      console.log('🏁 === SCAN FOLDER КОНЕЦ ===');
    }
  };

  console.log('🎨 JSX РЕНДЕР. Статус:', safeData.status, 'Токен:', !!oauthToken, 'Валиден:', safeData.isTokenValid);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Автозагрузка контента</h3>
        <p>📄 Программы • 👨‍🏫 Тренера • 🖼️ Слайдеры (Яндекс.Диск API)</p>
      </div>

      {/* === ОAUTH ТОКЕН === */}
      <div className={styles.field}>
        <label>OAuth токен Яндекс.Диск <span className={styles.required}>*</span></label>
        <input
          type="password"
          value={oauthToken}
          onChange={(e) => {
            console.log('✏️ Токен изменен:', e.target.value ? e.target.value.slice(0, 10) + '...' : 'пустой');
            setOauthToken(e.target.value);
          }}
          placeholder="y0_Agxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          className={`${styles.input} ${safeData.isTokenValid ? styles.valid : safeData.status === 'error' ? styles.invalid : ''}`}
        />
        <small>
          <strong>Получить:</strong> oauth.yandex.ru → Создать приложение → Яндекс.Диск REST API → <br/>
          https://oauth.yandex.ru/authorize?response_type=token&client_id=YOUR_ID
        </small>
        
        <button
          onClick={() => {
            console.log('🔘 === КНОПКА "ПРОВЕРИТЬ ТОКЕН" КЛИК! ===');
            testToken();
          }}
          disabled={!oauthToken.trim() || safeData.status === 'auth'}
          className={`${styles.authBtn} ${safeData.isTokenValid ? styles.success : ''}`}
        >
          {safeData.status === 'auth' ? '🔄 Проверяю...' : 
           safeData.isTokenValid ? '✅ Токен OK' : '🔑 Проверить токен'}
        </button>
      </div>

      {/* === СКАНИРОВАНИЕ (только после авторизации) === */}
      {safeData.isTokenValid && (
        <>
          <div className={styles.field}>
            <label>Путь к папке <span className={styles.required}>*</span></label>
            <input
              value={folderPath}
              onChange={(e) => {
                console.log('📁 Путь изменен:', e.target.value);
                setFolderPath(e.target.value);
              }}
              placeholder="/форматированные Данные для сайта"
              className={styles.input}
              disabled={isProcessing}
            />
            <small>Путь от корня диска. Будет найдена подпапка "программы"/"тренера"/"слайдеры"</small>
          </div>

          <div className={styles.scanTypeSection}>
            <button 
              className={`${styles.scanTypeBtn} ${activeScanType === 'programs' ? styles.active : ''}`}
              onClick={() => {
                console.log('🔘 Переключение на Программы');
                setActiveScanType('programs');
              }}
              disabled={isProcessing}
            >
              📄 Программы
            </button>
            <button 
              className={`${styles.scanTypeBtn} ${activeScanType === 'trainers' ? styles.active : ''}`}
              onClick={() => {
                console.log('🔘 Переключение на Тренеров');
                setActiveScanType('trainers');
              }}
              disabled={isProcessing}
            >
              👨‍🏫 Тренера
            </button>
            <button 
              className={`${styles.scanTypeBtn} ${activeScanType === 'sliders' ? styles.active : ''}`}
              onClick={() => {
                console.log('🔘 Переключение на Слайдеры');
                setActiveScanType('sliders');
              }}
              disabled={isProcessing}
            >
              🖼️ Слайдеры
            </button>
          </div>

          <button
            onClick={scanFolder}
            disabled={!folderPath.trim() || isProcessing}
            className={`${styles.scanBtn} ${isProcessing ? styles.processing : ''}`}
          >
            {isProcessing 
              ? `🔍 Сканирую ${activeScanType.toUpperCase()}...` 
              : `🔍 Сканировать ${activeScanType}`
            }
          </button>
        </>
      )}

      {/* === ПРОГРЕСС === */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${safeData.progress}%` }} />
        </div>
        <span>{Math.round(safeData.progress)}%</span>
      </div>

      {/* === РЕЗУЛЬТАТЫ === */}
      {safeData.scanResult && (
        <div className={styles.resultsSection}>
          <h4>✅ Результат сканирования:</h4>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{safeData.scanResult.programsFound || 0}</div>
              <div className={styles.statLabel}>Программы</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{safeData.scanResult.trainersFound || 0}</div>
              <div className={styles.statLabel}>Тренера</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{safeData.scanResult.slidersFound || 0}</div>
              <div className={styles.statLabel}>Слайдеры</div>
            </div>
          </div>
          <div className={styles.targetFolder}>
            📁 Папка: <strong>{safeData.scanResult.targetFolder}</strong> 
            ({safeData.scanResult.totalSubfolders || 0} подпапок)
          </div>
        </div>
      )}

      {/* === ЖУРНАЛ === */}
      <div className={styles.logSection}>
        <h4>Журнал ({safeData.log.length})</h4>
        <div className={styles.log}>
          {safeData.log.map((entry, index) => (
            <div key={index} className={styles.logEntry}>{entry}</div>
          ))}
        </div>
      </div>

      {/* === СТАТУС === */}
      <div className={styles.status}>
        <span className={`${styles.statusBadge} ${styles[safeData.status]}`}>
          {safeData.status === 'idle' ? 'Готов' : 
           safeData.status === 'auth' ? 'Авторизация' : 
           safeData.status === 'scanning' ? 'Сканирую' : 
           safeData.status === 'success' ? 'Готово' : 'Ошибка'}
        </span>
      </div>
    </div>
  );
}
