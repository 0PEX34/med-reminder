import { openDB } from 'idb';
export const getDB = () => openDB('pill-db', 1, {
  upgrade(db) {
    ['medicines', 'appointments', 'tasks', 'logs'].forEach(s => {
      if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
    });
  }
});
export const getAll = async (store: string) => (await getDB()).getAll(store);
export const putItem = async (store: string, val: any) => (await getDB()).put(store, val);
