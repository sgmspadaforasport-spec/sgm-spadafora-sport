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
        card.querySelector('.sgm-game-detail')?.remove();
        const html=detailHtml(key,games[i]||{});
        if(html)card.insertAdjacentHTML('beforeend',html);
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
    .sgm-game-detail{margin-top:12px;padding:10px 12px;border-radius:9px;background:#111;color:#ddd;border-left:3px solid var(--yellow,#ffd400);font-size:12px;line-height:1.5}
    .sgm-game-detail strong{color:var(--yellow,#ffd400)}
    .home-results .results-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
    .home-results .result-card{border:1px solid #e0e0e0;border-radius:14px;padding:18px;background:#fff;min-width:0}
    .home-results .result-sport{font-size:10px;font-weight:900;color:#8a7200;text-transform:uppercase}
    .home-results .result-card small{display:block;color:#777;font-size:11px;margin-top:6px}
    .home-results .result-score{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;margin:16px 0}
    .home-results .result-score strong:last-child{text-align:right}
    .home-results .result-score b{font-size:18px;white-space:nowrap}
    .home-results .result-card>a{display:inline-block;margin-top:12px;font-size:12px;font-weight:900}
    .sgm-home-results-empty{grid-column:1/-1;background:#fff;border:1px dashed #bbb;border-radius:14px;padding:24px;color:#777;text-align:center}
    @media(max-width:900px){.home-results .results-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:520px){.home-results .results-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
  document.addEventListener('sgm-data-ready',e=>setTimeout(()=>render(e.detail||{}),0));
  if(window.SGM_SITE_DATA)setTimeout(()=>render(window.SGM_SITE_DATA),0);
})();