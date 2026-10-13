'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function Admin(){
  const [ok,setOk]=useState(false);const [em,setEm]=useState('');const [pw,setPw]=useState('');const [err,setErr]=useState('');
  const [g,setG]=useState<any[]>([]);const [r,setR]=useState<any[]>([]);const [v,setV]=useState(0);const [on,setOn]=useState(0);
  const load=async()=>{const a=await supabase.from('greetings').select('*').order('created_at',{ascending:false}).limit(200);const b=await supabase.from('rsvps').select('*').order('created_at',{ascending:false});
    const c=await supabase.from('visits').select('*',{count:'exact',head:true});setG(a.data||[]);setR(b.data||[]);setV(c.count||0)};
  useEffect(()=>{supabase.auth.getSession().then(({data})=>{if(data.session)setOk(true)})},[]);
  useEffect(()=>{if(!ok)return;load();const ch=supabase.channel('admin-db').on('postgres_changes',{event:'*',schema:'public'},load).subscribe();
    const p=supabase.channel('vowverse').on('presence',{event:'sync'},()=>setOn(Object.keys(p.presenceState()).length)).subscribe();
    return()=>{supabase.removeChannel(ch);supabase.removeChannel(p)}},[ok]);
  const login=async()=>{const{error}=await supabase.auth.signInWithPassword({email:em,password:pw});error?setErr(error.message):setOk(true)};
  const hide=async(id:number,h:boolean)=>{await supabase.from('greetings').update({hidden:h}).eq('id',id)};
  if(!ok)return(<div className="fixed inset-0 flex items-center justify-center"><div className="panel p-5 w-80"><h1 className="px text-xs mb-3">ADMIN</h1><input className="inp mb-2" placeholder="Email" value={em} onChange={e=>setEm(e.target.value)}/><input className="inp mb-2" type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)}/><button className="btn w-full" onClick={login}>Masuk</button><p className="text-xs text-red-700">{err}</p></div></div>);
  return(<div className="scroll p-4" style={{position:'fixed',inset:0,touchAction:'pan-y'}}><div className="panel p-4 max-w-3xl mx-auto"><h1 className="px text-sm mb-3">DASHBOARD PENGANTIN</h1>
    <p>Kunjungan: <b>{v}</b> · Online: <b>{on}</b> · RSVP: <b>{r.length}</b> (hadir {r.filter(x=>x.attendance==='hadir').reduce((a,x)=>a+x.guests,0)} orang)</p>
    <h2 className="px text-xs my-3">RSVP</h2>{r.map(x=><div key={x.id} className="text-sm border-b py-1">{x.name} — {x.attendance} ({x.guests}) {x.message}</div>)}
    <h2 className="px text-xs my-3">BUKU TAMU</h2>{g.map(x=><div key={x.id} className="text-sm border-b py-1 flex gap-2" style={{opacity:x.hidden?.4:1}}><span className="flex-1"><b>{x.name}</b>: {x.message}</span><button className="btn py-0" onClick={()=>hide(x.id,!x.hidden)}>{x.hidden?'Tampilkan':'Sembunyikan'}</button></div>)}
    <button className="btn mt-4" onClick={()=>supabase.auth.signOut().then(()=>setOk(false))}>Keluar</button></div></div>);
}
