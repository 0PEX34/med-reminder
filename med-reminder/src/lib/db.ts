// Чистый IndexedDB без сторонних библиотек

export interface Medication {
  id?: number;
  name: string;
  purpose: string;
  description?: string;
  dosage: string;
  timesPerDay: number;
  mealRelation: 'before' | 'after' | 'with' | 'bedtime' | 'any';
  courseDurationDays: number;
  prescribedBy: string;
  clinic: string;
  intervalValue?: number;
  intervalUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  soundType?: 'default' | 'chime' | 'alarm' | 'custom';
  customSoundData?: string;
  startDate: string;
}

export interface DoctorVisit {
  id?: number;
  doctorName: string;
  specialty?: string;
  dateTime: string;
  scheduleType: '5/2' | 'even_odd' | '2/2' | '3/3' | 'custom';
  office: string;
  phone: string;
}

export interface NurseTask {
  id?: number;
  patientName: string;
  roomNumber: string;
  taskType: 'pill' | 'iv' | 'feed' | 'custom';
  customTaskTitle?: string;
  scheduledTime: string;
  isCompleted: boolean;
}

export interface IntakeLog {
  id?: number;
  medicationId: number;
  medicationName: string;
  timestamp: string;
  status: 'taken' | 'snoozed' | 'skipped';
}

const DB_NAME = 'PillReminderDB';
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB доступен только в браузере'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      const stores = ['medications', 'doctorVisits', 'nurseTasks', 'intakeLogs'];
      stores.forEach((store) => {
        if (!database.objectStoreNames.contains(store)) {
          database.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Функции getAll и putItem для src/app/page.tsx
export async function getAll<T = any>(storeName: string): Promise<T[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function putItem<T = any>(storeName: string, item: T): Promise<number> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

function createTableWrapper<T>(storeName: string) {
  return {
    toArray: () => getAll<T>(storeName),
    add: (item: T) => putItem<T>(storeName, item),
    async update(id: number, changes: Partial<T>): Promise<void> {
      const database = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = database.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const getReq = store.get(id);

        getReq.onsuccess = () => {
          const current = getReq.result;
          if (!current) return resolve();
          const putReq = store.put({ ...current, ...changes });
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        };
        getReq.onerror = () => reject(getReq.error);
      });
    },
    reverse() {
      return {
        sortBy: async (_field: string): Promise<T[]> => {
          const list = await getAll<T>(storeName);
          return list.reverse();
        }
      };
    }
  };
}

export const db = {
  medications: createTableWrapper<Medication>('medications'),
  doctorVisits: createTableWrapper<DoctorVisit>('doctorVisits'),
  nurseTasks: createTableWrapper<NurseTask>('nurseTasks'),
  intakeLogs: createTableWrapper<IntakeLog>('intakeLogs')
};
