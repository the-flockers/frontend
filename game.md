<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mass Surveillance — ALPR Awareness Game</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Bebas+Neue&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #040704; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 24px 16px; }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       EMBED INSTRUCTIONS
       ─────────────────────────────────────────────────────────
       Option A — Standalone page:
         Open this file directly in a browser. Done.

       Option B — Embed in an existing HTML page:
         1. Copy the Google Fonts <link> tag into your <head>.
         2. Copy all CSS inside the <style> block into your stylesheet
            (skip the body{} rule if your page has its own layout).
         3. Paste the #alpr-game-wrapper <div> wherever you want
            the game to appear in your page.
         4. Paste the entire <script> block before your </body> tag.

       Option C — iframe:
         <iframe src="alpr-game.html"
                 width="640" height="590"
                 style="border:none; display:block;">
         </iframe>
         Host this file anywhere and point the src at it.
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    #alpr-game-wrapper {
      width: 100%;
      max-width: 640px;
      font-family: 'Courier Prime', monospace;
      background: #080c0a;
      color: #c8cfc4;
      border: 1px solid #1a2a1a;
    }

    #canvas-wrap {
      position: relative;
      width: 100%;
      height: 420px;
      background: #080c0a;
      overflow: hidden;
    }

    canvas#game { display: block; margin: 0 auto; image-rendering: pixelated; }

    #hud {
      position: absolute; top: 0; left: 0; right: 0;
      display: flex; justify-content: space-between; align-items: stretch;
      z-index: 10; pointer-events: none;
      border-bottom: 1px solid #2a3a2a;
    }
    .hud-box {
      background: rgba(4,8,4,0.88); padding: 6px 14px;
      font-size: 11px; color: #5a7a5a; letter-spacing: 2px;
      text-transform: uppercase; border-right: 1px solid #1a2a1a; flex: 1;
    }
    .hud-box span {
      display: block; font-size: 16px; color: #a8c8a0;
      font-family: 'Bebas Neue', sans-serif; letter-spacing: 3px; margin-top: 1px;
    }
    .hud-box.score-box span { color: #d4c87a; }
    .hud-box.lives-box span { color: #c87a7a; }

    #scan-flash {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(180,30,0,0.15); pointer-events: none;
      opacity: 0; transition: opacity 0.08s; z-index: 5;
    }
    #crash-flash {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(200,160,0,0.15); pointer-events: none;
      opacity: 0; transition: opacity 0.08s; z-index: 5;
    }

    #scan-alert {
      position: absolute; top: 44px; left: 0; right: 0; text-align: center;
      font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 6px;
      padding: 7px 0; z-index: 15; pointer-events: none; opacity: 0;
      transition: opacity 0.15s; text-transform: uppercase;
      background: rgba(140,20,0,0.85); color: #f0a090;
      border-bottom: 1px solid #8a3020;
    }

    #score-popup {
      position: absolute; left: 50%; transform: translateX(-50%);
      font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 4px;
      z-index: 16; pointer-events: none; opacity: 0;
      transition: opacity 0.15s; white-space: nowrap;
    }

    #overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(2,5,2,0.96);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      z-index: 20;
    }
    #overlay-inner {
      border: 1px solid #2a3a2a; padding: 36px 44px;
      max-width: 400px; text-align: center;
    }
    #overlay h1 {
      font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #8aaa80;
      letter-spacing: 6px; text-transform: uppercase; margin-bottom: 4px;
    }
    .tagline {
      font-size: 10px; color: #3a5a3a; letter-spacing: 4px; text-transform: uppercase;
      border-top: 1px solid #1a2a1a; border-bottom: 1px solid #1a2a1a;
      padding: 6px 0; margin-bottom: 20px;
    }
    #overlay p { font-size: 12px; color: #607060; line-height: 1.9; margin-bottom: 16px; }
    .rule { font-size: 10px; color: #2a4a2a; letter-spacing: 2px; margin-bottom: 4px; }
    #start-btn {
      background: transparent; color: #8aaa80; border: 1px solid #4a6a4a;
      font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 5px;
      padding: 10px 36px; cursor: pointer; text-transform: uppercase;
      margin-top: 16px; transition: all 0.2s;
    }
    #start-btn:hover { background: #0a180a; border-color: #8aaa80; color: #c8e8c0; }

    #info-panel {
      background: #04080a; border-top: 1px solid #1a2820;
      padding: 14px 24px; min-height: 150px;
    }
    #info-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    #info-tag {
      font-family: 'Bebas Neue', sans-serif; font-size: 11px; letter-spacing: 4px;
      color: #3a5a3a; background: #0a120a; border: 1px solid #1a2a1a;
      padding: 3px 10px; white-space: nowrap;
    }
    #info-title {
      font-family: 'Bebas Neue', sans-serif; font-size: 18px;
      color: #8aaa80; letter-spacing: 3px;
    }
    #info-body { font-size: 12px; color: #607060; line-height: 1.8; }
    #controls-hint { font-size: 10px; color: #2a3a2a; margin-top: 10px; letter-spacing: 1px; }
  </style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════
     GAME WIDGET — paste from here to the closing div below
     ═══════════════════════════════════════════════════════════ -->
<div id="alpr-game-wrapper">

  <div id="canvas-wrap">
    <canvas id="game" width="640" height="420"></canvas>
    <div id="hud">
      <div class="hud-box score-box">Score<span id="hud-score">0</span></div>
      <div class="hud-box">Distance<span id="hud-dist">0 m</span></div>
      <div class="hud-box">Plates Logged<span id="hud-scans">0</span></div>
      <div class="hud-box">Speed<span id="hud-speed">0 mph</span></div>
      <div class="hud-box lives-box">Lives<span id="hud-lives">♥ ♥ ♥</span></div>
    </div>
    <div id="scan-flash"></div>
    <div id="crash-flash"></div>
    <div id="scan-alert">PLATE CAPTURED</div>
    <div id="score-popup">+20</div>
    <div id="overlay">
      <div id="overlay-inner">
        <h1>Mass Surveillance</h1>
        <div class="tagline">Automated License Plate Recognition</div>
        <p>Flock Safety cameras record every vehicle on every road — building permanent databases of where you go, when, and with whom. No warrant. No consent. No opt-out.</p>
        <div class="rule">← → or A / D &nbsp;·&nbsp; avoid scan beams and traffic</div>
        <div class="rule">+20 pts per 100m &nbsp;·&nbsp; −5 pts per plate scan &nbsp;·&nbsp; 3 lives</div>
        <div class="rule">Lanes 1 &amp; 3 — same direction &nbsp;·&nbsp; Lanes 2 &amp; 4 — oncoming</div>
        <button id="start-btn">Begin</button>
      </div>
    </div>
  </div>

  <div id="info-panel">
    <div id="info-header">
      <div id="info-tag">ALPR / FLOCK SAFETY</div>
      <div id="info-title">Automated Surveillance Network</div>
    </div>
    <div id="info-body">Drive to begin. Dodge Flock camera scan beams and traffic. Every plate scan is permanently logged — retained and shared with law enforcement, immigration authorities, and federal agencies without a warrant.</div>
    <div id="controls-hint">KEYBOARD: ← → ARROW KEYS or A / D &nbsp;·&nbsp; MOBILE: SWIPE LEFT / RIGHT</div>
  </div>

</div>
<!-- ═══════════════════════════════════════ END GAME WIDGET ═══ -->


<script>
(function(){
  const canvas=document.getElementById('game');
  const ctx=canvas.getContext('2d');
  const W=640,H=420;
  const flash=document.getElementById('scan-flash');
  const crashFlash=document.getElementById('crash-flash');
  const scanAlertEl=document.getElementById('scan-alert');
  const scorePopupEl=document.getElementById('score-popup');
  const overlay=document.getElementById('overlay');
  const infoTitle=document.getElementById('info-title');
  const infoBody=document.getElementById('info-body');
  const infoTag=document.getElementById('info-tag');
  const hudScore=document.getElementById('hud-score');
  const hudDist=document.getElementById('hud-dist');
  const hudScans=document.getElementById('hud-scans');
  const hudSpeed=document.getElementById('hud-speed');
  const hudLives=document.getElementById('hud-lives');

  const SCAN_ALERTS=[
    "LICENSE PLATE CAPTURED",
    "DRIVER'S SIDE STICKER RECORDED",
    "REAR STICKER LOGGED",
    "OSAMA BIN LADEN IN BACKSEAT"
  ];

  const ALPR_FACTS=[
    {tag:"DATA RETENTION",title:"Your Movements Are Stored",body:"Flock Safety retains plate scan records for up to 30 days by default. Many agencies pay for extended retention. In some jurisdictions your travel history is kept indefinitely with no notification."},
    {tag:"WARRANT-FREE ACCESS",title:"No Court Order Required",body:"Law enforcement agencies access Flock's database without obtaining a warrant. Because license plates are visible on public roads, courts have ruled drivers have no expectation of privacy."},
    {tag:"NETWORK SCALE",title:"5,000+ Camera Networks",body:"Flock operates across thousands of U.S. municipalities. A single commute can generate dozens of timestamped location records, forming a detailed map of your daily life."},
    {tag:"AGENCY SHARING",title:"Data Shared Across Jurisdictions",body:"Flock pools data across all subscribing agencies. A camera in a quiet suburb feeds records to federal agencies, ICE enforcement units, and out-of-state law enforcement — without residents being informed."},
    {tag:"CHILLING EFFECT",title:"Surveillance Changes Behavior",body:"Documented tracking changes how people move through their communities. Activists, journalists, domestic abuse survivors, and patients seeking sensitive medical care alter routes to avoid surveillance trails."},
    {tag:"FALSE POSITIVES",title:"Errors Have Consequences",body:"ALPR systems generate false positive matches against stolen vehicle databases. Innocent drivers have been forced out of vehicles at gunpoint based solely on erroneous Flock alerts."},
    {tag:"MASS COLLECTION",title:"Everyone Is Logged",body:"ALPR systems do not target suspects. Every vehicle in range is scanned and recorded. Residents of surveilled neighborhoods are logged as a matter of course — guilt is irrelevant."},
    {tag:"NO OPT-OUT",title:"You Cannot Refuse",body:"There is no mechanism to remove yourself from ALPR databases. Unlike website cookies or marketing lists, you cannot request deletion or block collection simply by driving on a public road."},
  ];

  const ROAD_LEFT=120,ROAD_RIGHT=520,ROAD_W=400;
  const CAR_W=36,CAR_H=62;
  const LANE_W=ROAD_W/4;
  const LANES=[0,1,2,3].map(i=>ROAD_LEFT+LANE_W*i+LANE_W/2-CAR_W/2);
  const LANE_ONCOMING=[false,true,false,true];
  const TRAFFIC_COLORS=['#3a2a1a','#1a2a3a','#2a1a2a','#1a3a2a','#3a3a1a','#2a2a2a','#3a1a1a','#1a2a2a'];

  let running=false,gameOver=false;
  let dist=0,scans=0,score=0,speed=3,lives=3;
  let roadOffset=0,frameCount=0;
  let keys={};
  let car={x:LANES[0],y:H-110,vx:0};
  let cameras=[],traffic=[],particles=[];
  let cameraSpacing=260;
  let lastScanFrame=-60,lastCrashFrame=-90;
  let alertHideTimer=null,popupHideTimer=null;
  let invincible=0,lastCheckpoint=0;

  function liveStr(n){let s='';for(let i=0;i<3;i++)s+=(i<n?'♥':'♡')+(i<2?' ':'');return s;}

  function spawnCamera(y){
    const side=Math.random()<0.5?'left':'right';
    const cx=side==='left'?ROAD_LEFT-22:ROAD_RIGHT+22;
    cameras.push({x:cx,y:y,side:side,scanAngle:side==='left'?0.0:Math.PI,scanDir:1});
  }

  function initCameras(){cameras=[];for(let i=0;i<3;i++)spawnCamera(30+i*cameraSpacing);}

  function spawnTraffic(){
    const laneIdx=Math.floor(Math.random()*4);
    const oncoming=LANE_ONCOMING[laneIdx];
    const col=TRAFFIC_COLORS[Math.floor(Math.random()*TRAFFIC_COLORS.length)];
    traffic.push({x:LANES[laneIdx],y:oncoming?H+30:-90,oncoming:oncoming,spd:Math.random()*1.5,color:col});
  }

  function drawRoad(){
    ctx.fillStyle='#0a0d0b';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#141a14';ctx.fillRect(ROAD_LEFT,0,ROAD_W,H);
    for(let i=1;i<4;i++){
      const lx=ROAD_LEFT+LANE_W*i,isCenter=i===2;
      ctx.strokeStyle=isCenter?'#5a5020':'#28342a';
      ctx.lineWidth=isCenter?2:1;
      if(isCenter){
        ctx.setLineDash([]);
        ctx.beginPath();ctx.moveTo(lx-1,0);ctx.lineTo(lx-1,H);ctx.stroke();
        ctx.beginPath();ctx.moveTo(lx+1,0);ctx.lineTo(lx+1,H);ctx.stroke();
      } else {
        ctx.setLineDash([20,22]);ctx.lineDashOffset=-(roadOffset%42);
        ctx.beginPath();ctx.moveTo(lx,0);ctx.lineTo(lx,H);ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    ctx.strokeStyle='#3a4a3a';ctx.lineWidth=2;ctx.setLineDash([]);
    ctx.beginPath();ctx.moveTo(ROAD_LEFT,0);ctx.lineTo(ROAD_LEFT,H);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ROAD_RIGHT,0);ctx.lineTo(ROAD_RIGHT,H);ctx.stroke();
    ctx.fillStyle='#0c100c';ctx.fillRect(0,0,ROAD_LEFT,H);ctx.fillRect(ROAD_RIGHT,0,W-ROAD_RIGHT,H);
    [{side:'left',offsets:[0,110,230,350]},{side:'right',offsets:[60,180,300,420]}].forEach(({side,offsets})=>{
      offsets.forEach(baseOff=>{
        const tx=side==='left'?4:W-64;
        const ty=((baseOff)-roadOffset*0.2+600)%H;
        const bh=55+Math.floor(baseOff/30)*8;
        ctx.fillStyle='#0f130f';ctx.fillRect(tx,ty,60,bh);
        ctx.strokeStyle='#1a221a';ctx.lineWidth=0.5;ctx.strokeRect(tx,ty,60,bh);
        ctx.fillStyle='#3a2800';
        for(let wx=0;wx<3;wx++)for(let wy=0;wy<3;wy++){
          if((tx+wx+wy+Math.floor(baseOff/40))%3!==0)ctx.fillRect(tx+5+wx*18,ty+8+wy*14,10,8);
        }
      });
    });
  }

  function drawNPC(t){
    ctx.save();
    if(t.oncoming){ctx.translate(t.x+CAR_W/2,t.y+CAR_H/2);ctx.rotate(Math.PI);ctx.translate(-CAR_W/2,-CAR_H/2);}
    else{ctx.translate(t.x,t.y);}
    ctx.fillStyle=t.color;ctx.beginPath();ctx.roundRect(0,0,CAR_W,CAR_H,4);ctx.fill();
    ctx.fillStyle='#0a140a';ctx.fillRect(4,10,CAR_W-8,15);ctx.fillRect(4,30,CAR_W-8,13);
    ctx.fillStyle=t.oncoming?'#c8b060':'#600000';ctx.fillRect(3,4,7,4);ctx.fillRect(CAR_W-10,4,7,4);
    ctx.fillStyle=t.oncoming?'#600000':'#c8b060';ctx.fillRect(3,CAR_H-9,7,5);ctx.fillRect(CAR_W-10,CAR_H-9,7,5);
    ctx.fillStyle='#0a0a0a';ctx.fillRect(-3,9,5,13);ctx.fillRect(CAR_W-2,9,5,13);ctx.fillRect(-3,CAR_H-22,5,13);ctx.fillRect(CAR_W-2,CAR_H-22,5,13);
    ctx.restore();
  }

  function drawPlayerCar(x,y){
    if(invincible>0&&Math.floor(invincible/5)%2===0)return;
    ctx.fillStyle='#1e3050';ctx.beginPath();ctx.roundRect(x,y,CAR_W,CAR_H,5);ctx.fill();
    ctx.fillStyle='#263a60';ctx.fillRect(x+4,y+10,CAR_W-8,15);ctx.fillRect(x+4,y+30,CAR_W-8,13);
    ctx.fillStyle='#304870';ctx.globalAlpha=0.6;ctx.fillRect(x+5,y+11,CAR_W-10,13);ctx.globalAlpha=1;
    ctx.fillStyle='#d0c080';ctx.fillRect(x+3,y+4,7,4);ctx.fillRect(x+CAR_W-10,y+4,7,4);
    ctx.fillStyle='#900000';ctx.fillRect(x+3,y+CAR_H-9,7,5);ctx.fillRect(x+CAR_W-10,y+CAR_H-9,7,5);
    ctx.fillStyle='#111';ctx.fillRect(x-3,y+9,5,13);ctx.fillRect(x+CAR_W-2,y+9,5,13);ctx.fillRect(x-3,y+CAR_H-22,5,13);ctx.fillRect(x+CAR_W-2,y+CAR_H-22,5,13);
    ctx.strokeStyle='#304870';ctx.lineWidth=0.5;ctx.strokeRect(x,y,CAR_W,CAR_H);
  }

  function drawCamera(cam){
    ctx.fillStyle='#1e2a1e';
    if(cam.side==='left')ctx.fillRect(cam.x+12,cam.y,4,44);else ctx.fillRect(cam.x-16,cam.y,4,44);
    ctx.fillStyle='#181e18';ctx.strokeStyle='#8a2010';ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect(cam.x-10,cam.y+32,20,12,2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#6a1808';ctx.beginPath();ctx.arc(cam.x,cam.y+38,3,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=`rgba(140,30,10,${0.3+Math.sin(frameCount*0.12)*0.2})`;ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(cam.x,cam.y+38,6+Math.sin(frameCount*0.12)*2,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#4a6a4a';ctx.font='7px monospace';ctx.textAlign='center';ctx.fillText('FLOCK',cam.x,cam.y+28);
  }

  function drawBeam(cam){
    const beamLen=200,ang=cam.scanAngle,ox=cam.x,oy=cam.y+38,spread=0.18;
    ctx.save();
    const grd=ctx.createRadialGradient(ox,oy,0,ox,oy,beamLen);
    grd.addColorStop(0,'rgba(180,40,10,0.28)');grd.addColorStop(0.5,'rgba(140,30,8,0.12)');grd.addColorStop(1,'rgba(100,20,5,0)');
    ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(ox,oy);
    ctx.lineTo(ox+Math.cos(ang-spread)*beamLen,oy+Math.sin(ang-spread)*beamLen);
    ctx.arc(ox,oy,beamLen,ang-spread,ang+spread);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(180,50,20,0.35)';ctx.lineWidth=0.5;ctx.setLineDash([3,8]);
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+Math.cos(ang)*beamLen,oy+Math.sin(ang)*beamLen);
    ctx.stroke();ctx.setLineDash([]);ctx.restore();
  }

  function checkScan(cam){
    if(invincible>0)return false;
    const ox=cam.x,oy=cam.y+38,cx=car.x+CAR_W/2,cy=car.y+CAR_H/2,dx=cx-ox,dy=cy-oy;
    if(Math.sqrt(dx*dx+dy*dy)>210)return false;
    let diff=Math.abs(Math.atan2(dy,dx)-cam.scanAngle);
    if(diff>Math.PI)diff=2*Math.PI-diff;
    return diff<0.24;
  }

  function checkCrash(t){
    if(invincible>0)return false;
    return car.x<t.x+CAR_W-4&&car.x+CAR_W>t.x+4&&car.y<t.y+CAR_H-6&&car.y+CAR_H>t.y+6;
  }

  function showPopup(text,color,ypos){
    scorePopupEl.textContent=text;scorePopupEl.style.color=color;
    scorePopupEl.style.top=ypos+'px';scorePopupEl.style.opacity='1';
    if(popupHideTimer)clearTimeout(popupHideTimer);
    popupHideTimer=setTimeout(()=>{scorePopupEl.style.opacity='0';},900);
  }

  function addScore(delta){score=Math.max(0,score+delta);hudScore.textContent=score;}

  function triggerScan(){
    scans++;hudScans.textContent=scans;addScore(-5);showPopup('− 5 pts','#c86050',88);
    scanAlertEl.textContent=SCAN_ALERTS[(scans-1)%SCAN_ALERTS.length];
    flash.style.opacity='1';scanAlertEl.style.opacity='1';
    if(alertHideTimer)clearTimeout(alertHideTimer);
    setTimeout(()=>{flash.style.opacity='0';},180);
    alertHideTimer=setTimeout(()=>{scanAlertEl.style.opacity='0';},2000);
    const f=ALPR_FACTS[(scans-1)%ALPR_FACTS.length];
    infoTag.textContent=f.tag;infoTitle.textContent=f.title;infoBody.textContent=f.body;
    for(let i=0;i<10;i++)particles.push({x:car.x+CAR_W/2,y:car.y+CAR_H/2,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,life:28,color:'#8a2010'});
  }

  function triggerCrash(){
    lives--;hudLives.textContent=liveStr(lives);
    crashFlash.style.opacity='1';setTimeout(()=>{crashFlash.style.opacity='0';},160);
    invincible=95;
    for(let i=0;i<14;i++)particles.push({x:car.x+CAR_W/2,y:car.y+CAR_H/2,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,life:36,color:'#806020'});
    if(lives<=0)endGame();
  }

  function endGame(){
    gameOver=true;running=false;
    const distBonus=Math.floor(dist/100)*20,scanPenalty=scans*5;
    document.getElementById('overlay-inner').innerHTML=`
      <h1>Record Filed</h1>
      <div class="tagline">Your movements have been permanently logged</div>
      <p>
        Final score: <strong style="color:#c8b060;font-size:15px;letter-spacing:2px">${score} pts</strong><br><br>
        Distance driven: <strong style="color:#8aaa80">${Math.round(dist)} m</strong><br>
        Distance bonus: <strong style="color:#6a9060">+ ${distBonus} pts</strong><br>
        Plates logged: <strong style="color:#c86050">${scans} &nbsp;(− ${scanPenalty} pts)</strong><br><br>
        In cities across the United States, this data is collected on every driver, every day — stored indefinitely, shared freely, and used without judicial oversight.
      </p>
      <button id="start-btn">Drive Again</button>`;
    overlay.style.display='flex';
    document.getElementById('start-btn').onclick=startGame;
  }

  let trafficTimer=0;

  function startGame(){
    dist=0;scans=0;score=0;speed=3;lives=3;roadOffset=0;frameCount=0;trafficTimer=0;
    car.x=LANES[0];car.y=H-110;car.vx=0;
    cameras=[];traffic=[];particles=[];invincible=0;
    lastScanFrame=-60;lastCrashFrame=-90;lastCheckpoint=0;
    hudScore.textContent='0';hudDist.textContent='0 m';hudScans.textContent='0';
    hudSpeed.textContent='0 mph';hudLives.textContent=liveStr(3);
    infoTag.textContent='ALPR / FLOCK SAFETY';
    infoTitle.textContent='Automated Surveillance Network';
    infoBody.textContent='Dodge Flock camera scan beams and traffic. Lanes 1 & 3 carry same-direction vehicles. Lanes 2 & 4 carry oncoming traffic. +20 pts every 100m — −5 pts every plate scan. Lose 3 lives and it ends.';
    document.getElementById('overlay-inner').innerHTML=`
      <h1>Mass Surveillance</h1>
      <div class="tagline">Automated License Plate Recognition</div>
      <p>Flock Safety cameras record every vehicle on every road — building permanent databases of where you go, when, and with whom. No warrant. No consent. No opt-out.</p>
      <div class="rule">← → or A / D &nbsp;·&nbsp; avoid scan beams and traffic</div>
      <div class="rule">+20 pts per 100m &nbsp;·&nbsp; −5 pts per plate scan &nbsp;·&nbsp; 3 lives</div>
      <div class="rule">Lanes 1 &amp; 3 — same direction &nbsp;·&nbsp; Lanes 2 &amp; 4 — oncoming</div>
      <button id="start-btn">Begin</button>`;
    document.getElementById('start-btn').onclick=startGame;
    initCameras();
    overlay.style.display='none';
    gameOver=false;running=true;
    loop();
  }

  function loop(){
    if(!running)return;
    ctx.clearRect(0,0,W,H);
    frameCount++;roadOffset+=speed;dist+=speed*0.1;speed=Math.min(3+dist/700,8);
    if(invincible>0)invincible--;
    hudDist.textContent=Math.round(dist)+' m';hudSpeed.textContent=Math.round(speed*10)+' mph';
    const cp=Math.floor(dist/100);
    if(cp>lastCheckpoint){const gained=(cp-lastCheckpoint)*20;lastCheckpoint=cp;addScore(gained);showPopup('+ '+gained+' pts','#7aaa60',118);}
    if(keys['ArrowLeft']||keys['a']||keys['A'])car.vx-=0.7;
    if(keys['ArrowRight']||keys['d']||keys['D'])car.vx+=0.7;
    car.vx*=0.80;car.x+=car.vx;
    car.x=Math.max(ROAD_LEFT+4,Math.min(ROAD_RIGHT-CAR_W-4,car.x));
    cameras.forEach(cam=>{
      cam.y+=speed;
      const sweepSpd=0.020+speed*0.002;cam.scanAngle+=sweepSpd*cam.scanDir;
      const hi=cam.side==='left'?1.20:Math.PI+0.20,lo=cam.side==='left'?-0.20:Math.PI-1.20;
      if(cam.scanAngle>hi)cam.scanDir=-1;if(cam.scanAngle<lo)cam.scanDir=1;
    });
    cameras=cameras.filter(c=>c.y<H+80);
    while(cameras.length<4){const topY=Math.min(...cameras.map(c=>c.y));spawnCamera(topY-cameraSpacing-Math.random()*50);cameraSpacing=Math.max(160,cameraSpacing-1.5);}
    trafficTimer++;const spawnInterval=Math.max(36,88-dist/30);
    if(trafficTimer>spawnInterval){trafficTimer=0;spawnTraffic();}
    traffic.forEach(t=>{t.y+=t.oncoming?-(speed*0.85+t.spd):(speed*0.45+t.spd);});
    traffic=traffic.filter(t=>t.oncoming?t.y>-110:t.y<H+110);
    if(frameCount-lastCrashFrame>90){for(const t of traffic){if(checkCrash(t)){lastCrashFrame=frameCount;triggerCrash();break;}}}
    drawRoad();
    cameras.forEach(cam=>{if(cam.y>-60&&cam.y<H+60)drawBeam(cam);});
    cameras.forEach(cam=>{if(cam.y>-60&&cam.y<H+60&&checkScan(cam)&&frameCount-lastScanFrame>55){lastScanFrame=frameCount;triggerScan();}});
    traffic.forEach(t=>{if(t.y>car.y+CAR_H)drawNPC(t);});
    drawPlayerCar(car.x,car.y);
    traffic.forEach(t=>{if(t.y<=car.y+CAR_H)drawNPC(t);});
    cameras.forEach(cam=>{if(cam.y>-60&&cam.y<H+60)drawCamera(cam);});
    particles=particles.filter(p=>p.life>0);
    particles.forEach(p=>{ctx.fillStyle=p.color;ctx.globalAlpha=p.life/36;ctx.fillRect(p.x+p.vx*(36-p.life),p.y+p.vy*(36-p.life),3,3);p.life--;});
    ctx.globalAlpha=1;
    requestAnimationFrame(loop);
  }

  document.addEventListener('keydown',e=>{keys[e.key]=true;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();});
  document.addEventListener('keyup',e=>{keys[e.key]=false;});
  let touchStartX=null;
  canvas.addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;},{passive:true});
  canvas.addEventListener('touchmove',e=>{
    if(touchStartX!==null){const dx=e.touches[0].clientX-touchStartX;if(dx<-10){keys['ArrowLeft']=true;keys['ArrowRight']=false;}else if(dx>10){keys['ArrowRight']=true;keys['ArrowLeft']=false;}else{keys['ArrowLeft']=false;keys['ArrowRight']=false;}}
    e.preventDefault();
  },{passive:false});
  canvas.addEventListener('touchend',()=>{keys['ArrowLeft']=false;keys['ArrowRight']=false;touchStartX=null;});

  document.getElementById('start-btn').onclick=startGame;
})();
</script>

</body>
</html>