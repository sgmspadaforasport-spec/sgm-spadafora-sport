(function () {
  const cfg = window.SGM_SUPABASE_CONFIG || {};
  const valid = cfg.url && cfg.anonKey && !cfg.url.startsWith("INSERISCI_") && !cfg.anonKey.startsWith("INSERISCI_");
  window.SGM_DB = {
    enabled:false, client:null,
    async init(){if(!valid||!window.supabase)return false;if(!this.client)this.client=window.supabase.createClient(cfg.url,cfg.anonKey);this.enabled=true;return true;},
    async getSiteData(){if(!this.enabled)throw new Error("Supabase non configurato");const{data,error}=await this.client.from("site_data").select("payload").eq("id",1).single();if(error)throw error;return data?.payload||{};},
    async saveSiteData(payload){if(!this.enabled)throw new Error("Supabase non configurato");const{error}=await this.client.from("site_data").upsert({id:1,payload,updated_at:new Date().toISOString()},{onConflict:"id"});if(error)throw error;return true;},
    async signIn(email,password){if(!this.enabled)throw new Error("Supabase non configurato");const{data,error}=await this.client.auth.signInWithPassword({email,password});if(error)throw error;return data;},
    async signOut(){if(this.enabled)await this.client.auth.signOut();},
    async getSession(){if(!this.enabled)return null;const{data}=await this.client.auth.getSession();return data?.session||null;},
    async uploadImage(file,folder="uploads"){if(!this.enabled)throw new Error("Supabase non configurato");const clean=(file.name||"image").toLowerCase().replace(/[^a-z0-9._-]+/g,"-");const path=`${folder}/${Date.now()}-${clean}`;const{error}=await this.client.storage.from(cfg.storageBucket||"sgm-media").upload(path,file,{upsert:false});if(error)throw error;const{data}=this.client.storage.from(cfg.storageBucket||"sgm-media").getPublicUrl(path);return data.publicUrl;}
  };
  function arrangeMenu(){
    const menu=document.querySelector('.main-nav');if(!menu)return;
    let about=menu.querySelector('a[href="chi-siamo.html"]');if(!about){about=document.createElement('a');about.href='chi-siamo.html';}
    let staff=menu.querySelector('a[href="staff.html"]');if(!staff){staff=document.createElement('a');staff.href='staff.html';}
    let comunicati=menu.querySelector('a[href="comunicati-ufficiali.html"]');if(!comunicati){comunicati=document.createElement('a');comunicati.href='comunicati-ufficiali.html';}
    const contacts=menu.querySelector('a[href="contatti.html"]');
    if(contacts){menu.insertBefore(comunicati,contacts);menu.insertBefore(staff,contacts);menu.insertBefore(about,contacts);menu.insertBefore(comunicati,staff);}else{menu.appendChild(comunicati);menu.appendChild(staff);menu.appendChild(about);}
    const labels={
      'index.html':'Home 🏠','':'Home 🏠','squadre.html':'Squadre 👥','calendario-risultati.html':'Calendario 🗓️','news.html':'News 📰','sponsor.html':'Sponsor 🤝','galleria.html':'Galleria 📷','sgm-tv.html':'SGM TV 🎥','palmares.html':'Palmares 🏆','comunicati-ufficiali.html':'Comunicati ufficiali 📢','staff.html':'Staff 💼','chi-siamo.html':'Chi siamo 🤝','contatti.html':'Contatti 📞'
    };
    menu.querySelectorAll('a').forEach(a=>{const href=(a.getAttribute('href')||'').split('/').pop();if(labels[href]!==undefined)a.textContent=labels[href];});
    const push=menu.querySelector('.sgm-push-nav');if(push)push.textContent='Notifiche 🔔';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrangeMenu);else arrangeMenu();
  const page=(location.pathname.split('/').pop()||'').toLowerCase();const extras=[];
  if(page==='admin.html'||page==='admin')extras.push('admin-content.js','admin-staff.js','admin-about.js','admin-youth-staff.js','admin-comunicati.js','admin-leagues.js','admin-home.js','admin-notifications.js','admin-auto-push.js','admin-calendar-details.js');
  if(['news.html','sponsor.html','galleria.html'].includes(page))extras.push('content-pages.js');
  if(['news.html','sponsor.html','galleria.html','sgm-tv.html','calendario-risultati.html','squadre.html'].includes(page))extras.push('premium-sections.js');
  if(['calcio-a-5.html','pallavolo-maschile.html','pallavolo-femminile.html','basket.html','giovanile-calcio.html'].includes(page))extras.push('team-section-premium.js');
  if(page.endsWith('-calendario.html')||page.endsWith('-classifica.html'))extras.push('league-display.js');
  if(page.endsWith('-calendario.html'))extras.push('calendar-details-display.js');
  if(page==='staff.html')extras.push('staff-dynamic.js');
  if(page===''||page==='index.html')extras.push('home-news.js','home-layout-cleanup.js','home-hero-dynamic.js','home-admin-access.js');
  if(page!=='admin.html'&&page!=='admin')extras.push('professional-footer.js','web-notifications.js');
  extras.forEach(src=>{const script=document.createElement('script');script.src=src+'?v=32';script.async=false;document.head.appendChild(script);});
})();