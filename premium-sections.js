(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const supported=['sponsor.html','sgm-tv.html','galleria.html','calendario-risultati.html','news.html','squadre.html'];
  if(!supported.includes(page)) return;

  document.body.classList.add('premium-page');
  document.body.dataset.premiumPage=page.replace('.html','');

  const css=document.createElement('style');
  css.textContent=`
  .premium-page main{background:#f5f5f5}
  .premium-page .home-manifesto{padding:0!important;background:#111!important;color:#fff!important;border-bottom:4px solid var(--yellow)!important}
  .premium-page .home-manifesto>.container{padding-top:72px!important;padding-bottom:54px!important}
  .premium-page .home-manifesto h1{margin:0;font-size:clamp(46px,8vw,84px);line-height:.92;font-weight:900;letter-spacing:-1.5px;color:#fff}
  .premium-page .home-manifesto p:last-child{max-width:760px;color:#c7c7c7;font-size:17px;margin-top:16px;line-height:1.6}
  .premium-page main>.section{padding:58px 0!important;background:#f5f5f5!important}
  .premium-page .premium-grid,.premium-page .content-grid,.premium-page .sponsor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
  .premium-page .premium-card,.premium-page .content-card,.premium-page .sponsor-card{background:#fff;border:1px solid #e2e2e2;border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.07);transition:transform .2s ease,box-shadow .2s ease}
  .premium-page .premium-card:hover,.premium-page .content-card:hover,.premium-page .sponsor-card:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(0,0,0,.11)}
  .premium-page .premium-head{background:#111;color:#fff;padding:24px;border-bottom:4px solid var(--yellow)}
  .premium-page .premium-pill,.premium-page .content-label{display:inline-block;background:var(--yellow);color:#000!important;padding:7px 10px;border-radius:999px;font-size:10px!important;font-weight:900!important;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px}
  .premium-page .premium-head h2,.premium-page .premium-head h3{margin:0;font-size:28px;line-height:1.05;color:#fff}
  .premium-page .premium-sub{margin:8px 0 0;color:#bdbdbd;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.6px}
  .premium-page .premium-body{padding:24px;color:#555}
  .premium-page .premium-empty,.premium-page .content-empty{padding:42px;border:1px dashed #bbb;border-radius:16px;text-align:center;background:#fff;color:#777;grid-column:1/-1}

  .premium-page .content-card{display:flex;flex-direction:column}
  .premium-page .content-image{aspect-ratio:16/9;background:#ddd center/cover no-repeat;border-bottom:4px solid var(--yellow)}
  .premium-page .content-body{padding:24px!important;color:#555;flex:1}
  .premium-page .content-body h3{margin:6px 0 12px!important;font-size:28px!important;line-height:1.05!important;color:#111}
  .premium-page .content-body>small:not(.content-label){display:block;color:#8a7200!important;font-size:11px;font-weight:900;margin-bottom:8px}
  .premium-page .content-body p{color:#555!important;line-height:1.65}
  .premium-page .content-card.is-official{border-color:#e2e2e2!important}.premium-page .content-card.is-official .content-body{border-top:0!important}
  .premium-page details{margin-top:16px}.premium-page summary{list-style:none}.premium-page summary::-webkit-details-marker{display:none}

  .premium-page .sponsor-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .premium-page .sponsor-card{min-height:250px!important;padding:0!important;display:flex!important;flex-direction:column;justify-content:space-between!important;gap:0!important;text-align:center}
  .premium-page .sponsor-card:before{content:'PARTNER SGM';display:block;width:100%;background:#111;color:#fff;border-bottom:4px solid var(--yellow);padding:14px 18px;font-size:10px;font-weight:900;letter-spacing:1px}
  .premium-page .sponsor-card img{width:calc(100% - 48px)!important;height:135px!important;max-width:none!important;max-height:none!important;object-fit:contain!important;margin:24px auto 14px}
  .premium-page .sponsor-card strong{display:block;width:100%;padding:16px 20px 20px;font-size:16px!important;color:#111;border-top:1px solid #eee}
  .premium-page .sponsor-card a{display:none!important}

  .premium-page .gallery-grid{columns:auto!important;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
  .premium-page .gallery-card{margin:0!important;border-radius:18px!important;background:#fff!important;color:#111!important;border:1px solid #e2e2e2;box-shadow:0 12px 30px rgba(0,0,0,.07);overflow:hidden}
  .premium-page .gallery-card img{width:100%;aspect-ratio:4/3;object-fit:cover;border-bottom:4px solid var(--yellow)}
  .premium-page .gallery-card div{padding:20px!important}.premium-page .gallery-card h3{font-size:21px;margin:5px 0}.premium-page .gallery-card p{color:#666!important;line-height:1.5}

  .premium-page .home-quick-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:22px!important}
  .premium-page .home-quick-grid>a{position:relative;display:flex!important;min-height:190px;padding:0!important;border-radius:18px!important;background:#fff!important;border:1px solid #e2e2e2!important;box-shadow:0 12px 30px rgba(0,0,0,.07)!important;overflow:hidden;flex-direction:column;justify-content:flex-start;text-decoration:none}
  .premium-page .home-quick-grid>a span{display:block;background:#111;color:var(--yellow)!important;padding:18px 24px;border-bottom:4px solid var(--yellow);font-size:11px!important;font-weight:900;letter-spacing:1px}
  .premium-page .home-quick-grid>a strong{padding:32px 24px;color:#111!important;font-size:30px!important;line-height:1.05}
  .premium-page .home-quick-grid>a:after{content:'SCOPRI →';position:absolute;right:22px;bottom:18px;color:#8a7200;font-size:10px;font-weight:900;letter-spacing:.6px}

  .premium-tv-grid,.premium-calendar-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
  .premium-video-thumb{aspect-ratio:16/9;background:#171717 center/cover no-repeat;position:relative;border-bottom:4px solid var(--yellow)}
  .premium-video-thumb:after{content:'▶';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:var(--yellow);color:#000;font-size:22px;font-weight:900}
  .premium-video-link{display:inline-flex;margin-top:16px;font-weight:900;color:#111;text-decoration:none;border-bottom:2px solid var(--yellow);padding-bottom:3px}
  .premium-calendar-group{background:#fff;border:1px solid #e2e2e2;border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.07)}
  .premium-calendar-list{display:grid;gap:0}.premium-game{padding:20px 24px;border-bottom:1px solid #eee}.premium-game:last-child{border-bottom:0}
  .premium-game-meta{display:flex;justify-content:space-between;gap:10px;margin-bottom:12px;color:#8a7200;font-size:10px;font-weight:900;text-transform:uppercase}
  .premium-game-teams{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center}.premium-game-teams strong:last-child{text-align:right}.premium-score{background:#111;color:#fff;border-radius:10px;padding:8px 12px;font-weight:900;white-space:nowrap}
  .premium-game small{display:block;margin-top:10px;color:#777}

  @media(max-width:900px){.premium-page .sponsor-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.premium-page .gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.premium-tv-grid,.premium-calendar-groups{grid-template-columns:1fr}}
  @media(max-width:700px){.premium-page .premium-grid,.premium-page .content-grid,.premium-page .home-quick-grid{grid-template-columns:1fr!important}.premium-page .home-manifesto>.container{padding-top:58px!important;padding-bottom:44px!important}.premium-page .premium-head,.premium-page .premium-body,.premium-page .content-body{padding:20px!important}.premium-page .gallery-grid{grid-template-columns:1fr}}
  @media(max-width:520px){.premium-page .sponsor-grid{grid-template-columns:1fr!important}.premium-game-teams{grid-template-columns:1fr;gap:7px}.premium-game-teams strong:last-child{text-align:left}.premium-score{width:max-content}}
  `;
  document.head.appendChild(css);

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  async function getData(){
    if(window.SGM_SITE_DATA) return window.SGM_SITE_DATA;
    if(!window.SGM_DB) return {};
    await window.SGM_DB.init();
    if(!window.SGM_DB.enabled) return {};
    return await window.SGM_DB.getSiteData();
  }

  function targetContainer(){return document.querySelector('main>.section>.container')}

  function renderTV(data){
    if(page!=='sgm-tv.html') return;
    const target=targetContainer(); if(!target) return;
    const videos=Array.isArray(data?.sgm_tv?.videos)?data.sgm_tv.videos:[];
    if(!videos.length){target.innerHTML='<div class="premium-empty">Nessun contenuto video pubblicato al momento.</div>';return;}
    target.innerHTML=`<div class="premium-tv-grid">${videos.map(v=>`<article class="premium-card">${v.thumbnail?`<div class="premium-video-thumb" style="background-image:url('${esc(v.thumbnail)}')"></div>`:`<div class="premium-video-thumb"></div>`}<div class="premium-head"><span class="premium-pill">${esc(v.category||'SGM TV')}</span><h2>${esc(v.title||'Video')}</h2>${v.date?`<p class="premium-sub">${esc(v.date)}</p>`:''}</div><div class="premium-body">${v.url?`<a class="premium-video-link" href="${esc(v.url)}" target="_blank" rel="noopener">Guarda il video →</a>`:'Contenuto in preparazione.'}</div></article>`).join('')}</div>`;
  }

  const sports=[['calcio_a_5','Calcio a 5'],['pallavolo_maschile','Pallavolo Maschile'],['pallavolo_femminile','Pallavolo Femminile'],['basket','Basket']];
  function renderCalendar(data){
    if(page!=='calendario-risultati.html') return;
    const target=targetContainer(); if(!target) return;
    const groups=sports.map(([key,label])=>({label,items:Array.isArray(data?.sports?.[key]?.calendar)?data.sports[key].calendar:[]}));
    if(!groups.some(g=>g.items.length)){target.innerHTML='<div class="premium-empty">I calendari della stagione saranno pubblicati appena disponibili.</div>';return;}
    target.innerHTML=`<div class="premium-calendar-groups">${groups.map(g=>`<section class="premium-calendar-group"><div class="premium-head"><span class="premium-pill">CALENDARIO</span><h2>${esc(g.label)}</h2></div><div class="premium-calendar-list">${g.items.length?g.items.map(x=>`<article class="premium-game"><div class="premium-game-meta"><span>${esc(x.round||x.giornata||'Gara')}</span><span>${esc(x.date||x.data||'')}${(x.time||x.ora)?' · '+esc(x.time||x.ora):''}</span></div><div class="premium-game-teams"><strong>${esc(x.home||x.casa||'')}</strong><span class="premium-score">${esc(x.home_score??x.gol_casa??'-')} : ${esc(x.away_score??x.gol_trasferta??'-')}</span><strong>${esc(x.away||x.trasferta||'')}</strong></div>${x.venue||x.luogo?`<small>${esc(x.venue||x.luogo)}</small>`:''}</article>`).join(''):'<div class="premium-body">Calendario in aggiornamento.</div>'}</div></section>`).join('')}</div>`;
  }

  async function init(){
    try{const data=await getData();renderTV(data);renderCalendar(data);}catch(e){console.warn('Tema premium: dati non disponibili',e)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();