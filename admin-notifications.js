(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  if(page!=='admin.html')return;

  const templates={
    next_match:{label:'Prossima partita',title:'📅 Prossima partita',body:'La prossima gara SGM è in programma a breve. Apri per tutti i dettagli.'},
    match_day:{label:'Match Day',title:'🔥 MATCH DAY',body:'È giorno di gara! Forza SGM 💛🖤'},
    result:{label:'Risultato',title:'🏆 Risultato finale',body:'È terminata la gara. Apri per scoprire il risultato.'},
    news:{label:'News',title:'📰 Nuova news',body:'È online una nuova notizia dal mondo SGM.'},
    official:{label:'Comunicato ufficiale',title:'📣 Comunicato ufficiale',body:'È stato pubblicato un nuovo comunicato ufficiale ASD SGM Spadafora Sport.'},
    custom:{label:'Personalizzata',title:'',body:''}
  };

  function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function fmtDate(v){try{return new Date(v).toLocaleString('it-IT',{dateStyle:'short',timeStyle:'short'})}catch{return v||''}}

  function install(){
    const nav=document.querySelector('.admin-nav');
    const main=document.querySelector('.admin-layout main');
    const advanced=document.getElementById('advanced');
    if(!nav||!main||!advanced||document.getElementById('notificationsAdmin'))return;

    const navBtn=document.createElement('button');
    navBtn.className='nav-btn';navBtn.dataset.panel='notificationsAdmin';navBtn.textContent='🔔 Notifiche';
    const advancedBtn=nav.querySelector('[data-panel="advanced"]');
    nav.insertBefore(navBtn,advancedBtn||null);

    const section=document.createElement('section');
    section.className='admin-panel';section.id='notificationsAdmin';
    section.innerHTML=`
      <div class="panel-head"><div><h2>Notifiche</h2><p>Invia una sola notifica agli utenti registrati dell'app e del sito SGM.</p></div><div id="pushDeviceCount" class="admin-online">0 DISPOSITIVI</div></div>
      <div id="pushDeviceBreakdown" style="margin:-8px 0 18px;color:#aaa;font-size:12px;font-weight:800"></div>
      <div class="field full"><label>Tipo di notifica</label><div id="pushTemplates" class="toolbar"></div></div>
      <div class="fields" style="margin-top:16px">
        <div class="field full"><label>Titolo notifica</label><input id="pushTitle" maxlength="80" placeholder="Scrivi un titolo nuovo, es. Convocazioni U15"></div>
        <div class="field full"><label>Messaggio</label><textarea id="pushBody" maxlength="220" placeholder="Scrivi il testo della notifica..."></textarea></div>
        <div class="field full"><label>Pagina da aprire (facoltativa)</label><input id="pushTarget" placeholder="Es. news.html oppure https://asdsgmspadaforasport.it/news.html"></div>
      </div>
      <div class="toolbar" style="margin-top:4px"><button class="btn btn-primary" id="sendPushNotification">🔔 Invia notifica</button><button class="btn btn-dark" id="clearPushNotification">Svuota</button></div>
      <div id="pushStatus" class="status"></div>
      <div style="margin-top:30px;border-top:1px solid #292929;padding-top:22px"><div class="panel-head" style="margin-bottom:12px"><div><h2 style="font-size:20px">Cronologia</h2><p>Ultime notifiche inviate. Eliminandone una, sparirà anche dalla sezione Notifiche del sito.</p></div><button class="btn btn-dark btn-small" id="refreshPushHistory">Aggiorna</button></div><div id="pushHistory" class="item-list"><div class="empty">Caricamento...</div></div></div>`;
    main.insertBefore(section,advanced);

    navBtn.addEventListener('click',()=>{
      if(typeof openPanel==='function')openPanel('notificationsAdmin');
      else {
        document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
        section.classList.add('active');navBtn.classList.add('active');
      }
      refreshMeta();
    });

    const tpl=document.getElementById('pushTemplates');
    tpl.innerHTML=Object.entries(templates).map(([k,t])=>`<button type="button" class="btn btn-dark btn-small push-template" data-type="${k}">${esc(t.label)}</button>`).join('');
    tpl.querySelectorAll('.push-template').forEach(b=>b.addEventListener('click',()=>applyTemplate(b.dataset.type)));
    document.getElementById('sendPushNotification').addEventListener('click',sendNotification);
    document.getElementById('clearPushNotification').addEventListener('click',()=>applyTemplate('custom'));
    document.getElementById('refreshPushHistory').addEventListener('click',refreshMeta);
    applyTemplate('custom');
  }

  let currentType='custom';
  function applyTemplate(type){
    const t=templates[type]||templates.custom;currentType=type;
    document.querySelectorAll('.push-template').forEach(b=>{const on=b.dataset.type===type;b.classList.toggle('btn-primary',on);b.classList.toggle('btn-dark',!on)});
    const title=document.getElementById('pushTitle'),body=document.getElementById('pushBody'),target=document.getElementById('pushTarget');
    if(title)title.value=t.title;if(body)body.value=t.body;if(target&&type==='custom')target.value='';
  }

  async function client(){
    await window.SGM_DB.init();
    if(!window.SGM_DB.enabled||!window.SGM_DB.client)throw new Error('Supabase non disponibile');
    const session=await window.SGM_DB.getSession();if(!session)throw new Error('Sessione amministratore scaduta');
    return window.SGM_DB.client;
  }

  async function deleteNotification(id,title){
    if(!confirm(`Eliminare definitivamente questa notifica?\n\n${title||''}\n\nSparirà anche dalla sezione Notifiche del sito.`))return;
    const out=document.getElementById('pushStatus');
    try{
      const c=await client();
      const {error}=await c.from('app_notifications').delete().eq('id',id);
      if(error)throw error;
      if(out){out.style.color='#9bd18b';out.textContent='✓ Notifica eliminata dalla cronologia e dalla sezione Notifiche del sito.';}
      await refreshMeta();
    }catch(e){if(out){out.style.color='#ff8b8b';out.textContent='Eliminazione non riuscita: '+(e.message||e);}}
  }

  async function refreshMeta(){
    const history=document.getElementById('pushHistory');
    try{
      const c=await client();
      const [{count:appCount,error:appErr},{count:webCount,error:webErr},{data:items,error:histErr}]=await Promise.all([
        c.from('app_push_tokens').select('*',{count:'exact',head:true}),
        c.from('web_push_subscriptions').select('*',{count:'exact',head:true}),
        c.from('app_notifications').select('id,type,title,body,target_url,sent_count,failed_count,created_at').order('created_at',{ascending:false}).limit(20)
      ]);
      if(appErr)throw appErr;if(webErr)throw webErr;if(histErr)throw histErr;
      const total=(appCount||0)+(webCount||0);
      const badge=document.getElementById('pushDeviceCount');if(badge)badge.textContent=`${total} DISPOSITIV${total===1?'O':'I'}`;
      const breakdown=document.getElementById('pushDeviceBreakdown');if(breakdown)breakdown.textContent=`App: ${appCount||0} · Sito web: ${webCount||0}`;
      if(history){
        history.innerHTML=(items||[]).length?(items||[]).map(n=>`<div class="item-card"><div><h3>${esc(n.title)}</h3><p>${esc(n.body)}<br>${fmtDate(n.created_at)} · inviati ${n.sent_count||0}${n.failed_count?` · errori ${n.failed_count}`:''}</p></div><div class="item-actions"><span class="admin-online">${esc((templates[n.type]||{}).label||n.type||'Notifica')}</span><button type="button" class="btn btn-dark btn-small delete-push" data-id="${esc(n.id)}" data-title="${esc(n.title)}">🗑️ Elimina</button></div></div>`).join(''):'<div class="empty">Nessuna notifica inviata.</div>';
        history.querySelectorAll('.delete-push').forEach(btn=>btn.addEventListener('click',()=>deleteNotification(btn.dataset.id,btn.dataset.title)));
      }
    }catch(e){if(history)history.innerHTML=`<div class="empty">${esc(e.message||e)}</div>`;}
  }

  async function sendNotification(){
    const title=document.getElementById('pushTitle').value.trim();
    const body=document.getElementById('pushBody').value.trim();
    const target=document.getElementById('pushTarget').value.trim();
    const out=document.getElementById('pushStatus');const btn=document.getElementById('sendPushNotification');
    if(!title||!body){out.textContent='Inserisci titolo e messaggio.';out.style.color='#ff8b8b';return;}
    if(!confirm(`Inviare questa notifica a tutti i dispositivi registrati nell'app e nel sito?\n\n${title}\n${body}`))return;
    try{
      btn.disabled=true;btn.textContent='Invio in corso...';out.textContent='';
      const c=await client();
      const {data,error}=await c.functions.invoke('send-app-notification',{body:{type:currentType,title,body,target_url:target}});
      if(error)throw error;if(data?.error)throw new Error(data.error);
      const app=data?.app||{};const web=data?.web||{};
      out.style.color='#9bd18b';out.textContent=`✓ Inviate ${data?.sent||0} notifiche. App: ${app.sent||0}/${app.recipients||0} · Sito: ${web.sent||0}/${web.recipients||0}${data?.failed?` · errori: ${data.failed}`:''}.`;
      await refreshMeta();
    }catch(e){out.style.color='#ff8b8b';out.textContent='Invio non riuscito: '+(e.message||e);}
    finally{btn.disabled=false;btn.textContent='🔔 Invia notifica';}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
