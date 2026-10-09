(function(){
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function normalize(k){return String(k||'').replace(/-/g,'_');}
  function detailHtml(key,g){
    if(key==='calcio_a_5'&&g.scorers){return `<div class="sgm-game-detail"><strong>⚽ Marcatori SGM:</strong> ${esc(g.scorers)}</div>`;}
    if(key==='pallavolo_maschile'||key==='pallavolo_femminile'){
      const sets=[g.set1,g.set2,g.set3,g.set4,g.set5].filter(Boolean);
      if(sets.length)return `<div class="sgm-game-detail"><strong>🏐 Set:</strong> ${sets.map((s,i)=>`${i+1}° ${esc(s)}`).join(' · ')}</div>`;
    }
    if(key==='basket'){
      const qs=[g.q1,g.q2,g.q3,g.q4].filter(Boolean);
      const ot=g.ot?` · OT ${esc(g.ot)}`:'';
      if(qs.length||g.ot)return `<div class="sgm-game-detail"><strong>🏀 Parziali:</strong> ${qs.map((s,i)=>`Q${i+1} ${esc(s)}`).join(' · ')}${ot}</div>`;
    }
    return '';
  }

  function renderCalendarDetails(data){
    document.querySelectorAll('[data-sgm-calendar]').forEach(root=>{
      const key=normalize(root.dataset.sgmCalendar);
      const sport=data?.sports?.[key]||data?.[key]||{};
      const games=Array.isArray(sport.calendar)?sport.calendar:Array.isArray(sport.calendario)?sport.calendario:[];
      const cards=root.querySelectorAll('.calendar-card');
      cards.forEach((card,i)=>{
        card.querySelectorAll('.sgm-game-detail').forEach(x=>x.remove());
        const html=detailHtml(key,games[i]||{});
        if(html){const old=card.querySelector('.calendar-extra');if(!old)card.insertAdjacentHTML('beforeend',html);}
      });
    });
  }

  const sports=[
    ['calcio_a_5','Calcio a 5','⚽','calcio-a-5-calendario.html'],
    ['pallavolo_maschile','Pallavolo Maschile','🏐','pallavolo-maschile-calendario.html'],
    ['pallavolo_femminile','Pallavolo Femminile','🏐','pallavolo-femminile-calendario.html'],
    ['basket','Basket','🏀','basket-calendario.html']
  ];

  function scorePresent(v){return v!==undefined&&v!==null&&String(v).trim()!==''&&String(v).trim()!=='-';}
  function dateValue(v){
    const s=String(v||'').trim();
    let m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
    if(m)return new Date(+m[3],+m[2]-1,+m[1]).getTime();
    const t=Date.parse(s);
    return Number.isFinite(t)?t:0;
  }

  function renderHomeResults(data){
    const root=document.querySelector('.home-results .results-grid');
    if(!root)return;
    const all=[];
    sports.forEach(([key,label,icon,href])=>{
      const sport=data?.sports?.[key]||data?.[key]||{};
      const games=Array.isArray(sport.calendar)?sport.calendar:Array.isArray(sport.calendario)?sport.calendario:[];
      games.forEach((g,i)=>{
        const hs=g.home_score??g.gol_casa;
        const as=g.away_score??g.gol_trasferta;
        if(!scorePresent(hs)||!scorePresent(as))return;
        all.push({key,label,icon,href,g,i,t:dateValue(g.date||g.data||'')});
      });
    });
    all.sort((a,b)=>(b.t-a.t)||(b.i-a.i));
    const latest=all.slice(0,4);
    if(!latest.length){
      root.innerHTML='<div class="sgm-home-results-empty">Nessun risultato disponibile al momento.</div>';
      return;
    }
    root.innerHTML=latest.map(({key,label,icon,href,g})=>{
      const home=g.home||g.casa||'';
      const away=g.away||g.trasferta||'';
      const hs=g.home_score??g.gol_casa??'-';
      const as=g.away_score??g.gol_trasferta??'-';
      const date=g.date||g.data||'';
      const round=g.round||g.giornata||'';
      return `<article class="result-card">
        <div class="result-sport">${icon} ${esc(label)}</div>
        ${date||round?`<small>${esc(round)}${round&&date?' · ':''}${esc(date)}</small>`:''}
        <div class="result-score"><strong>${esc(home)}</strong><b>${esc(hs)} : ${esc(as)}</b><strong>${esc(away)}</strong></div>
        ${detailHtml(key,g)}
        <a href="${href}">Dettagli gara →</a>
      </article>`;
    }).join('');
  }

  function render(data){
    renderCalendarDetails(data);
    renderHomeResults(data);
  }

  const style=document.createElement('style');
  style.textContent=`
    [data-sgm-calendar].calendar-list{gap:20px!important}
    [data-sgm-calendar] .calendar-card{position:relative;overflow:hidden;background:#fff!important;border:1px solid #ddd!important;border-radius:22px!important;padding:0!important;box-shadow:0 14px 35px rgba(0,0,0,.09);transition:.2s ease}
    [data-sgm-calendar] .calendar-card:hover{transform:translateY(-3px);box-shadow:0 18px 42px rgba(0,0,0,.13)}
    [data-sgm-calendar] .calendar-card:before{content:"";display:block;height:6px;background:var(--yellow,#ffd400)}
    [data-sgm-calendar] .calendar-head{margin:0!important;padding:14px 20px!important;background:#080808;align-items:center!important}
    [data-sgm-calendar] .calendar-head strong{display:inline-flex;background:var(--yellow,#ffd400);color:#000!important;padding:6px 10px;border-radius:999px;font-size:11px!important;font-weight:1000!important;text-transform:uppercase;letter-spacing:.5px}
    [data-sgm-calendar] .calendar-head span{color:#eee!important;font-size:12px!important;font-weight:900}
    [data-sgm-calendar] .calendar-status{position:absolute;right:18px;top:58px;color:#8b8b8b;font-size:9px;font-weight:1000;letter-spacing:1px}
    [data-sgm-calendar] .is-played .calendar-status{color:#786500}
    [data-sgm-calendar] .calendar-teams{grid-template-columns:minmax(0,1fr) 82px minmax(0,1fr)!important;gap:18px!important;padding:35px 24px 22px;min-height:90px}
    [data-sgm-calendar] .calendar-teams strong{font-size:clamp(16px,2vw,21px)!important;line-height:1.12;color:#111;font-weight:1000;text-transform:uppercase}
    [data-sgm-calendar] .calendar-teams strong:last-child{text-align:right}
    [data-sgm-calendar] .calendar-teams>b{display:grid;place-items:center;min-width:82px;padding:11px 7px;background:#080808;color:var(--yellow,#ffd400);border:2px solid var(--yellow,#ffd400);border-radius:13px;font-size:19px;font-weight:1000;white-space:nowrap;box-shadow:0 5px 14px rgba(0,0,0,.15)}
    [data-sgm-calendar] .calendar-card>small{display:block;margin:0!important;padding:0 24px 18px!important;color:#777!important;font-size:12px!important;font-weight:800}
    [data-sgm-calendar] .calendar-extra{margin:0 20px 20px;padding:15px 16px;background:#111;color:#fff;border-radius:14px;border-left:5px solid var(--yellow,#ffd400)}
    [data-sgm-calendar] .calendar-extra>span{display:block;color:var(--yellow,#ffd400);font-size:10px;font-weight:1000;letter-spacing:.8px;margin-bottom:8px}
    [data-sgm-calendar] .calendar-extra>strong{font-size:13px;line-height:1.5}
    [data-sgm-calendar] .calendar-extra-pills{display:flex;gap:7px;flex-wrap:wrap}
    [data-sgm-calendar] .calendar-extra-pills b{background:#242424;border:1px solid #444;border-radius:9px;padding:7px 9px;color:#aaa;font-size:10px}
    [data-sgm-calendar] .calendar-extra-pills em{font-style:normal;color:#fff;font-size:12px;margin-left:3px}
    @media(max-width:560px){
      [data-sgm-calendar] .calendar-head{flex-direction:row!important;flex-wrap:wrap;padding:12px 13px!important}
      [data-sgm-calendar] .calendar-status{top:55px;right:12px}
      [data-sgm-calendar] .calendar-teams{grid-template-columns:minmax(0,1fr) 60px minmax(0,1fr)!important;gap:6px!important;padding:34px 9px 18px;text-align:center!important}
      [data-sgm-calendar] .calendar-teams strong,[data-sgm-calendar] .calendar-teams strong:last-child{text-align:center!important;font-size:11.5px!important;line-height:1.15}
      [data-sgm-calendar] .calendar-teams>b{min-width:60px;padding:9px 2px;font-size:15px}
      [data-sgm-calendar] .calendar-card>small{padding:0 13px 15px!important;text-align:center}
      [data-sgm-calendar] .calendar-extra{margin:0 12px 14px;padding:13px}
      [data-sgm-calendar] .calendar-extra-pills{gap:5px}
    }
    .sgm-game-detail{margin-top:12px;padding:10px 12px;border-radius:9px;background:#111;color:#ddd;border-left:3px solid var(--yellow,#ffd400);font-size:12px;line-height:1.5}
    .sgm-game-detail strong{color:var(--yellow,#ffd400)}
    .home-results .results-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
    .home-results .result-card{position:relative;overflow:hidden;border:2px solid var(--yellow,#ffd400);border-radius:18px;padding:0;background:#050505;color:var(--yellow,#ffd400);min-width:0;box-shadow:0 14px 34px rgba(0,0,0,.45)}
    .home-results .result-card:before{content:"";display:block;height:7px;background:var(--yellow,#ffd400)}
    .home-results .result-sport{padding:15px 18px 11px;border-bottom:1px solid rgba(255,212,0,.35);font-size:12px;font-weight:900;letter-spacing:.8px;color:var(--yellow,#ffd400);text-transform:uppercase}
    .home-results .result-card small{display:block;padding:12px 18px 0;color:var(--yellow,#ffd400);font-size:11px;font-weight:800}
    .home-results .result-score{display:grid;grid-template-columns:minmax(0,.9fr) 66px minmax(0,1.25fr);align-items:center;gap:8px;margin:0;padding:22px 12px;text-align:center;width:100%;box-sizing:border-box}
    .home-results .result-score strong{display:block;min-width:0;color:var(--yellow,#ffd400);font-size:clamp(11px,2.6vw,15px);line-height:1.15;text-transform:uppercase;overflow-wrap:normal;word-break:normal;hyphens:none}
    .home-results .result-score strong:last-child{text-align:center}
    .home-results .result-score b{display:grid;place-items:center;width:66px;box-sizing:border-box;padding:9px 3px;border:2px solid var(--yellow,#ffd400);border-radius:11px;background:#000;color:var(--yellow,#ffd400);font-size:21px;line-height:1;white-space:nowrap}
    .home-results .sgm-game-detail{margin:0 18px 15px;padding:11px 12px;border-radius:10px;background:#111;color:#fff;border-left:4px solid var(--yellow,#ffd400);font-size:12px;line-height:1.45}
    .home-results .sgm-game-detail strong{color:var(--yellow,#ffd400)}
    .home-results .result-card>a{display:block;margin:0 18px 17px;padding-top:12px;border-top:1px solid rgba(255,212,0,.3);color:var(--yellow,#ffd400);font-size:12px;font-weight:900;text-align:right}
    .sgm-home-results-empty{grid-column:1/-1;background:#fff;border:1px dashed #bbb;border-radius:14px;padding:24px;color:#777;text-align:center}
    @media(max-width:900px){.home-results .results-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:520px){.home-results .results-grid{grid-template-columns:1fr}.home-results .result-score{grid-template-columns:minmax(0,.85fr) 58px minmax(0,1.3fr);gap:6px;padding:18px 8px}.home-results .result-score strong{font-size:10.5px;line-height:1.12}.home-results .result-score b{width:58px;min-width:0;padding:8px 2px;font-size:18px}}
  `;
  document.head.appendChild(style);
  document.addEventListener('sgm-data-ready',e=>setTimeout(()=>render(e.detail||{}),0));
  if(window.SGM_SITE_DATA)setTimeout(()=>render(window.SGM_SITE_DATA),0);
})();