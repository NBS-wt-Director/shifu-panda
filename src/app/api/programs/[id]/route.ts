import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const data = getDb();
    const programs = data.programs || [];
    
    // ✅ ИСПРАВЛЕНИЕ 1: Number(id) вместо id
    const program = programs.find((p: any) => p.id === Number(id));
    
    console.log('🔍 Поиск программы:', id, 'Программы:', programs.map(p => ({id: p.id, name: p.name})));
    
    if (!program) {
      console.warn(`⚠️ Программа ${id} не найдена, возвращаем демо`);
      
      return NextResponse.json({
        id: id,
        isDemo: true,
        name: `Программа ${id}`,
        description: "Данные не заполнены. Скоро здесь появится реальная программа тренировок. Заполните в админке!",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        gallery: null,
        trainers: null,
        workouts: null
      });
    }

    // ✅ ИСПРАВЛЕНИЕ 2: Добавляем логирование найденной программы
    console.log('✅ Найдена программа:', program.name);
    
    return NextResponse.json(program);
  } catch (error) {
    console.error('API программа error:', error);
    return NextResponse.json({
      id: 'unknown',
      isDemo: true,
      name: 'Ошибка загрузки',
      description: "Ошибка сервера. Используется демо-режим.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      gallery: null,
      trainers: null,
      workouts: null
    }, { status: 500 });
  }
}
