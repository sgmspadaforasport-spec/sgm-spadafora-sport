(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  if(page && page!=='admin.html' && page!=='admin')return;

  const pending=[];
  window.SGM_PENDING_PUSH=pending;

  function kindFromModal(){
    const title=(document.getElementById('modalTitle')?.textContent||'').toLowerCase();
    if(title.includes('news')) return 'news';
    if(title.includes('risultato')) return 'result';
    if(title.includes('comunicato')) return 'official';
    if(title.includes('gara')) return 'next_match';
    return '';
  }

  function addControls(){
    const body=document.getElementById('modalBody');
    const modal=document.getElementById('modal');
    if(!body||!modal||!modal.classList.contains('open'))return;
    const kind=kindFromModal();
    if(!kind)return;
    body.querySelector('#sgmNotifyBox')?.remove();

    const box=document.createElement('div');
    box.id='sgmNotifyBox';
    box.dataset.kind=kind;
    box.className='field full';
    box.style.marginTop='14px';
    box.innerHTML=`
      <div style="background:#111;border:2px solid #ffd400;border-radius:12px;padding:14px">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;text-transform:none;font-size:13px;color:#fff;font-weight:900">
          <input id="sgmNotifyEnabled" type="checkbox" style="width:20px;height:20px;accent-color:#ffd400">
          🔔 Invia una notifica dopo il salvataggio
        </label>
        <div id="sgmNotifyChannels" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">
          <label style="display:flex;align-items:center;gap:8px;text-transform:none"><input id="sgmNotifyApp" type="checkbox" checked style="width:18px;height:18px;accent-color:#ffd400"> 📱 App</label>
          <label style="display:flex;align-items:center;gap:8px;text-transform:none"><input id="sgmNotifyWeb" type="checkbox" checked style="width:18px;height:18px;accent-color:#ffd400"> 🌐 Sito</label>
        </div>
        <small style="display:block;color:#999;margin-top:8px">Seleziona App, Sito oppure entrambi. La notifica parte quando il contenuto viene salvato online.</small>
      </div>`;
    body.appendChild(box);
  }

  function buildJob(){
    if(!document.getElementById('sgmNotifyEnabled')?.checked)return null;
    const app=!!document.getElementById('sgmNotifyApp')?.checked;
    const web=!!document.getElementById('sgmNotifyWeb')?.checked;
    if(!app&&!web){alert('Seleziona almeno App oppure Sito per la notifica.');return null;}
    const channel=app&&web?'all':app?'app':'web';
    const kind=document.getElementById('sgmNotifyBox')?.dataset.kind||kindFromModal();

    if(kind==='news'){
      const title=(document.getElementById('cnTitle')?.value||'').trim();
      const excerpt=(document.getElementById('cnExcerpt')?.value||'').trim();
      return {type:'news',title:'📰 '+(title||'Nuova news SGM'),body:excerpt||'È stata pubblicata una nuova news SGM.',target_url:'news.html',channel};
    }
    if(kind==='official'){
      const title=(document.getElementById('coTitle')?.value||'').trim();
      const text=(document.getElementById('coText')?.value||'').trim();
      return {type:'official',title:'📢 '+(title||'Comunicato ufficiale'),body:(text||'È stato pubblicato un nuovo comunicato ufficiale.').slice(0,220),target_url:'comunicati-ufficiali.html',channel};
    }
    if(kind==='result'){
      const sport=(document.getElementById('rSport')?.value||'').trim();
      const home=(document.getElementById('rHome')?.value||'').trim();
      const hs=(document.getElementById('rHomeScore')?.value||'').trim();
      const as=(document.getElementById('rAwayScore')?.value||'').trim();
      const away=(document.getElementById('rAway')?.value||'').trim();
      return {type:'result',title:'🏆 Risultato finale'+(sport?' · '+sport:''),body:`${home||'SGM'} ${hs||'-'} - ${as||'-'} ${away||''}`.trim(),target_url:'calendario-risultati.html',channel};
    }
    if(kind==='next_match'){
      const sport=(document.getElementById('mSport')?.value||'').trim();
      const date=(document.getElementById('mDate')?.value||document.getElementById('cDate')?.value||'').trim();
      const time=(document.getElementById('mTime')?.value||document.getElementById('cTime')?.value||'').trim();
      const home=(document.getElementById('mHome')?.value||document.getElementById('cHome')?.value||'').trim();
      const away=(document.getElementById('mAway')?.value||document.getElementById('cAway')?.value||'').trim();
      return {type:'next_match',title:'📅 Prossima partita'+(sport?' · '+sport:''),body:`${home||'SGM'} vs ${away||''}${date?' · '+date:''}${time?' · '+time:''}`,target_url:'calendario-risultati.html',channel};
    }
    return null;
  }

  async function sendJob(job){
    const db=window.SGM_DB;
    if(!db)throw new Error('Database non disponibile');
    await db.init();
    const session=await db.getSession();
    if(!session)throw new Error('Sessione amministratore scaduta');
    const {data,error}=await db.client.functions.invoke('send-app-notification',{body:job});
    if(error)throw error;
    if(data?.error)throw new Error(data.error);
    return data;
  }

  async function flushPending(){
    if(!pending.length)return;
    const jobs=pending.splice(0,pending.length);
    let sent=0,failed=0;
    for(const job of jobs){
      try{await sendJob(job);sent++;}catch(e){failed++;console.error('Invio notifica fallito',e);}
    }
    if(sent&&typeof status==='function') status(`✓ Contenuto salvato · ${sent} notifica${sent===1?'':'he'} inviata${sent===1?'':'e'}.`);
    if(failed) alert(`Contenuto salvato, ma ${failed} notifica${failed===1?' non è stata inviata':'he non sono state inviate'}.`);
  }

  document.addEventListener('click',e=>{
    const t=e.target;
    if(!(t instanceof Element)||t.id!=='modalSave')return;
    const job=buildJob();
    if(job)pending.push(job);
  },true);

  function installObserver(){
    const modal=document.getElementById('modal'),body=document.getElementById('modalBody'),title=document.getElementById('modalTitle');
    if(!modal||!body||!title)return false;
    const obs=new MutationObserver(()=>setTimeout(addControls,0));
    obs.observe(modal,{attributes:true,attributeFilter:['class']});
    obs.observe(body,{childList:true,subtree:false});
    obs.observe(title,{childList:true,characterData:true,subtree:true});
    document.addEventListener('click',()=>setTimeout(addControls,0),true);
    return true;
  }

  function patchSave(){
    const db=window.SGM_DB;
    if(!db||db.__unifiedPushPatched)return false;
    const original=db.saveSiteData.bind(db);
    db.saveSiteData=async function(payload){
      const out=await original(payload);
      await flushPending();
      return out;
    };
    db.__unifiedPushPatched=true;
    return true;
  }

  const a=setInterval(()=>{if(installObserver())clearInterval(a);},100);
  const b=setInterval(()=>{if(patchSave())clearInterval(b);},100);
})();