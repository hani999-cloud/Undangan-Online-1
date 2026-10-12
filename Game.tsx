'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { W } from '@/lib/config';
const emit=(n:string,d?:any)=>window.dispatchEvent(new CustomEvent(n,{detail:d}));
// Palet: [kulit, rambut/hijab, atasan, bawahan, tipe(0 peci,1 hijab,2 rambut)]
const PAL:string[][]=[['#e0b48a','#1c1c1c','#fff6e8','#344c3d','0'],['#e0b48a','#cfd9cb','#9baf98','#e8dcc4','1'],['#c99874','#2a2018','#2b3a55','#222a3a','2'],
['#e8c4a0','#4a3426','#b9a1b4','#887665','1'],['#d0a37c','#1c1c1c','#887665','#344c3d','0'],['#e8c4a0','#3a2a22','#d99a9c','#fff6e8','1'],
['#e0b48a','#1c1c1c','#ffffff','#fff6e8','2'],['#e8c4a0','#ffffff','#fff6e8','#fff6e8','1']]; // 6=pengantin pria, 7=pengantin wanita
const ZONES=[{k:'pasangan',x:640,y:230,l:'PASANGAN'},{k:'acara',x:260,y:430,l:'ACARA'},{k:'galeri',x:1020,y:430,l:'GALERI'},{k:'ucapan',x:260,y:760,l:'UCAPAN & RSVP'},{k:'hadiah',x:640,y:850,l:'HADIAH'},{k:'photobox',x:1020,y:760,l:'PHOTOBOX'}];

export default function Game({sid,name,skin}:{sid:string;name:string;skin:number}){
  useEffect(()=>{
    let game:any,ch:any,alive=true;
    (async()=>{
      const Phaser=(await import('phaser')).default;
      class S extends Phaser.Scene{
        me:any;peers:Record<string,any>={};keys:any;last=0;lx=0;ly=0;near:string|null=null;zoneG:any[]=[];
        mk(n:string,sk:number,x:number,y:number){
          const s=this.add.image(0,0,`c${sk}_0`).setOrigin(.5,1);
          const t=this.add.text(0,-52,n,{fontFamily:'"Press Start 2P"',fontSize:'7px',color:'#fff6e8',backgroundColor:'#344c3dcc',padding:{x:3,y:2}}).setOrigin(.5,1);
          const b=this.add.text(0,-66,'',{fontFamily:'sans-serif',fontSize:'11px',color:'#344c3d',backgroundColor:'#fff6e8',padding:{x:6,y:4},wordWrap:{width:150}}).setOrigin(.5,1).setVisible(false);
          const c:any=this.add.container(x,y,[s,t,b]);c.s=s;c.b=b;c.sk=sk;c.tx=x;c.ty=y;c.f=0;return c;}
        say(c:any,m:string){c.b.setText(m).setVisible(true);c.bt?.remove();c.bt=this.time.delayedCall(5000,()=>c.b.setVisible(false));}
        tex(){ // seluruh aset digambar prosedural (orisinal, tanpa file gambar)
          const px=3;PAL.forEach((p,i)=>{for(let f=0;f<3;f++){const g=this.make.graphics({x:0,y:0},false);const r=(c:string,x:number,y:number,w:number,h:number)=>{g.fillStyle(parseInt(c.slice(1),16));g.fillRect(x*px,y*px,w*px,h*px)};
            const ty=p[4];const la=f==1?1:0,lb=f==2?1:0;g.fillStyle(0,.25);g.fillEllipse(5*px,16*px,9*px,3*px);
            r(p[3],2,11+la*0,2,4-la);r(p[3],6,11,2,4-lb);r('#2a1a10',2,15-la,2,1);r('#2a1a10',6,15-lb,2,1);
            r(p[2],1,5,8,ty=='1'?9:6);r(p[0],0,6,1,3);r(p[0],9,6,1,3);r(p[0],2,2,6,4);
            if(ty=='0'){r(p[1],2,0,6,2);r(p[1],2,2,1,1)}else if(ty=='1'){r(p[1],1,0,8,2);r(p[1],1,2,1,5);r(p[1],8,2,1,5);r(p[1],2,5,6,1)}else{r(p[1],2,0,6,2);r(p[1],2,2,1,2);r(p[1],7,2,1,2)}
            r('#2a1a10',3,3,1,1);r('#2a1a10',6,3,1,1);r('#b5656a',4,5,2,0.6);r('#c6a15b',4,6,2,1);
            g.generateTexture(`c${i}_${f}`,10*px,17*px);g.destroy()}});
          const g=this.make.graphics({x:0,y:0},false);g.fillStyle(0xfff6e8);g.fillRect(0,0,32,32);g.fillStyle(0xf0e3cc);g.fillRect(0,0,16,16);g.fillRect(16,16,16,16);g.lineStyle(1,0xdccdb0);g.strokeRect(0,0,32,32);g.generateTexture('floor',32,32);g.destroy();}
        create(){
          this.tex();const WW=1280,HH=960;this.physics.world.setBounds(0,0,WW,HH);
          this.add.tileSprite(0,0,WW,HH,'floor').setOrigin(0);
          const g=this.add.graphics();
          g.fillStyle(0x344c3d);g.fillRect(560,120,160,840);g.fillStyle(0xc6a15b);g.fillRect(560,120,6,840);g.fillRect(714,120,6,840);
          for(let y=140;y<940;y+=40){g.fillStyle(0xc6a15b,.5);g.fillRect(630,y,20,6)}
          g.fillStyle(0x887665);g.fillRect(0,0,WW,96);g.fillStyle(0x344c3d);g.fillRect(0,88,WW,8);
          for(let x=40;x<WW;x+=96){g.fillStyle(0xffe9b0);g.fillRect(x,28,28,40);g.fillStyle(0xc6a15b);g.fillRect(x-2,24,32,4);g.fillStyle(0xffd77a,.2);g.fillCircle(x+14,52,40)}
          g.fillStyle(0x9baf98);g.fillRoundedRect(450,96,380,140,10);g.fillStyle(0xfff6e8);g.fillRoundedRect(470,106,340,110,60);g.fillStyle(0x344c3d);g.fillRect(560,236,160,16);
          const bl=this.physics.add.staticGroup();const wall=this.add.zone(640,50,WW,100);bl.add(wall);bl.add(this.add.zone(640,150,380,110));
          ZONES.forEach(z=>{const r=this.add.graphics();r.fillStyle(0x9baf98,.9);r.fillRoundedRect(z.x-60,z.y-40,120,80,8);r.lineStyle(3,0xc6a15b);r.strokeRoundedRect(z.x-60,z.y-40,120,80,8);
            this.add.text(z.x,z.y-52,'✦ '+z.l,{fontFamily:'"Press Start 2P"',fontSize:'8px',color:'#344c3d',backgroundColor:'#fff6e8',padding:{x:5,y:4}}).setOrigin(.5);
            const gl=this.add.circle(z.x,z.y,14,0xc6a15b,.6);this.tweens.add({targets:gl,scale:1.5,alpha:.1,duration:1400,repeat:-1});});
          const gm=this.mk(W.groom,6,610,170),br=this.mk(W.bride,7,670,170);[gm,br].forEach(c=>this.tweens.add({targets:c.s,y:-2,duration:1200,yoyo:true,repeat:-1}));
          this.add.rectangle(640,640,1,1);
          this.me=this.mk(name,skin,640,520);this.physics.add.existing(this.me);this.me.body.setSize(20,12).setOffset(-10,-6).setCollideWorldBounds(true);
          this.physics.add.collider(this.me,bl);
          this.cameras.main.setBounds(0,0,WW,HH).startFollow(this.me,true,.12,.12).setZoom(Math.max(1,Math.min(2,innerWidth/520)));
          this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE');
          this.input.keyboard!.on('keydown-E',()=>emit('vv:open'));this.input.keyboard!.on('keydown-SPACE',()=>emit('vv:open'));
          // Realtime multiplayer: Presence (kehadiran) + Broadcast (posisi & salam)
          ch=supabase.channel('vowverse',{config:{presence:{key:sid},broadcast:{self:false}}});
          ch.on('presence',{event:'sync'},()=>{const st=ch.presenceState();const ids=Object.keys(st);
            ids.forEach(id=>{if(id==sid||this.peers[id])return;const m=(st[id] as any)[0];this.peers[id]=this.mk(m.name,m.skin,m.x||640,m.y||520)});
            Object.keys(this.peers).forEach(id=>{if(!ids.includes(id)){this.peers[id].destroy();delete this.peers[id]}});
            emit('vv:peers',[{id:sid,name},...Object.keys(this.peers).map(id=>({id,name:(st[id] as any)[0].name}))])});
          ch.on('broadcast',{event:'pos'},({payload:p}:any)=>{const c=this.peers[p.id];if(c){c.tx=p.x;c.ty=p.y;c.f=p.f}});
          ch.on('broadcast',{event:'say'},({payload:p}:any)=>{const c=this.peers[p.id];if(c)this.say(c,p.text);emit('vv:chat',p)});
          ch.subscribe(async(s:string)=>{emit('vv:status',s);if(s==='SUBSCRIBED')await ch.track({name,skin,x:this.me.x,y:this.me.y})}); // re-track otomatis saat reconnect
          window.addEventListener('vv:say',((e:any)=>{this.say(this.me,e.detail.text);ch.send({type:'broadcast',event:'say',payload:{id:sid,...e.detail}})}) as any);
        }
        update(t:number,dt:number){
          const k=this.keys,j=(window as any).vvJoy||{x:0,y:0};let vx=(k.D.isDown||k.RIGHT.isDown?1:0)-(k.A.isDown||k.LEFT.isDown?1:0)+j.x,vy=(k.S.isDown||k.DOWN.isDown?1:0)-(k.W.isDown||k.UP.isDown?1:0)+j.y;
          const m=Math.hypot(vx,vy)||1;if(m>1){vx/=m;vy/=m}this.me.body.setVelocity(vx*120,vy*120);
          const mv=Math.abs(vx)+Math.abs(vy)>.1;this.me.f=mv?1+(Math.floor(t/150)%2):0;this.me.s.setTexture(`c${skin}_${this.me.f}`);this.me.setDepth(this.me.y);
          if(mv&&t-this.last>90){this.last=t;ch?.send({type:'broadcast',event:'pos',payload:{id:sid,x:Math.round(this.me.x),y:Math.round(this.me.y),f:this.me.f}})}
          Object.values(this.peers).forEach((c:any)=>{c.x+=(c.tx-c.x)*Math.min(1,dt/90);c.y+=(c.ty-c.y)*Math.min(1,dt/90); // interpolasi
            c.s.setTexture(`c${c.sk}_${Math.hypot(c.tx-c.x,c.ty-c.y)>1?1+(Math.floor(t/150)%2):0}`);c.setDepth(c.y)});
          const z=ZONES.find(z=>Math.hypot(z.x-this.me.x,z.y-this.me.y)<80);const nk=z?z.k:null;if(nk!==this.near){this.near=nk;emit('vv:near',nk)}
        }
      }
      if(!alive)return;
      game=new Phaser.Game({type:Phaser.AUTO,parent:'game',pixelArt:true,backgroundColor:'#1d2a21',scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},physics:{default:'arcade'},scene:S,input:{touch:{capture:false}}});
    })();
    return()=>{alive=false;ch&&supabase.removeChannel(ch);game?.destroy(true)};
  },[sid,name,skin]);
  return <div id="game" style={{position:'absolute',inset:0}}/>;
}
