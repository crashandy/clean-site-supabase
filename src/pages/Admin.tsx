import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Log = {
  id: number;
  date: string;
  time: string;           // 新增時間欄位
  name: string;
  area: string[];
  exception_note: string;
  incomplete_reason: string;
  photos: string[];
};

export default function AdminPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const areaList = [
    '外場-室內客人區域',
    '外場-室外客人區域',
    '外場-水冷扇補水',
    '外場-收銀機檯面',
    '外場-餐具自助區',
    '外場-冰箱擺放',
    '內場-廚房區域',
    '內場-洗碗機水槽',
    '內場-食材包鮮',
    '工具-清洗',
  ];

  useEffect(() => {
    supabase
      .from('clean_logs')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => setLogs(data || []));
  }, []);

  const handleDelete = async (id: number) => {
    await supabase.from('clean_logs').delete().eq('id', id);
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto p-4">
      {logs.map(log => {
        const unchecked = areaList.filter(a => !log.area.includes(a));
        return (
          <div key={log.id} className="border p-4 rounded">
            <div className="text-sm text-gray-500 mb-2">
              {log.date} {log.time} 由 {log.name} 填寫
            </div>
            <div className="mb-1"><strong>已勾選區域：</strong> {log.area.join(', ')}</div>
            {unchecked.length > 0 && (
              <div className="mb-1 text-red-600">
                <strong>未勾選區域：</strong> {unchecked.join(', ')}
              </div>
            )}
            {log.exception_note && <div className="mb-1"><strong>異常：</strong> {log.exception_note}</div>}
            {log.incomplete_reason && <div className="mb-1"><strong>原因：</strong> {log.incomplete_reason}</div>}
            <div className="flex flex-wrap gap-2 mb-2">
              {log.photos.map((p, i) => (
                <img
                  key={i}
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${p}`}
                  alt="photo"
                  className="h-24 rounded"
                />
              ))}
            </div>
            <button
              onClick={() => handleDelete(log.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              刪除
            </button>
          </div>
        );
      })}
    </div>
  );
}
