(function(){
  const css=document.createElement('style');
  css.textContent=`.sgm-game-extra{margin-top:12px;padding-top:11px;border-top:1px solid #e5e5e5;font-size:12px;line-height:1.5}.sgm-game-extra strong{color:#111}.sgm-game-extra span{color:#666}.calendar-card .sgm-game-extra{grid-column:1/-1}`;
  document.head.appendChild(css);
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function normalize(k){return {'calcio-a-5':'calcio_a_5','pallavolo-maschile':'pallavolo_maschile','pallavolo-femminile':'pallavolo_femminile','basket':'basket'}[k]||k;}
  function getCalendar(s){if(Array.isArray(s?.calendar))return s.calendar;if(Array.isArray(s?.calendario))return s.calendario;if(Array.isArray(s?.matches))return s.matches;if(Array.isArray(s?.partite))return s.partite;return[];}
  function apply(data){
    document.querySelectorAll('[data-sgm-calendar]').forEach(root=>{
      const key=normalize(root.dataset.sgmCalendar||'');
      const sport=data?.sports?.[key]||data?.[key]||{};
      const games=getCalendar(sport);
      [...root.querySelectorAll('.calendar-card')].forEach((card,i)=>{
        card.querySelector('.sgm-game-extra')?.remove();
        const g=games[i]||{};let label='',value='';
        if(key==='calcio_a_5'&&g.scorers){label='Marcatori';value=g.scorers;}
        if((key==='pallavolo_maschile'||key==='pallavolo_femminile')&&g.sets){label='Set';value=g.sets;}
        if(key==='basket'&&g.quarters){label='Quarti';value=g.quarters;}
        if(!value)return;
        const el=document.createElement('div');el.className='sgm-game-extra';el.innerHTML=`<strong>${esc(label)}:</strong> <span>${esc(value)}</span>`;card.appendChild(el);
      });
    });
  }
  document.addEventListener('sgm-data-ready',e=>setTimeout(()=>apply(e.detail||{}),0));
  if(window.SGM_SITE_DATA)setTimeout(()=>apply(window.SGM_SITE_DATA),0);
})();