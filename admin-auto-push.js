(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  if(page && page!=='admin.html' && page!=='admin')return;
  const pending=[];
  window.SGM_PENDING_PUSH=pending;

  function addFlag(kind){
    const body=document.getElementById('modalBody');
    if(!body)return;
    const old=body.querySelector('#sgmNotifyFlagWrap');
    if(old)old.remove();
    const wrap=document.createElement('div');
    wrap.id='sgmNotifyFlagWrap';
    wrap.className='field full';
    wrap.dataset.kind=kind;
    wrap.style.marginTop='10px';
    wrap.innerHTML=`<label style="display:flex;align-items:center;gap:10px;background:#171717;border:2px solid #ffd400;border-radius:12px;padding:14px;cursor:pointer;text-transform:none;font-size:13px;color:#fff;font-weight:800"><input id="sgmNotifyFlag" type="checkbox" style="width:20px;height:20px;accent-color:#ffd400;flex:0 0 auto"> <span>🔔 Invia una notifica agli utenti dell'app</span></label><small style="display:block;color:#999;margin-top:7px">Facoltativo: se selezionato, la notifica partirà dopo “Salva online”.</small>`;
    body.appendChild(wrap);
  }

  function detectAndInject(){
    const modal=document.getElementById('modal');
    if(!modal||!modal.classList.contains('open'))return;
    const title=(document.getElementById('modalTitle')?.textContent||'').toLowerCase();
    if(title.includes('news'))addFlag('news');
    else if(title.includes('risultato'))addFlag('result');
  }

  function installObserver(){
    const modal=document.getElementById('modal');
    const body=document.getElementById('modalBody');
    const title=document.getElementById('modalTitle');
    if(!modal||!body||!title)return false;
    const observer=new MutationObserver(()=>setTimeout(detectAndInject,0));
    observer.observe(modal,{attributes:true,attributeFilter:['class']});
    observer.observe(body,{childList:true,subtree:false});
    observer.observe(title,{childList:true,characterData:true,subtree:true});
    document.addEventListener('click',()=>setTimeout(detectAndInject,0),true);
    return true;
  }

  document.addEventListener('click',e=>{
    const t=e.target;
    if(!(t instanceof Element)||t.id!=='modalSave')return;
    const flag=document.getElementById('sgmNotifyFlag');
    if(!flag||!flag.checked)return;
    const kind=document.getElementById('sgmNotifyFlagWrap')?.dataset.kind;
    if(kind==='news'){
      const title=(document.getElementById('cnTitle')?.value||'').trim();
      const excerpt=(document.getElementById('cnExcerpt')?.value||'').trim();
      pending.push({type:'news',title:'📰 Nuova news SGM',body:title||excerpt||'È stata pubblicata una nuova news SGM.',target_url:'news.html',channel:'app'});
    }else if(kind==='result'){
      const sport=(document.getElementById('rSport')?.value||'').trim();
      const home=(document.getElementById('rHome')?.value||'').trim();
      const hs=(document.getElementById('rHomeScore')?.value||'').trim();
      const as=(document.getElementById('rAwayScore')?.value||'').trim();
      const away=(document.getElementById('rAway')?.value||'').trim();
      pending.push({type:'result',title:'🏆 Risultato finale'+(sport?` · ${sport}`:''),body:`${home||'SGM'} ${hs||'-'} - ${as||'-'} ${away||''}`.trim(),target_url:'calendario-risultati.html',channel:'app'});
    }
  },true);

  async function flushPending(){
    if(!pending.length)return;
    const db=window.SGM_DB;
    if(!db?.client)return;
    const session=await db.getSession();
    if(!session)return;
    const jobs=pending.splice(0,pending.length);
    let sent=0;
    for(const job of jobs){
      try{
        const {data,error}=await db.client.functions.invoke('send-app-notification',{body:job});
        if(error)throw error;
        if(data?.error)throw new Error(data.error);
        sent++;
      }catch(err){console.error('Invio notifica automatica fallito',err);}
    }
    if(sent&&typeof status==='function')setTimeout(()=>status(`✓ Modifiche salvate online · ${sent} notifica${sent===1?'':'he'} app inviata${sent===1?'':'e'}.`),0);
    if(sent<jobs.length)alert(`Contenuti salvati, ma ${jobs.length-sent} notifica${jobs.length-sent===1?' non è stata inviata':'he non sono state inviate'}.`);
  }

  function patchSave(){
    const db=window.SGM_DB;
    if(!db||db.__autoPushPatched)return false;
    const original=db.saveSiteData.bind(db);
    db.saveSiteData=async function(payload){const out=await original(payload);await flushPending();return out;};
    db.__autoPushPatched=true;
    return true;
  }

  const obsTimer=setInterval(()=>{if(installObserver())clearInterval(obsTimer);},100);
  const saveTimer=setInterval(()=>{if(patchSave())clearInterval(saveTimer);},100);
})();