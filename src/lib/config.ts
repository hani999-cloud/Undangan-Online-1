// Data dibaca dari data/undangan.xlsx (otomatis diubah jadi data.json saat build). Jangan edit file ini.
import raw from './data.json';
const D=raw as Record<string,string>;
const b=process.env.NEXT_PUBLIC_BASE_PATH||'';
const u=(s:string)=>!s?'':/^https?:/.test(s)?s:`${b}/${s.replace(/^\//,'')}`;
const iso=(D.tanggal||'2026-12-12 08:00').trim().replace(' ','T');
const n=[1,2,3,4,5,6];
export const W={
  groom:D.nama_pria,bride:D.nama_wanita,date:/[+Z]/.test(iso)?iso:iso+(iso.length===16?':00':'')+'+07:00',dateLabel:D.tanggal_tampil,
  groomFamily:D.keluarga_pria,brideFamily:D.keluarga_wanita,
  events:[{name:'Akad Nikah',time:D.akad_jam,place:D.akad_tempat},{name:'Resepsi',time:D.resepsi_jam,place:D.resepsi_tempat}],
  mapsUrl:D.link_maps,gallery:n.map(i=>u(D['foto'+i])).filter(Boolean),
  gifts:[1,2].map(i=>({bank:D['bank'+i],no:D['norek'+i],holder:D['an'+i]})).filter(g=>g.no),
  music:u(D.musik||'music.mp3'),quick:[1,2,3,4].map(i=>D['salam'+i]).filter(Boolean),
};
