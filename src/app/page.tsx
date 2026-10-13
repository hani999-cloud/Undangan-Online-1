'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { W } from '@/lib/config';
const Game=dynamic(()=>import('@/components/Game'),{ssr:false});
const NAV=[['pasangan','Pasangan','💍'],['acara','Acara','📜'],['galeri','Galeri','🖼️'],['ucapan','Ucapan & RSVP','💌'],['hadiah','Hadiah','🎁'],['photobox','Photobox','📷']];
const SKINS=['Pria · Peci','Wanita · Hijab sage','Pria · Navy','Wanita · Mauve','Pria · Taupe','Wanita · Rose'];
export default function Home(){
  const [step,setStep]=useState<'cover'|'name'|'play'>('cover');const [name,setName]=useState('');const [skin,setSkin]=useState(0);
  const [sid,setSid]=useState('');const [panel,setPanel]=useState<string|null>(null);const [near,setNear]=useState<string|null>(null);
  const [peers,setPeers]=useState<any[]>([]);const [status,setStatus]=useState('');const [chat,setChat]=useState<any[]>([]);const [hello,setHello]=useState(false);
  const [music,setMusic]=useState(false);const audio=useRef<HTMLAudioElement|null>(null);const nearRef=useRef<string|null>(null);
  useEffect(()=>{setSid(sessionStorage.vvsid||(sessionStorage.vvsid=crypto.randomUUID()));},[]);
  useEffect(()=>{const f=(n:string,h:any)=>{window.addEventListener(n,h);return()=>window.removeEventListener(n,h)};
    const a=f('vv:near',(e:any)=>{setNear(e.detail);nearRef.current=e.detail}),b=f('vv:peers',(e:any)=>setPeers(e.detail)),c=f('vv:status',(e:any)=>setStatus(e.detail)),
    d=f('vv:open',()=>nearRef.current&&setPanel(nearRef.current)),g=f('vv:chat',(e:any)=>setChat(p=>[e.detail,...p].slice(0,50)));return()=>{a();b();c();d();g()}},[]);
  const enter=async()=>{if(!name.trim())return;setStep('play');await supabase.from('visits').insert({session_id:sid,name:name.trim().slice(0,40)})};
  const toggleMusic=()=>{if(!audio.current){audio.current=new Audio(W.music);audio.current.loop=true}music?audio.current.pause():audio.current.play().catch(()=>{});setMusic(!music)};
  const joy=(e:React.PointerEvent)=>{const r=(e.currentTarget as HTMLElement).getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/(r.width/2),y=(e.clientY-r.top-r.height/2)/(r.height/2);const m=Math.hypot(x,y);if(m>1){x/=m;y/=m}(window as any).vvJoy=m<.15?{x:0,y:0}:{x,y}};
  const stop=()=>{(window as any).vvJoy={x:0,y:0}};

  if(step!=='play')return(<main className="fixed inset-0 flex items-center justify-center p-4" style={{background:'radial-gradient(#344c3d,#1d2a21)'}}>
    <div className="panel p-6 w-full max-w-sm text-center">
      <p className="px text-[10px]" style={{color:'var(--gold)'}}>UNDANGAN PERNIKAHAN</p>
      <h1 className="px text-xl my-4 leading-8">{W.groom}<br/>&amp;<br/>{W.bride}</h1><p className="px text-[9px] mb-5">{W.dateLabel}</p>
      {step==='cover'?<button className="btn w-full px text-xs" onClick={()=>setStep('name')}>BUKA UNDANGAN</button>:<>
        <input className="inp mb-3" placeholder="Nama Anda" maxLength={40} value={name} onChange={e=>setName(e.target.value)}/>
        <div className="grid grid-cols-2 gap-2 mb-4">{SKINS.map((s,i)=><button key={i} onClick={()=>setSkin(i)} className="text-xs p-2 rounded-lg" style={{border:'2px solid '+(skin===i?'var(--gold)':'var(--taupe)'),background:skin===i?'#f4e3b8':'#fff'}}>{s}</button>)}</div>
        <button className="btn w-full px text-xs" disabled={!name.trim()} onClick={enter}>MULAI JELAJAHI</button></>}
    </div></main>);

  return(<main className="fixed inset-0 overflow-hidden" style={{paddingTop:'env(safe-area-inset-top)'}}>
    <Game sid={sid} name={name.trim()} skin={skin}/>
    <div className="absolute top-0 inset-x-0 p-2 flex gap-2 items-center" style={{paddingTop:'calc(env(safe-area-inset-top) + 8px)'}}>
      <div className="panel px-3 py-2 flex-1 flex items-center gap-2 px text-[9px]"><span>{W.groom[0]}&amp;{W.bride[0]}</span><span style={{color:status==='SUBSCRIBED'?'#2e8b57':'#c0392b'}}>●</span><button onClick={()=>setHello(h=>!h)}>👥 {peers.length} online</button></div>
      <button className="panel px-3 py-2 text-lg" onClick={toggleMusic}>{music?'🎵':'🔇'}</button></div>
    {hello&&<div className="panel absolute top-16 left-2 p-3 text-sm max-h-48 scroll">{peers.map(p=><div key={p.id}>{p.name}{p.id===sid?' (Anda)':''}</div>)}</div>}
    <button className="btn absolute left-1/2 -translate-x-1/2 px text-[10px]" style={{bottom:'calc(env(safe-area-inset-bottom) + 96px)'}} onClick={()=>setPanel('sapa')}>💬 SAPA TAMU</button>
    <div onPointerDown={joy} onPointerMove={e=>e.buttons&&joy(e)} onPointerUp={stop} onPointerLeave={stop} className="absolute rounded-full md:hidden" style={{left:16,bottom:'calc(env(safe-area-inset-bottom) + 150px)',width:110,height:110,background:'#000a',border:'4px solid var(--gold)',touchAction:'none'}}><div className="absolute inset-0 m-auto w-10 h-10 rounded-full" style={{background:'var(--gold)'}}/></div>
    <button className="absolute rounded-full px md:hidden" style={{right:20,bottom:'calc(env(safe-area-inset-bottom) + 160px)',width:74,height:74,background:near?'var(--rose)':'#8886',border:'4px solid var(--gold)',color:'#fff'}} onClick={()=>near&&setPanel(near)}>A</button>
    {near&&<div className="px text-[9px] absolute left-1/2 -translate-x-1/2 panel px-3 py-2 hidden md:block" style={{top:70}}>Tekan E / Spasi: {near.toUpperCase()}</div>}
    <nav className="panel absolute inset-x-2 grid grid-cols-6 p-1" style={{bottom:'calc(env(safe-area-inset-bottom) + 8px)'}}>{NAV.map(([k,l,i])=><button key={k} onClick={()=>setPanel(k)} className="px text-[7px] py-2 flex flex-col items-center gap-1 rounded-lg" style={{background:near===k?'#f4e3b8':'transparent'}}><span className="text-xl">{i}</span>{l}</button>)}</nav>
    {panel&&<Panel k={panel} close={()=>setPanel(null)} name={name} sid={sid} chat={chat}/>}
  </main>);
}

function Panel({k,close,name,sid,chat}:{k:string;close:()=>void;name:string;sid:string;chat:any[]}){
  const [cd,setCd]=useState('');const [txt,setTxt]=useState('');const [msg,setMsg]=useState('');const [list,setList]=useState<any[]>([]);const [att,setAtt]=useState('hadir');const [gs,setGs]=useState(1);const [rm,setRm]=useState('');
  useEffect(()=>{const t=setInterval(()=>{const d=+new Date(W.date)-Date.now();const s=Math.max(0,d/1000|0);setCd(`${s/86400|0}h ${s%86400/3600|0}j ${s%3600/60|0}m ${s%60}d`)},1000);return()=>clearInterval(t)},[]);
  useEffect(()=>{if(k==='ucapan'||k==='sapa')supabase.from('greetings').select('name,message,created_at').eq('hidden',false).order('created_at',{ascending:false}).limit(50).then(r=>setList(r.data||[]))},[k,chat.length]);
  const send=async(t:string)=>{t=t.trim().slice(0,200);if(!t)return;const{error}=await supabase.from('greetings').insert({session_id:sid,name,message:t});if(error)return setMsg(error.message);
    window.dispatchEvent(new CustomEvent('vv:say',{detail:{name,text:t,t:Date.now()}}));setTxt('');setMsg('Terkirim ✓')};
  const rsvp=async()=>{const{error}=await supabase.from('rsvps').insert({name,attendance:att,guests:gs,message:rm.slice(0,300)});setMsg(error?error.message:'RSVP tersimpan ✓')};
  const cal=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan '+W.groom+' & '+W.bride)}&dates=${W.date.replace(/[-:]/g,'').slice(0,15)}Z/${W.date.replace(/[-:]/g,'').slice(0,15)}Z`;
  const share=()=>navigator.share?navigator.share({title:'Undangan '+W.groom+' & '+W.bride,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>setMsg('Link disalin ✓'));
  return(<div className="absolute inset-0 flex items-end md:items-center justify-center p-2" style={{background:'#0006'}} onClick={close}>
    <div className="panel w-full max-w-md max-h-[78%] scroll p-4 relative" style={{marginBottom:'env(safe-area-inset-bottom)'}} onClick={e=>e.stopPropagation()}>
      <button className="absolute right-3 top-2 text-xl" onClick={close}>✕</button>
      {k==='pasangan'&&<><h2 className="px text-xs mb-3">PASANGAN</h2><p><b>{W.groom}</b><br/>{W.groomFamily}</p><p className="mt-2"><b>{W.bride}</b><br/>{W.brideFamily}</p><p className="px text-xs mt-4 text-center">{cd}</p><button className="btn mt-3 w-full" onClick={share}>Bagikan Undangan</button></>}
      {k==='acara'&&<><h2 className="px text-xs mb-3">ACARA</h2>{W.events.map(e=><p key={e.name} className="mb-2"><b>{e.name}</b><br/>{W.dateLabel} · {e.time}<br/>{e.place}</p>)}<div className="flex gap-2"><a className="btn flex-1 text-center" href={W.mapsUrl} target="_blank">Google Maps</a><a className="btn flex-1 text-center" href={cal} target="_blank">Simpan Kalender</a></div></>}
      {k==='galeri'&&<><h2 className="px text-xs mb-3">GALERI</h2>{W.gallery.length?<div className="grid grid-cols-2 gap-2">{W.gallery.map(u=>/\.(mp4|webm)$/.test(u)?<video key={u} src={u} controls className="rounded"/>:<img key={u} src={u} loading="lazy" className="rounded"/>)}</div>:<p>Isi <code>gallery</code> di src/lib/config.ts.</p>}</>}
      {(k==='ucapan'||k==='sapa')&&<><h2 className="px text-xs mb-3">{k==='sapa'?'SAPA TAMU':'UCAPAN & RSVP'}</h2>
        <div className="flex flex-wrap gap-1 mb-2">{W.quick.map(q=><button key={q} className="text-xs p-2 rounded-lg border-2" style={{borderColor:'var(--gold)'}} onClick={()=>send(q)}>{q}</button>)}</div>
        <div className="flex gap-2"><input className="inp" maxLength={200} value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Tulis ucapan…"/><button className="btn" onClick={()=>send(txt)}>Kirim</button></div>
        {k==='ucapan'&&<div className="mt-3 border-t pt-3"><b>RSVP</b><select className="inp my-2" value={att} onChange={e=>setAtt(e.target.value)}><option value="hadir">Hadir</option><option value="tidak_hadir">Tidak hadir</option><option value="ragu">Masih ragu</option></select>
          <input className="inp mb-2" type="number" min={1} max={10} value={gs} onChange={e=>setGs(+e.target.value)}/><input className="inp mb-2" placeholder="Pesan (opsional)" value={rm} onChange={e=>setRm(e.target.value)}/><button className="btn w-full" onClick={rsvp}>Kirim RSVP</button></div>}
        <p className="text-xs mt-2">{msg}</p><div className="mt-3 space-y-2">{list.map((g,i)=><div key={i} className="text-sm p-2 rounded" style={{background:'#f4ecd8'}}><b>{g.name}</b> <span className="text-xs opacity-60">{new Date(g.created_at).toLocaleString('id-ID')}</span><br/>{g.message}</div>)}</div></>}
      {k==='hadiah'&&<><h2 className="px text-xs mb-3">HADIAH DIGITAL</h2>{W.gifts.map(g=><div key={g.no} className="mb-3"><b>{g.bank}</b> a.n. {g.holder}<br/>{g.no}<button className="btn ml-2 py-1" onClick={()=>navigator.clipboard.writeText(g.no).then(()=>setMsg('Nomor disalin ✓'))}>Salin</button></div>)}<p className="text-xs">{msg}</p></>}
      {k==='photobox'&&<Photobox/>}
    </div></div>);
}
function Photobox(){
  const v=useRef<HTMLVideoElement>(null);const c=useRef<HTMLCanvasElement>(null);const [on,setOn]=useState(false);
  const start=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});v.current!.srcObject=s;await v.current!.play();setOn(true)}catch{alert('Izin kamera ditolak')}};
  const snap=()=>{const cv=c.current!,x=cv.getContext('2d')!;cv.width=480;cv.height=600;x.drawImage(v.current!,0,0,480,600);x.strokeStyle='#C6A15B';x.lineWidth=16;x.strokeRect(8,8,464,584);x.fillStyle='#FFF6E8';x.font='20px serif';x.textAlign='center';x.fillText(`${W.groom} & ${W.bride} · ${W.dateLabel}`,240,580);
    const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download='photobox.png';a.click()};
  return(<><h2 className="px text-xs mb-3">PHOTOBOX</h2><video ref={v} playsInline muted className="rounded w-full" style={{transform:'scaleX(-1)'}}/><canvas ref={c} className="hidden"/>{on?<button className="btn w-full mt-2" onClick={snap}>Ambil & Unduh Foto</button>:<button className="btn w-full" onClick={start}>Nyalakan Kamera</button>}</>);
}
