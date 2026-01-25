// Utilitaire localStorage côté serveur (Node.js)
// Stocke les données dans un fichier JSON par modèle, fallback possible
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'app/_data'); // Adjusted path to be more reliable in Next.js
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function getFilePath(model: string) {
  return path.join(DATA_DIR, `${model}.json`);
}

function readData(model: string) {
  const file = getFilePath(model);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function writeData(model: string, data: any[]) {
  const file = getFilePath(model);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const localStorageUtil = (model: string) => ({
  getAll: async () => readData(model),
  getById: async (id: string | number) => readData(model).find((item: any) => item.id == id),
  create: async (obj: any) => {
    const data = readData(model);
    const id = Date.now().toString();
    const item = { ...obj, id };
    data.push(item);
    writeData(model, data);
    return item;
  },
  update: async (id: string | number, newObj: any) => {
    const data = readData(model);
    const idx = data.findIndex((item: any) => item.id == id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...newObj };
    writeData(model, data);
    return data[idx];
  },
  remove: async (id: string | number) => {
    const data = readData(model);
    const idx = data.findIndex((item: any) => item.id == id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    writeData(model, data);
    return true;
  },
});

export default localStorageUtil;
