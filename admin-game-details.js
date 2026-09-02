(function(){
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function getSport(){return window.data?.sports?.[window.currentCalendarSport]||null;}
  function getCalendar(sport){if(!sport)return[];if(Array.isArray(sport.calendar))return sport.calendar;if(Array.isArray(sport.calendario))return sport.calendario;if(Array.isArray(sport.matches))return sport.matches;if(Array.isArray(sport.partite))return sport.partite; sport.calendar=[]; return sport.calendar;}
  function detailFields(key,g,i){
    if(key==='calcio_a_5')return `<div class="field full"><label>Marcatori SGM</label><textarea class="sgm-game-detail" data-i="${i}" data-field="scorers" placeholder="Es. Rossi 2, Bianchi, Verdi">${esc(g.scorers||'')}</textarea><small style="color:#888">Inserisci i nomi dei marcatori, eventualmente con il numero di gol.</small></div>`;
    if(key==='pallavolo_maschile'||key==='pallavolo_femminile')return `<div class="field full"><label>Punteggio set</label><input class="sgm-game-detail" data-i="${i}" data-field="sets" value="${esc(g.sets||'')}" placeholder="Es. 25-20, 22-25, 25-18, 25-21"><small style="color:#888">Inserisci i set nell'ordine in cui sono stati giocati.</small></div>`;
    if(key==='basket')return `<div class="field full"><label>Punteggio quarti</label><input class="sgm-game-detail" data-i="${i}" data-field="quarters" value="${esc(g.quarters||'')}" placeholder="Es. 18-20, 22-17, 19-21, 25-18"><small style="color:#888">Inserisci i quattro quarti nell'ordine di gioco.</small></div>`;
    return '';
  }
  function render(){
    const panel=document.getElementById('calendar'); if(!panel||typeof window.data==='undefined'||typeof window.currentCalendarSport==='undefined')return;
    let box=document.getElementById('sgmGameDetailsAdmin');
    if(!box){box=document.createElement('div');box.id='sgmGameDetailsAdmin';box.style.marginTop='24px';document.getElementById('calendarList')?.insertAdjacentElement('afterend',box);}
    const sport=getSport(), games=getCalendar(sport), key=window.currentCalendarSport;
    const title=key==='calcio_a_5'?'⚽ Marcatori':(key==='basket'?'🏀 Punteggio quarti':'🏐 Punteggio set');
    if(!['calcio_a_5','pallavolo_maschile','pallavolo_femminile','basket'].includes(key)){box.innerHTML='';return;}
    box.innerHTML=`<div style="border-top:1px solid #333;padding-top:20px"><h3 style="margin:0 0 6px">${title}</h3><p style="color:#999;font-size:11px;margin:0 0 14px">Dettagli aggiuntivi delle gare. Verranno mostrati anche nella pagina pubblica.</p>${games.length?games.map((g,i)=>`<div class="item-card" style="display:block;margin-bottom:10px"><h3>${esc(g.round||g.giornata||'Gara')} · ${esc(g.home||g.casa||'')} - ${esc(g.away||g.trasferta||'')}</h3><div class="fields" style="margin-top:12px">${detailFields(key,g,i)}</div></div>`).join(''):'<div class="empty">Aggiungi prima una gara al calendario.</div>'}</div>`;
    box.querySelectorAll('.sgm-game-detail').forEach(el=>el.addEventListener('input',()=>{const arr=getCalendar(getSport());const g=arr[+el.dataset.i];if(g){g[el.dataset.field]=el.value.trim();if(typeof status==='function')status('Modifica pronta. Premi “Salva online” per pubblicarla.');}}));
  }
  function wait(){if(typeof window.data==='undefined'||typeof window.currentCalendarSport==='undefined'||!document.getElementById('calendarList'))return setTimeout(wait,120);render();
    document.getElementById('calendarSportTabs')?.addEventListener('click',()=>setTimeout(render,50));
    const obs=new MutationObserver(()=>setTimeout(render,40));obs.observe(document.getElementById('calendarList'),{childList:true,subtree:true});
  }
  wait();
})();