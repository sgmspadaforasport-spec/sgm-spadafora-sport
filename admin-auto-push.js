(function(){
  if((location.pathname.split('/').pop()||'').toLowerCase()!=='admin.html')return;
  const pending=[];
  window.SGM_PENDING_PUSH=pending;

  function addFlag(kind){
    const body=document.getElementById('modalBody');
    if(!body||body.querySelector('#sgmNotifyFlag'))return;
    const wrap=document.createElement('div');
    wrap.className='field full';
    wrap.style.marginTop='8px';
    wrap.innerHTML=`<label style="display:flex;align-items:center;gap:10px;background:#171717;border:1px solid #3a3a3a;border-radius:10px;padding:12px 14px;cursor:pointer;text-transform:none;font-size:12px;color:#fff"><input id="sgmNotifyFlag" type="checkbox" style="width:18px;height:18px;accent-color:#ffd400"> 🔔 Invia una notifica agli utenti dell'app dopo il salvataggio online</label><small style="color:#888">Facoltativo. Se non selezionato, il contenuto viene pubblicato senza notifica.</small>`;
    body.appendChild(wrap);
    wrap.dataset.kind=kind;
  }

  function detectAndInject(){
    const title=(document.getElementById('modalTitle')?.textContent||'').toLowerCase();
    if(title.includes('news'))addFlag('news');
    else if(title.includes('risultato'))addFlag('result');
  }

  document.addEventListener('click',e=>{
    const t=e.target;
    if(!(t instanceof Element))return;
    if(t.id==='addNewsAdmin'||t.classList.contains('edit-news-admin')||t.id==='addResult'||t.classList.contains('edit-result')){
      setTimeout(detectAndInject,0);
      return;
    }
    if(t.id!=='modalSave')return;
    const flag=document.getElementById('sgmNotifyFlag');
    if(!flag||!flag.checked)return;
    const kind=flag.closest('[data-kind]')?.dataset.kind;
    if(kind==='news'){
      const title=(document.getElementById('cnTitle')?.value||'').trim();
      const excerpt=(document.getElementById('cnExcerpt')?.value||'').trim();
      pending.push({
        type:'news',
        title:'📰 Nuova news SGM',
        body:title||excerpt||'È stata pubblicata una nuova news SGM.',
        target_url:'news.html',
        channel:'app'
      });
    } else if(kind==='result'){
      const sport=(document.getElementById('rSport')?.value||'').trim();
      const home=(document.getElementById('rHome')?.value||'').trim();
      const hs=(document.getElementById('rHomeScore')?.value||'').trim();
      const as=(document.getElementById('rAwayScore')?.value||'').trim();
      const away=(document.getElementById('rAway')?.value||'').trim();
      pending.push({
        type:'result',
        title:'🏆 Risultato finale'+(sport?` · ${sport}`:''),
        body:`${home||'SGM'} ${hs||'-'} - ${as||'-'} ${away||''}`.trim(),
        target_url:'calendario-risultati.html',
        channel:'app'
      });
    }
  });

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
      }catch(err){
        console.error('Invio notifica automatica fallito',err);
      }
    }
    if(sent&&typeof status==='function')setTimeout(()=>status(`✓ Modifiche salvate online · ${sent} notifica${sent===1?'':'he'} app inviata${sent===1?'':'e'}.`),0);
    if(sent<jobs.length)alert(`Contenuti salvati, ma ${jobs.length-sent} notifica${jobs.length-sent===1?' non è stata inviata':'he non sono state inviate'}.`);
  }

  function patchSave(){
    const db=window.SGM_DB;
    if(!db||db.__autoPushPatched)return false;
    const original=db.saveSiteData.bind(db);
    db.saveSiteData=async function(payload){
      const out=await original(payload);
      await flushPending();
      return out;
    };
    db.__autoPushPatched=true;
    return true;
  }

  const timer=setInterval(()=>{if(patchSave())clearInterval(timer);},100);
})();