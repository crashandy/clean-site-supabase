import React,{useEffect,useState} from 'react';
import {supabase} from '../supabaseClient';
type Log={id:number;date:string;name:string;area:string[];exception_note:string;incomplete_reason:string;photos:string[]};
export default function AdminPage(){
  const [logs,setLogs]=useState<Log[]>([]);
  useEffect(()=>{supabase.from('clean_logs').select('*').then(({data})=>setLogs(data||[]));},[]);
  const del=async(id:number)=>{await supabase.from('clean_logs').delete().eq('id',id);setLogs(logs.filter(l=>l.id!==id));};
  return <div className="space-y-4">{logs.map(log=>
    <div key={log.id} className="border p-4 rounded">
      <div className="text-sm text-gray-500">{log.date} 由 {log.name} 填寫</div>
      <div>區域: {log.area.join(', ')}</div>
      {log.exception_note && <div>異常: {log.exception_note}</div>}
      {log.incomplete_reason && <div>原因: {log.incomplete_reason}</div>}
      {log.photos.map((p,i)=><img key={i}
        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${p}`}
        alt="photo" className="mt-2 max-h-40"/>)}
      <button onClick={()=>del(log.id)} className="mt-2 bg-red-600 text-white p-1 rounded">刪除</button>
    </div>)}
  </div>;
}