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
  function render(data){
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
  const style=document.createElement('style');
  style.textContent='.sgm-game-detail{margin-top:12px;padding:10px 12px;border-radius:9px;background:#111;color:#ddd;border-left:3px solid var(--yellow,#ffd400);font-size:12px;line-height:1.5}.sgm-game-detail strong{color:var(--yellow,#ffd400)}';
  document.head.appendChild(style);
  document.addEventListener('sgm-data-ready',e=>setTimeout(()=>render(e.detail||{}),0));
  if(window.SGM_SITE_DATA)setTimeout(()=>render(window.SGM_SITE_DATA),0);
})();