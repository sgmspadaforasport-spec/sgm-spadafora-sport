(async function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const teams={
    'calcio-a-5.html':{label:'PRIMA SQUADRA',title:'CALCIO A 5',desc:'Rosa, staff, calendario, risultati e classifica della squadra di calcio a 5.',icon:'⚽'},
    'pallavolo-maschile.html':{label:'VOLLEY',title:'PALLAVOLO MASCHILE',desc:'Rosa, staff, calendario, risultati e classifica della pallavolo maschile.',icon:'🏐'},
    'pallavolo-femminile.html':{label:'VOLLEY',title:'PALLAVOLO FEMMINILE',desc:'Rosa, staff, calendario, risultati e classifica della pallavolo femminile.',icon:'🏐'},
    'basket.html':{label:'PRIMA SQUADRA',title:'BASKET',desc:'Rosa, staff, calendario, risultati e classifica del settore basket.',icon:'🏀'},
    'giovanile-calcio.html':{label:'FUTURO SGM',title:'SETTORE GIOVANILE',desc:'Attività giovanile, scuola calcio e percorsi di crescita sportiva.',icon:'★',youth:true}
  };
  const team=teams[page]; if(!team)return;
  const css=document.createElement('style');
  css.textContent=`body{background:#f4f4f4}.team-premium-hero{background:#0d0d0d;color:#fff;border-bottom:5px solid var(--yellow,#ffd400);padding:72px 0 58px;position:relative;overflow:hidden}.team-premium-hero:after{content:"SGM";position:absolute;right:-20px;bottom:-58px;font-size:190px;font-weight:900;line-height:1;color:rgba(255,255,255,.035);pointer-events:none}.team-premium-hero-inner{display:flex;align-items:flex-end;justify-content:space-between;gap:35px;position:relative;z-index:1}.team-premium-hero h1{margin:5px 0 15px;font-size:clamp(46px,7vw,82px);line-height:.92;letter-spacing:-2.5px;font-weight:900;max-width:900px}.team-premium-hero p:last-child{margin:0;max-width:690px;color:#bcbcbc;font-size:16px;line-height:1.6}.team-premium-icon{width:104px;height:104px;flex:0 0 104px;border:1px solid #343434;border-radius:22px;background:#171717;display:grid;place-items:center;font-size:45px;box-shadow:inset 0 -4px 0 var(--yellow,#ffd400);color:var(--yellow,#ffd400)}.team-premium-nav{padding:56px 0 72px;background:#f4f4f4}.team-premium-head{margin-bottom:25px}.team-premium-head h2{margin:4px 0 0;font-size:clamp(30px,4vw,45px);line-height:1;font-weight:900;letter-spacing:-1px}.team-premium-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.team-premium-grid a{position:relative;aspect-ratio:auto;min-height:300px;background:#111;border:0;border-radius:20px;padding:0;text-decoration:none;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;isolation:isolate;box-shadow:0 14px 32px rgba(0,0,0,.16);transition:transform .2s ease,box-shadow .2s ease}.team-premium-grid a:before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(0,0,0,.52) 0%,rgba(0,0,0,.24) 16%,rgba(0,0,0,.08) 30%,transparent 48%);pointer-events:none}.team-premium-grid a:hover{transform:translateY(-3px);box-shadow:0 15px 34px rgba(0,0,0,.09);border-color:#c9c9c9}.team-premium-grid img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;z-index:0}.team-premium-grid span{position:absolute;left:22px;top:20px;z-index:2;background:var(--yellow,#ffd400);color:#000;border-radius:999px;padding:7px 11px;font-size:9px;font-weight:900;letter-spacing:.8px;text-transform:uppercase}.team-premium-grid strong{position:absolute;right:24px;bottom:20px;z-index:2;color:#fff;text-align:right;font-size:clamp(18px,2vw,27px);line-height:1;font-weight:900;max-width:60%;text-shadow:0 2px 12px #000}.team-premium-grid b{position:absolute;left:24px;right:auto;bottom:20px;z-index:2;width:auto;height:auto;border-radius:0;background:transparent;color:var(--yellow,#ffd400);display:block;font-size:10px;font-weight:900;letter-spacing:.6px}.team-premium-grid b:before{content:'SCOPRI ';}.youth-staff-section{padding:56px 0 70px!important;background:#f4f4f4!important}.youth-section-head{margin-bottom:25px!important}.youth-section-head h2{font-size:clamp(30px,4vw,45px)!important}.youth-staff-card{border-radius:18px!important;box-shadow:0 9px 26px rgba(0,0,0,.055)!important}.youth-links{display:none!important}@media(max-width:700px){.team-premium-hero{padding:52px 0 42px}.team-premium-hero-inner{align-items:flex-start}.team-premium-icon{width:72px;height:72px;flex-basis:72px;font-size:31px;border-radius:16px}.team-premium-hero h1{font-size:clamp(42px,12vw,62px);letter-spacing:-1.5px}.team-premium-grid{grid-template-columns:1fr}.team-premium-grid a{min-height:240px;padding:0}.team-premium-grid strong{right:18px;bottom:18px;max-width:60%;font-size:20px}.team-premium-grid b{left:18px;bottom:18px}.team-premium-nav{padding:40px 0 55px}}`;
  document.head.appendChild(css);
  const main=document.querySelector('main'); if(!main)return;
  if(team.youth){
    const oldHero=main.querySelector('.youth-hero');
    if(oldHero)oldHero.outerHTML=`<section class="team-premium-hero"><div class="container team-premium-hero-inner"><div><p class="section-kicker yellow">${team.label}</p><h1>${team.title}</h1><p>${team.desc}</p></div><div class="team-premium-icon" aria-hidden="true">${team.icon}</div></div></section>`;
    return;
  }
  const coverKeyFromHref=(href,title)=>{
    const h=(href||'').toLowerCase(),t=(title||'').toLowerCase();
    if(h.includes('-rosa')||t==='rosa')return 'rosa';
    if(h.includes('-staff')||t==='staff')return 'staff';
    if(h.includes('-calendario')||t.includes('calendario'))return 'calendario';
    if(h.includes('-classifica')||t==='classifica')return 'classifica';
    if(h.includes('news')||t==='news')return 'news';
    return '';
  };
  const links=[...main.querySelectorAll('.home-quick-grid a')].map(a=>{
    const href=a.getAttribute('href')||'#',title=a.querySelector('strong')?.textContent||a.textContent.trim();
    return {href,label:a.querySelector('span')?.textContent||'SGM',title,key:coverKeyFromHref(href,title),image:a.querySelector('img.team-section-photo')?.getAttribute('src')||''};
  });
  try{
    if(window.SGM_DB&&typeof window.SGM_DB.getSiteData==='function'){
      const latest=await window.SGM_DB.getSiteData();
      const covers=latest?.section_covers||{};
      links.forEach(x=>{if(x.key)x.image=(typeof covers[x.key]==='string'?covers[x.key]:'');});
    }
  }catch(e){console.warn('Copertine sezioni: dati non disponibili',e);links.forEach(x=>{if(x.key)x.image='';});}
  main.innerHTML=`<section class="team-premium-hero"><div class="container team-premium-hero-inner"><div><p class="section-kicker yellow">${team.label}</p><h1>${team.title}</h1><p>${team.desc}</p></div><div class="team-premium-icon" aria-hidden="true">${team.icon}</div></div></section><section class="team-premium-nav"><div class="container"><div class="team-premium-head"><p class="section-kicker yellow">AREA SQUADRA</p><h2>Scopri la squadra</h2></div><div class="team-premium-grid">${links.map(x=>`<a href="${x.href}">${x.image?`<img src="${x.image}" alt="" loading="lazy">`:``}<span>${x.label}</span><strong>${x.title}</strong><b>→</b></a>`).join('')}</div></div></section>`;
})();