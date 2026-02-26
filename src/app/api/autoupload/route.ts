import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('='.repeat(80));
  console.log('🔥 AUTOUPLD API v2: POST /api/autoupload');
  console.log('⏰ Время:', new Date().toLocaleString('ru-RU'));
  console.log('='.repeat(80));
  
  try {
    // 0. Чтение полного body
    console.log('📥 Шаг 0: Чтение request.body...');
    const rawBody = await request.text();
    console.log('📄 RAW BODY:', rawBody);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('💥 JSON PARSE ERROR:', parseError);
      throw new Error(`Невалидный JSON: ${parseError.message}`);
    }
    
    const { folderPath, oauthToken, scanType } = body;
    console.log('📋 PARSED BODY:', {
      folderPath,
      scanType,
      hasToken: !!oauthToken,
      tokenPreview: oauthToken ? oauthToken.slice(0, 20) + '...' : 'нет'
    });

    // 1. Валидация входных данных
    console.log('\n🔍 Шаг 1: Валидация параметров');
    if (!folderPath?.trim()) {
      console.error('❌ folderPath пустой');
      return NextResponse.json({ success: false, error: 'folderPath обязателен' }, { status: 400 });
    }
    if (!oauthToken?.trim()) {
      console.error('❌ oauthToken пустой');
      return NextResponse.json({ success: false, error: 'oauthToken обязателен' }, { status: 400 });
    }
    if (!['programs', 'trainers', 'sliders'].includes(scanType)) {
      console.error('❌ Неверный scanType:', scanType);
      return NextResponse.json({ success: false, error: 'scanType: programs/trainers/sliders' }, { status: 400 });
    }

    const headers = {
      'Authorization': `OAuth ${oauthToken}`,
      'Accept': 'application/json',
      'User-Agent': 'CFR-Admin/1.0'
    };
    console.log('🔑 HEADERS готов:', { hasAuth: !!headers.Authorization });

    // 2. Поиск целевой папки
    console.log('\n📂 Шаг 2: Поиск целевой папки в', folderPath);
    const folderMappings: Record<string, string> = {
      programs: 'программы',
      trainers: 'тренера|тренер',
      sliders: 'слайдер|баннер|главная|banner'
    };
    const targetPattern = folderMappings[scanType as keyof typeof folderMappings];
    console.log('🎯 Ищем по паттерну:', targetPattern);

    const searchUrl = `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(folderPath)}&fields=_embedded.items(name,type,path)&limit=1000`;
    console.log('🌐 SEARCH URL:', searchUrl);

    console.log('📡 Отправка SEARCH запроса...');
    const searchResponse = await fetch(searchUrl, { headers });
    console.log('📡 SEARCH статус:', searchResponse.status, searchResponse.statusText);

    let searchData;
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('💥 SEARCH ERROR TEXT:', errorText);
      console.error('💥 SEARCH HEADERS:', Object.fromEntries(searchResponse.headers.entries()));
      throw new Error(`SEARCH ${searchResponse.status}: ${errorText}`);
    }

    searchData = await searchResponse.json();
    console.log('✅ SEARCH OK. Items:', searchData._embedded?.items?.length || 0);
    console.log('📋 ДОСТУПНЫЕ ПАПКИ:');
    searchData._embedded?.items?.forEach((item: any, i: number) => {
      if (i < 10) console.log(`  ${i+1}. ${item.name} (${item.type})`);
    });

    const items = searchData._embedded?.items || [];
    const targetFolder = items.find((item: any) =>
      item.type === 'dir' && 
      item.name.toLowerCase().includes(targetPattern.toLowerCase())
    );

    if (!targetFolder) {
      console.error('❌ ЦЕЛЕВАЯ ПАПКА НЕ НАЙДЕНА!');
      console.log('🔍 Проверяю все папки по паттерну:', targetPattern);
      const matches = items.filter((item: any) => 
        item.type === 'dir' && item.name.toLowerCase().includes(targetPattern.toLowerCase())
      );
      console.log('📊 Совпадений по паттерну:', matches.length);
      throw new Error(`Папка "${targetPattern}" не найдена. Доступно: ${items.map((i: any) => i.name).slice(0, 5).join(', ')}`);
    }

    console.log('🎉 НАЙДЕНА ЦЕЛЬ:', targetFolder.name, targetFolder.path);

    // 3. Сканирование подпапок цели
    console.log('\n📁 Шаг 3: Сканирование подпапок', targetFolder.name);
    const targetUrl = `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(targetFolder.path)}&fields=_embedded.items(name,type,path)&limit=1000`;
    console.log('🌐 TARGET URL:', targetUrl);

    const targetResponse = await fetch(targetUrl, { headers });
    console.log('📡 TARGET статус:', targetResponse.status);

    if (!targetResponse.ok) {
      const errorText = await targetResponse.text();
      console.error('💥 TARGET ERROR:', errorText);
      throw new Error(`TARGET ${targetResponse.status}: ${errorText}`);
    }

    const targetData = await targetResponse.json();
    const subfolders = targetData._embedded?.items?.filter((item: any) => item.type === 'dir') || [];
    console.log('📁 Подпапок найдено:', subfolders.length);
    console.log('📋 ПЕРВЫЕ 5:', subfolders.slice(0, 5).map((f: any) => f.name));

    // 4. Валидация содержимого (параллельно, макс 30 для скорости)
    console.log('\n🔍 Шаг 4: Валидация содержимого (параллельно)');
    const maxScan = Math.min(30, subfolders.length);
    console.log('⚡ Сканирую', maxScan, 'из', subfolders.length, 'подпапок');

    const scanPromises = subfolders.slice(0, maxScan).map(async (folder: any, index: number) => {
      console.log(`  🔍 [${index+1}/${maxScan}] ${folder.name}...`);
      
      try {
        const folderUrl = `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(folder.path)}&fields=_embedded.items(name,type,extension,size)&limit=50`;
        const folderResponse = await fetch(folderUrl, { headers });
        
        if (!folderResponse.ok) {
          console.log(`    ❌ ${folder.name}: ${folderResponse.status}`);
          return { valid: false, name: folder.name };
        }

        const folderData = await folderResponse.json();
        const files = folderData._embedded?.items || [];
        
        const docxCount = files.filter((f: any) => f.extension?.toLowerCase() === 'docx').length;
        const imageCount = files.filter((f: any) => ['jpg','jpeg','png'].includes(f.extension?.toLowerCase() || '')).length;
        const docCount = files.filter((f: any) => ['doc','pdf'].includes(f.extension?.toLowerCase() || '')).length;
        const totalFiles = files.length;

        console.log(`    📊 ${folder.name}: ${totalFiles} файлов (docx:${docxCount}, img:${imageCount}, doc:${docCount})`);

        let isValid = false;
        switch (scanType) {
          case 'programs':
            isValid = docxCount >= 1 && imageCount >= 1;
            break;
          case 'trainers':
            isValid = imageCount >= 1 && (docxCount + docCount) >= 1;
            break;
          case 'sliders':
            isValid = imageCount >= 3;
            break;
        }

        console.log(`    ${isValid ? '✅' : '❌'} ${folder.name}: ${isValid ? 'ВАЛИДНА' : 'пропуск'}`);
        return { valid: isValid, name: folder.name };
      } catch (folderError: any) {
        console.log(`    💥 ${folder.name}: ${folderError.message}`);
        return { valid: false, name: folder.name };
      }
    });

    console.log('⚡ Запуск параллельного сканирования...');
    const results = await Promise.allSettled(scanPromises);
    
    const validCount = results.filter((r): r is PromiseFulfilledResult<any> => 
      r.status === 'fulfilled' && r.value.valid
    ).length;

    console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:');
    console.log(`✅ Валидных ${scanType}: ${validCount}/${maxScan}`);
    console.log(`📁 Всего подпапок: ${subfolders.length}`);
    console.log('='.repeat(80));

    // 5. Финальный ответ
    const result = {
      success: true,
      folderPath,
      scanType,
      targetFolder: targetFolder.name,
      totalSubfolders: subfolders.length,
      scannedFolders: maxScan,
      [`${scanType}Found`]: validCount,
      programsFound: scanType === 'programs' ? validCount : 0,
      trainersFound: scanType === 'trainers' ? validCount : 0,
      slidersFound: scanType === 'sliders' ? validCount : 0,
      log: [
        `📁 "${targetFolder.name}": ${subfolders.length} подпапок`,
        `✅ Валидных ${scanType}: ${validCount}/${maxScan}`,
        `⚡ Просканировано: ${maxScan}`
      ]
    };

    console.log('🎉 УСПЕШНЫЙ ОТВЕТ:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('💥' + '💥'.repeat(20));
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА API:');
    console.error('💥 Сообщение:', error.message);
    console.error('💥 Stack:', error.stack);
    console.error('💥' + '💥'.repeat(20));
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
