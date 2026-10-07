'use client';
import React, { useState, useEffect } from 'react';
import { getAll, putItem } from '../lib/db';

export default function Home() {
  const [tab, setTab] = useState<'meds' | 'doc' | 'nurse' | 'logs'>('meds');
  const [meds, setMeds] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
    refresh();
  }, []);

  const refresh = async () => {
    setMeds(await getAll('medicines'));
    setLogs(await getAll('logs'));
  };

  const addMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await putItem('medicines', { id: crypto.randomUUID(), name, dosage });
    setName(''); setDosage('');
    refresh();
  };

  const markTaken = async (medName: string) => {
    await putItem('logs', { id: crypto.randomUUID(), medicineName: medName, timestamp: new Date().toLocaleString('ru-RU') });
    refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-sky-700 text-white p-4 font-bold">Напомни выпить таблетку</header>
      <main className="p-4 max-w-xl mx-auto space-y-4">
        {tab === 'meds' && (
          <div>
            <form onSubmit={addMed} className="bg-white p-4 rounded-xl border mb-4 space-y-2">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Название" className="w-full border p-2 rounded" required />
              <input value={dosage} onChange={e=>setDosage(e.target.value)} placeholder="Дозировка" className="w-full border p-2 rounded" />
              <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded">Сохранить</button>
            </form>
            <div className="space-y-2">
              {meds.map(m => (
                <div key={m.id} className="bg-white p-3 border rounded-xl flex justify-between items-center">
                  <div><b>{m.name}</b> <span className="text-xs text-slate-500">({m.dosage})</span></div>
                  <button onClick={() => markTaken(m.name)} className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded">Выпил</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'logs' && (
          <div className="space-y-2">
            {logs.map(l => (
              <div key={l.id} className="bg-white p-3 border rounded text-sm flex justify-between">
                <span>{l.medicineName}</span>
                <span className="text-xs text-slate-500">{l.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 text-xs">
        <button onClick={()=>setTab('meds')} className={tab === 'meds' ? 'font-bold text-sky-600' : ''}>Лекарства</button>
        <button onClick={()=>setTab('logs')} className={tab === 'logs' ? 'font-bold text-sky-600' : ''}>Журнал</button>
      </nav>
    </div>
  );
}
