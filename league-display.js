(function(){
  const css=document.createElement('style');
  css.textContent=`.sgm-league-name{display:inline-flex;align-items:center;gap:8px;margin:0 0 22px;padding:9px 13px;border-radius:999px;background:#111;color:#fff;border-left:4px solid var(--yellow,#ffd400);font-size:12px;font-weight:900;letter-spacing:.35px;text-transform:uppercase;box-shadow:0 6px 18px rgba(0,0,0,.08)}.sgm-league-name:before{content:'CAMPIONATO';font-size:9px;color:var(--yellow,#ffd400);letter-spacing:.7px}`;
  document.head.appendChild(css);
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function render(data){
    document.querySelectorAll('[data-sgm-calendar],[data-sgm-standings]').forEach(root=>{
      const key=(root.dataset.sgmCalendar||root.dataset.sgmStandings||'').replace(/-/g,'_');
      const sport=data?.sports?.[key]||data?.[key]||{};
      const name=sport.league_name||sport.campionato||sport.league||'';
      let badge=root.parentElement?.querySelector(':scope > .sgm-league-name');
      if(!name){if(badge)badge.remove();return;}
      if(!badge){badge=document.createElement('div');badge.className='sgm-league-name';root.insertAdjacentElement('beforebegin',badge);}
      badge.innerHTML=`<span>${esc(name)}</span>`;
    });
  }
  document.addEventListener('sgm-data-ready',e=>render(e.detail||{}));
  if(window.SGM_SITE_DATA)render(window.SGM_SITE_DATA);
})();