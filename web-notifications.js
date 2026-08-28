(function(){
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page==='admin.html') return;

  const VAPID_PUBLIC_KEY='BLZ6RXPVYdN1T_AE3Y5W2JyDhoizUjXX5so0nLXjoUfrVLPCpW8G8Gv2DmFL7SipSLK2tMFPjlPafDUBCo5pP5I';
  const DISMISS_KEY='sgm_web_push_dismissed_at';
  const supported='serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  let client=null;

  function b64ToUint8Array(base64String){
    const padding='='.repeat((4-base64String.length%4)%4);
    const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
    const rawData=atob(base64);
    return Uint8Array.from([...rawData].map(c=>c.charCodeAt(0)));
  }

  function getClient(){
    if(client) return client;
    if(window.supabase?.createClient && window.SGM_SUPABASE_CONFIG){
      client=window.supabase.createClient(window.SGM_SUPABASE_CONFIG.url,window.SGM_SUPABASE_CONFIG.anonKey);
    }
    return client;
  }

  async function saveSubscription(sub){
    const json=sub.toJSON();
    const payload={
      endpoint:json.endpoint,
      p256dh:json.keys?.p256dh||'',
      auth:json.keys?.auth||'',
      user_agent:navigator.userAgent||''
    };
    const c=getClient();
    if(!c) throw new Error('Servizio notifiche non disponibile');
    const {error}=await c.from('web_push_subscriptions').insert(payload);
    if(error && error.code!=='23505') throw error;
  }

  async function ensureSubscription(requestPermission){
    if(!supported) throw new Error('Questo browser non supporta le notifiche push.');
    let permission=Notification.permission;
    if(permission==='default' && requestPermission) permission=await Notification.requestPermission();
    if(permission==='denied') throw new Error('Le notifiche sono bloccate nelle impostazioni del browser.');
    if(permission!=='granted') throw new Error('Autorizzazione alle notifiche non concessa.');

    const reg=await navigator.serviceWorker.register('/sgm-sw.js',{scope:'/'});
    await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub){
      sub=await reg.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:b64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    await saveSubscription(sub);
    localStorage.removeItem(DISMISS_KEY);
    return sub;
  }

  function installStyles(){
    if(document.getElementById('sgmPushStyles')) return;
    const s=document.createElement('style');
    s.id='sgmPushStyles';
    s.textContent=`
      .sgm-push-nav{cursor:pointer}.sgm-push-card{position:fixed;left:18px;right:18px;bottom:18px;z-index:99999;max-width:480px;margin:auto;background:#0b0b0b;color:#fff;border:1px solid #2b2b2b;border-top:3px solid #ffd400;border-radius:16px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.45);font-family:inherit}.sgm-push-card[hidden]{display:none}.sgm-push-top{display:flex;gap:13px;align-items:flex-start}.sgm-push-icon{width:44px;height:44px;border-radius:12px;background:#ffd400;color:#080808;display:grid;place-items:center;font-size:22px;flex:0 0 44px}.sgm-push-card h3{margin:0 0 5px;font-size:18px}.sgm-push-card p{margin:0;color:#bbb;line-height:1.45;font-size:13px}.sgm-push-actions{display:flex;gap:9px;margin-top:16px;flex-wrap:wrap}.sgm-push-actions button{border:0;border-radius:9px;padding:11px 14px;font-weight:900;cursor:pointer}.sgm-push-enable{background:#ffd400;color:#080808}.sgm-push-later{background:#1d1d1d;color:#ddd}.sgm-push-status{margin-top:10px;font-size:12px;font-weight:700}.sgm-push-status.ok{color:#9bd18b}.sgm-push-status.err{color:#ff9b9b}@media(min-width:720px){.sgm-push-card{left:auto;right:24px;margin:0;width:390px}}
    `;
    document.head.appendChild(s);
  }

  function installUI(){
    installStyles();
    const nav=document.querySelector('.main-nav');
    if(nav && !nav.querySelector('.sgm-push-nav')){
      const a=document.createElement('a');
      a.href='#';a.className='sgm-push-nav';a.textContent='🔔 Notifiche';
      a.addEventListener('click',e=>{e.preventDefault();openCard(true)});
      nav.appendChild(a);
    }

    if(!document.getElementById('sgmPushCard')){
      const card=document.createElement('div');
      card.id='sgmPushCard';card.className='sgm-push-card';card.hidden=true;
      card.innerHTML=`<div class="sgm-push-top"><div class="sgm-push-icon">🔔</div><div><h3>Resta aggiornato su SGM</h3><p>Ricevi news, comunicati ufficiali, Match Day, risultati e prossime partite direttamente sul tuo dispositivo.</p></div></div><div class="sgm-push-actions"><button type="button" class="sgm-push-enable">ATTIVA NOTIFICHE</button><button type="button" class="sgm-push-later">NON ORA</button></div><div class="sgm-push-status"></div>`;
      document.body.appendChild(card);
      card.querySelector('.sgm-push-enable').addEventListener('click',activate);
      card.querySelector('.sgm-push-later').addEventListener('click',()=>{
        localStorage.setItem(DISMISS_KEY,String(Date.now()));
        card.hidden=true;
      });
    }
  }

  function setStatus(text,type){
    const el=document.querySelector('#sgmPushCard .sgm-push-status');
    if(!el)return;el.textContent=text||'';el.className='sgm-push-status '+(type||'');
  }

  function openCard(manual){
    const card=document.getElementById('sgmPushCard');if(!card)return;
    card.hidden=false;setStatus('','');
    if(!supported) return setStatus('Il browser in uso non supporta le notifiche push.','err');
    if(Notification.permission==='granted') setStatus('Notifiche già attive su questo dispositivo.','ok');
    if(Notification.permission==='denied') setStatus('Notifiche bloccate: riattivale dalle impostazioni del browser.','err');
    if(manual) localStorage.removeItem(DISMISS_KEY);
  }

  async function activate(){
    const btn=document.querySelector('#sgmPushCard .sgm-push-enable');
    try{
      if(btn){btn.disabled=true;btn.textContent='ATTIVAZIONE...'}
      await ensureSubscription(true);
      setStatus('✓ Notifiche attivate su questo dispositivo.','ok');
      setTimeout(()=>{const card=document.getElementById('sgmPushCard');if(card)card.hidden=true;},1600);
    }catch(e){setStatus(e.message||String(e),'err');}
    finally{if(btn){btn.disabled=false;btn.textContent='ATTIVA NOTIFICHE'}}
  }

  async function init(){
    installUI();
    if(!supported)return;
    if(Notification.permission==='granted'){
      try{await ensureSubscription(false);}catch(_){ }
      return;
    }
    if(Notification.permission!=='default')return;
    const dismissed=Number(localStorage.getItem(DISMISS_KEY)||0);
    const sevenDays=7*24*60*60*1000;
    if(!dismissed || Date.now()-dismissed>sevenDays) setTimeout(()=>openCard(false),1800);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
