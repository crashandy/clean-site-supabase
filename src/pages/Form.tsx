import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function FormPage() {
  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0];
  const defaultTime = today.toTimeString().slice(0,5); // "HH:MM"

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [checker, setChecker] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [abnormal, setAbnormal] = useState('');
  const [reason, setReason] = useState('');
  const [photos, setPhotos] = useState<FileList | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let photoUrls: string[] = [];
    if (photos?.length) {
      const file = photos[0],
            fileName = `photos/${Date.now()}_${checker}.jpg`;
      const { data, error: uploadError } = await supabase.storage
        .from('clean-photos')
        .upload(fileName, file);
      if (uploadError) console.error(uploadError);
      else if (data?.path) photoUrls = [data.path];
    }
    const { error } = await supabase
      .from('clean_logs')
      .insert([{
        date,
        time,                         // 新增 time 欄位
        name: checker,
        area: areas,
        exception_note: abnormal,
        incomplete_reason: reason,
        photos: photoUrls,
      }]);
    if (error) {
      console.error(error);
      alert('提交失敗');
    } else {
      alert('提交成功');
      setDate(defaultDate);
      setTime(defaultTime);
      setChecker('');
      setAreas([]);
      setAbnormal('');
      setReason('');
      setPhotos(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4">
      {/* 日期 + 時間 */}
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span>日期</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </label>
        <label className="block">
          <span>時間</span>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </label>
      </div>

      {/* 檢查人員 */}
      <label className="block">
        <span>檢查人員</span>
        <input
          type="text"
          value={checker}
          onChange={e => setChecker(e.target.value)}
          className="mt-1 block w-full border p-2 rounded"
          placeholder="姓名"
          required
        />
      </label>

      {/* 清潔區域 */}
      <fieldset>
        <legend className="font-medium">清潔區域</legend>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {areaList.map(a => (
            <label key={a} className="inline-flex items-center">
              <input
                type="checkbox"
                value={a}
                checked={areas.includes(a)}
                onChange={e => {
                  const v = e.target.value;
                  setAreas(areas.includes(v)
                    ? areas.filter(x => x !== v)
                    : [...areas, v]);
                }}
                className="mr-2"
              />
              {a}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 異常 & 未完成原因 */}
      <label className="block">
        <span>異常備註</span>
        <textarea
          value={abnormal}
          onChange={e => setAbnormal(e.target.value)}
          className="mt-1 block w-full border p-2 rounded"
          rows={3}
          placeholder="如：垃圾桶未倒"
        />
      </label>
      <label className="block">
        <span>未完成原因</span>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="mt-1 block w-full border p-2 rounded"
          rows={2}
          placeholder="如：商品暫缺"
        />
      </label>

      {/* 照片上傳 */}
      <label className="block">
        <span>上傳照片（最多1張）</span>
        <input
          type="file"
          accept="image/*"
          onChange={e => setPhotos(e.target.files)}
          className="mt-1 block"
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        提交
      </button>
    </form>
  );
}
