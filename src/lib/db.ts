import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

// ✅ getDb = loadDb (алиас для совместимости)
export const getDb = (): any => {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }
  } catch {}
  return { sliders: [], trainers: [], news: [], contacts: {} };
};

// ✅ loadDb (новое имя)
export const loadDb = getDb;

// ✅ saveDb
export const saveDb = (data: any): boolean => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch {
    return false;
  }
};