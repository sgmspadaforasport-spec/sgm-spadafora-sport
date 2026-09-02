(function(){
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function wait(){
    if(typeof window.openModal!=='function'||typeof window.data==='undefined'||typeof window.currentCalendarSport==='undefined') return setTimeout(wait,80);
    install();
  }
  function install(){
    if(window.__SGM_CALENDAR_DETAILS_ADMIN__)return;
    window.__SGM_CALENDAR_DETAILS_ADMIN__=true;
    const original=window.openModal;
    window.openModal=function(title,html,onSave){
      const isCalendar=String(title||'').toLowerCase().includes('gara calendario');
      if(!isCalendar)return original.apply(this,arguments);
      const sport=window.currentCalendarSport;
      const arr=window.data?.sports?.[sport]?.calendar||[];
      let current=null;
      if(String(title).toLowerCase().startsWith('modifica')){
        const home=(String(html).match(/id="cHome" value="([^"]*)"/)||[])[1]||'';
        const away=(String(html).match(/id="cAway" value="([^"]*)"/)||[])[1]||'';
        current=arr.find(g=>String(g.home||'')===home&&String(g.away||'')===away)||null;
      }
      let extra='';
      if(sport==='calcio_a_5'){
        extra=`<div class="field full"><label>Marcatori SGM</label><textarea id="cScorers" placeholder="Es. Rossi (2), Bianchi, Verdi">${esc(current?.scorers||'')}</textarea><small style="color:#888">Inserisci i nomi dei marcatori; puoi indicare tra parentesi il numero di gol.</small></div>`;
      }else if(sport==='pallavolo_maschile'||sport==='pallavolo_femminile'){
        extra=`<div class="field full"><label>Punteggio dei set</label><div class="fields"><div class="field"><label>1° set</label><input id="cSet1" value="${esc(current?.set1||'')}" placeholder="25-20"></div><div class="field"><label>2° set</label><input id="cSet2" value="${esc(current?.set2||'')}" placeholder="25-22"></div><div class="field"><label>3° set</label><input id="cSet3" value="${esc(current?.set3||'')}" placeholder="23-25"></div><div class="field"><label>4° set</label><input id="cSet4" value="${esc(current?.set4||'')}" placeholder="25-18"></div><div class="field"><label>5° set</label><input id="cSet5" value="${esc(current?.set5||'')}" placeholder="15-12"></div></div></div>`;
      }else if(sport==='basket'){
        extra=`<div class="field full"><label>Punteggio dei quarti</label><div class="fields"><div class="field"><label>1° quarto</label><input id="cQ1" value="${esc(current?.q1||'')}" placeholder="18-15"></div><div class="field"><label>2° quarto</label><input id="cQ2" value="${esc(current?.q2||'')}" placeholder="20-17"></div><div class="field"><label>3° quarto</label><input id="cQ3" value="${esc(current?.q3||'')}" placeholder="16-19"></div><div class="field"><label>4° quarto</label><input id="cQ4" value="${esc(current?.q4||'')}" placeholder="22-18"></div><div class="field"><label>Supplementare</label><input id="cOT" value="${esc(current?.ot||'')}" placeholder="10-8"></div></div></div>`;
      }
      html=String(html).replace('</div>',extra+'</div>');
      const beforeLen=arr.length;
      const wrapped=function(){
        const details={};
        if(sport==='calcio_a_5')details.scorers=document.getElementById('cScorers')?.value.trim()||'';
        if(sport==='pallavolo_maschile'||sport==='pallavolo_femminile'){
          ['1','2','3','4','5'].forEach(n=>details['set'+n]=document.getElementById('cSet'+n)?.value.trim()||'');
        }
        if(sport==='basket'){
          ['1','2','3','4'].forEach(n=>details['q'+n]=document.getElementById('cQ'+n)?.value.trim()||'');
          details.ot=document.getElementById('cOT')?.value.trim()||'';
        }
        const old=current;
        onSave&&onSave();
        const list=window.data?.sports?.[sport]?.calendar||[];
        let target=null;
        if(old){
          target=list.find(g=>g===old)||list.find(g=>String(g.home||'')===String(document.getElementById('cHome')?.value||'')&&String(g.away||'')===String(document.getElementById('cAway')?.value||''));
        }
        if(!target&&list.length>beforeLen)target=list[list.length-1];
        if(!target&&list.length)target=list[list.length-1];
        if(target)Object.assign(target,details);
        if(typeof window.renderCalendarList==='function')window.renderCalendarList();
      };
      return original.call(this,title,html,wrapped);
    };
  }
  wait();
})();