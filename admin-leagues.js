(function(){
  function wait(){
    if(typeof data==='undefined'||!data||typeof currentStandingSport==='undefined'||typeof currentCalendarSport==='undefined') return setTimeout(wait,80);
    install();
  }
  function ensure(){
    if(!data.sports) data.sports={};
    ['calcio_a_5','pallavolo_maschile','pallavolo_femminile','basket'].forEach(k=>{
      data.sports[k]=data.sports[k]||{};
      if(typeof data.sports[k].league_name!=='string') data.sports[k].league_name='';
    });
  }
  function fieldHtml(id,label){return `<div class="field full sgm-league-field" style="margin:0 0 18px"><label>${label}</label><input id="${id}" placeholder="Es. Serie C2 - Girone ..."><small style="color:#888;font-size:10px">Il nome comparirà nella pagina pubblica di questa disciplina.</small></div>`;}
  function sync(){
    ensure();
    const s=document.getElementById('standingLeagueName');
    const c=document.getElementById('calendarLeagueName');
    if(s) s.value=data.sports[currentStandingSport]?.league_name||'';
    if(c) c.value=data.sports[currentCalendarSport]?.league_name||'';
  }
  function install(){
    ensure();
    const standings=document.getElementById('standings');
    const calendar=document.getElementById('calendar');
    if(standings&&!document.getElementById('standingLeagueName')){
      const tabs=document.getElementById('standingSportTabs');
      tabs?.insertAdjacentHTML('afterend',fieldHtml('standingLeagueName','Nome campionato'));
      document.getElementById('standingLeagueName')?.addEventListener('input',e=>{ensure();data.sports[currentStandingSport].league_name=e.target.value.trim();});
      tabs?.addEventListener('click',()=>setTimeout(sync,0));
    }
    if(calendar&&!document.getElementById('calendarLeagueName')){
      const tabs=document.getElementById('calendarSportTabs');
      tabs?.insertAdjacentHTML('afterend',fieldHtml('calendarLeagueName','Nome campionato'));
      document.getElementById('calendarLeagueName')?.addEventListener('input',e=>{ensure();data.sports[currentCalendarSport].league_name=e.target.value.trim();});
      tabs?.addEventListener('click',()=>setTimeout(sync,0));
    }
    sync();
    const observer=new MutationObserver(()=>sync());
    document.getElementById('standingSportTabs')&&observer.observe(document.getElementById('standingSportTabs'),{childList:true,subtree:true,attributes:true});
    document.getElementById('calendarSportTabs')&&observer.observe(document.getElementById('calendarSportTabs'),{childList:true,subtree:true,attributes:true});
  }
  wait();
})();