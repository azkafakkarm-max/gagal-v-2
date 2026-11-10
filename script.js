// VELTORN mobile navigation and footer year
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => navLinks.classList.remove("active"));
    });
}

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();


/* VELTORN ARENA: original top-down action survival game */
(() => {
 const canvas=document.getElementById('arenaCanvas'); if(!canvas) return;
 const ctx=canvas.getContext('2d'), W=960,H=540;
 const $=id=>document.getElementById(id);
 const overlay=$('arenaOverlay'), title=$('overlayTitle'), overlayText=$('overlayText');
 let running=false, paused=false, hp=100, score=0, kills=0, wave=1, last=0, spawnTimer=0, fireTimer=0, skillTimer=0, dashTimer=0;
 let player={x:W/2,y:H/2,r:15,speed:230,angle:0,inv:0}, enemies=[], bullets=[], particles=[];
 const keys={}, pointer={x:W/2,y:H/2,down:false};
 function reset(){hp=100;score=0;kills=0;wave=1;spawnTimer=0;fireTimer=0;skillTimer=0;dashTimer=0;player={x:W/2,y:H/2,r:15,speed:230,angle:0,inv:0};enemies=[];bullets=[];particles=[];updateHud();}
 function updateHud(){$('hpText').textContent=Math.max(0,Math.ceil(hp));$('hpBar').style.width=Math.max(0,hp)+'%';$('killCount').textContent=String(kills).padStart(2,'0');$('waveCount').textContent=String(wave).padStart(2,'0');$('scoreCount').textContent=String(score).padStart(4,'0');}
 function start(){reset();running=true;paused=false;overlay.hidden=true;$('pauseArena').textContent='Ⅱ PAUSE';last=performance.now();requestAnimationFrame(loop);}
 function finish(){running=false;overlay.hidden=false;title.textContent='MISSION FAILED';overlayText.textContent=`Kamu berhasil mengalahkan ${kills} drone dan meraih ${score} poin. Coba lagi untuk memecahkan rekor!`;$('startArena').textContent='↻ PLAY AGAIN';}
 function spawn(){let side=Math.floor(Math.random()*4),x=side===0?10:side===1?W-10:Math.random()*W,y=side===2?10:side===3?H-10:Math.random()*H;let tough=Math.random()<Math.min(.12+wave*.025,.4);enemies.push({x,y,r:tough?19:13,hp:tough?3:1,max:tough?3:1,speed:(tough?48:65)+wave*3,tough,hit:0});}
 function burst(x,y,color,n=8){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,v=30+Math.random()*150;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.35+Math.random()*.45,color});}}
 function shoot(){if(!running||paused||fireTimer>0)return;fireTimer=.19;let a=player.angle;bullets.push({x:player.x+Math.cos(a)*19,y:player.y+Math.sin(a)*19,vx:Math.cos(a)*520,vy:Math.sin(a)*520,life:1.2});}
 function emp(){if(!running||paused||skillTimer>0)return;skillTimer=5;burst(player.x,player.y,'#ffe078',42);enemies.forEach(e=>{if(Math.hypot(e.x-player.x,e.y-player.y)<155){e.hp-=2;e.hit=.2;if(e.hp<=0){kills++;score+=e.tough?35:15;burst(e.x,e.y,'#e5b94f',12);e.dead=true;}}});enemies=enemies.filter(e=>!e.dead);updateHud();}
 function dash(){if(!running||paused||dashTimer>0)return;dashTimer=3;let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);if(!dx&&!dy){dx=Math.cos(player.angle);dy=Math.sin(player.angle);}let l=Math.hypot(dx,dy)||1;player.x+=dx/l*105;player.y+=dy/l*105;player.x=Math.max(20,Math.min(W-20,player.x));player.y=Math.max(20,Math.min(H-20,player.y));player.inv=.35;burst(player.x,player.y,'#e8bf58',15);}
 function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#090d0d';ctx.fillRect(0,0,W,H);
  // arena grid and gold-lit lanes
  ctx.strokeStyle='rgba(197,157,65,.10)';ctx.lineWidth=1;for(let x=0;x<W;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=0;y<H;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  ctx.strokeStyle='rgba(226,184,83,.2)';ctx.lineWidth=3;ctx.strokeRect(18,18,W-36,H-36);
  for(let i=0;i<5;i++){ctx.fillStyle='rgba(216,173,78,.08)';ctx.fillRect(70+i*190,65,52,52);ctx.strokeStyle='rgba(216,173,78,.22)';ctx.strokeRect(70+i*190,65,52,52)}
  bullets.forEach(b=>{ctx.shadowBlur=12;ctx.shadowColor='#ffd76b';ctx.fillStyle='#ffe18a';ctx.beginPath();ctx.arc(b.x,b.y,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0});
  enemies.forEach(e=>{ctx.save();ctx.translate(e.x,e.y);ctx.rotate(Math.atan2(player.y-e.y,player.x-e.x));ctx.shadowBlur=14;ctx.shadowColor=e.tough?'#ff4b36':'#d5a53e';ctx.fillStyle=e.tough?'#61251e':'#55421e';ctx.strokeStyle=e.tough?'#ff7057':'#e5bd60';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.r+5,0);ctx.lineTo(-e.r*.7,-e.r*.8);ctx.lineTo(-e.r*.5,0);ctx.lineTo(-e.r*.7,e.r*.8);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#ffe6a1';ctx.fillRect(-e.r,-e.r-9,e.r*2,3);ctx.fillStyle='#db5544';ctx.fillRect(-e.r,-e.r-9,e.r*2*(e.hp/e.max),3);ctx.restore()});
  particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life*1.5);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,3,3);ctx.globalAlpha=1});
  ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.angle);ctx.shadowBlur=player.inv?24:16;ctx.shadowColor='#f1c65f';ctx.fillStyle=player.inv?'#fff0a6':'#d7a83f';ctx.strokeStyle='#fff0a6';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(-12,-12);ctx.lineTo(-7,0);ctx.lineTo(-12,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#111';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.fillStyle='rgba(240,210,140,.65)';ctx.font='10px Arial';ctx.fillText('VELTORN // COMBAT ZONE',30,H-28);
 }
 function loop(now){if(!running)return;let dt=Math.min((now-last)/1000,.033);last=now;if(!paused){
  let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);let len=Math.hypot(dx,dy)||1;player.x+=dx/len*player.speed*dt;player.y+=dy/len*player.speed*dt;player.x=Math.max(22,Math.min(W-22,player.x));player.y=Math.max(22,Math.min(H-22,player.y));player.angle=Math.atan2(pointer.y-player.y,pointer.x-player.x);player.inv=Math.max(0,player.inv-dt);fireTimer=Math.max(0,fireTimer-dt);skillTimer=Math.max(0,skillTimer-dt);dashTimer=Math.max(0,dashTimer-dt);
  if(pointer.down||keys[' '])shoot();spawnTimer-=dt;if(spawnTimer<=0){spawn();spawnTimer=Math.max(.35,1.45-wave*.07);if(kills>0&&kills%12===0)wave=Math.min(99,Math.floor(kills/12)+1);}
  bullets.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt});bullets=bullets.filter(b=>b.life>0&&b.x>0&&b.x<W&&b.y>0&&b.y<H);
  enemies.forEach(e=>{let a=Math.atan2(player.y-e.y,player.x-e.x),d=Math.hypot(player.x-e.x,player.y-e.y);e.x+=Math.cos(a)*e.speed*dt;e.y+=Math.sin(a)*e.speed*dt;e.hit=Math.max(0,e.hit-dt);if(d<e.r+player.r&&!player.inv){hp-=e.tough?22:12;player.inv=.65;burst(player.x,player.y,'#ff6855',8);updateHud();if(hp<=0)finish();}
   bullets.forEach(b=>{if(!b.used&&Math.hypot(b.x-e.x,b.y-e.y)<e.r+5){b.used=true;e.hp--;e.hit=.1;if(e.hp<=0){e.dead=true;kills++;score+=e.tough?35:15;burst(e.x,e.y,'#e5b94f',12);updateHud();}}});});enemies=enemies.filter(e=>!e.dead);bullets=bullets.filter(b=>!b.used);particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt});particles=particles.filter(p=>p.life>0);
 }draw();requestAnimationFrame(loop);}
 $('startArena').addEventListener('click',()=>{if(paused){paused=false;overlay.hidden=true;$('pauseArena').textContent='Ⅱ PAUSE';$('startArena').textContent='▶ START BATTLE';}else start();});$('restartArena').addEventListener('click',start);$('pauseArena').addEventListener('click',()=>{if(!running)return;paused=!paused;$('pauseArena').textContent=paused?'▶ RESUME':'Ⅱ PAUSE';if(paused){overlay.hidden=false;title.textContent='BATTLE PAUSED';overlayText.textContent='Tekan RESUME untuk kembali ke arena.';$('startArena').textContent='▶ RESUME';}else{overlay.hidden=true;$('startArena').textContent='▶ START BATTLE';}});
 canvas.addEventListener('pointermove',e=>{let r=canvas.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*W;pointer.y=(e.clientY-r.top)/r.height*H});canvas.addEventListener('pointerdown',e=>{pointer.down=true;canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener('pointerup',()=>pointer.down=false);canvas.addEventListener('pointerleave',()=>pointer.down=false);
 document.addEventListener('keydown',e=>{let k=e.key.toLowerCase();keys[k]=true;if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(k==='q')emp();if(k==='e')dash();if(k===' ')shoot()});document.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
 document.querySelectorAll('[data-move]').forEach(btn=>{let k={up:'w',down:'s',left:'a',right:'d'}[btn.dataset.move];btn.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true});['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,()=>keys[k]=false));});$('mobileAttack').addEventListener('pointerdown',()=>pointer.down=true);['pointerup','pointerleave','pointercancel'].forEach(ev=>$('mobileAttack').addEventListener(ev,()=>pointer.down=false));$('mobileSkill').addEventListener('click',emp);$('mobileDash').addEventListener('click',dash);
 reset();draw();
})();
