const XLSX=require('xlsx'),fs=require('fs');
const wb=XLSX.readFile('data/undangan.xlsx');
const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,raw:false,defval:''});
const o={};for(const r of rows.slice(1)){if(r[0])o[String(r[0]).trim()]=String(r[1]??'').trim()}
fs.writeFileSync('src/lib/data.json',JSON.stringify(o,null,1));console.log('Excel dibaca:',Object.keys(o).length,'baris');
