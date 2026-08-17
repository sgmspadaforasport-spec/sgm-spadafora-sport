(function () {
  const cfg = window.SGM_SUPABASE_CONFIG || {};

  const valid =
    cfg.url &&
    cfg.anonKey &&
    !cfg.url.startsWith("INSERISCI_") &&
    !cfg.anonKey.startsWith("INSERISCI_");

  window.SGM_DB = {
    enabled: false,
    client: null,

    async init() {
      if (!valid || !window.supabase) return false;
      this.client = window.supabase.createClient(cfg.url, cfg.anonKey);
      this.enabled = true;
      return true;
    },

    async getSiteData() {
      if (!this.enabled) throw new Error("Supabase non configurato");
      const { data, error } = await this.client.from("site_data").select("payload").eq("id", 1).single();
      if (error) throw error;
      return data?.payload || {};
    },

    async saveSiteData(payload) {
      if (!this.enabled) throw new Error("Supabase non configurato");
      const { error } = await this.client.from("site_data").upsert({id:1,payload,updated_at:new Date().toISOString()},{onConflict:"id"});
      if (error) throw error;
      return true;
    },

    async signIn(email, password) {
      if (!this.enabled) throw new Error("Supabase non configurato");
      const { data, error } = await this.client.auth.signInWithPassword({email,password});
      if (error) throw error;
      return data;
    },

    async signOut() { if (this.enabled) await this.client.auth.signOut(); },

    async getSession() {
      if (!this.enabled) return null;
      const { data } = await this.client.auth.getSession();
      return data?.session || null;
    },

    async uploadImage(file, folder = "uploads") {
      if (!this.enabled) throw new Error("Supabase non configurato");
      const clean=(file.name||"image").toLowerCase().replace(/[^a-z0-9._-]+/g,"-");
      const path=`${folder}/${Date.now()}-${clean}`;
      const { error }=await this.client.storage.from(cfg.storageBucket||"sgm-media").upload(path,file,{upsert:false});
      if(error) throw error;
      const { data }=this.client.storage.from(cfg.storageBucket||"sgm-media").getPublicUrl(path);
      return data.publicUrl;
    }
  };

  function installAboutMenuLink(){
    const menu=document.querySelector('.main-nav');
    if(!menu) return;
    let link=menu.querySelector('a[href="chi-siamo.html"]');
    if(!link){link=document.createElement('a');link.href='chi-siamo.html';link.textContent='Chi siamo';}
    const contacts=menu.querySelector('a[href="contatti.html"]');
    if(contacts) menu.insertBefore(link,contacts); else menu.appendChild(link);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installAboutMenuLink);
  else installAboutMenuLink();

  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const extras=[];
  if(page==='admin.html') extras.push('admin-content.js','admin-staff.js','admin-about.js');
  if(['news.html','sponsor.html','galleria.html'].includes(page)) extras.push('content-pages.js');
  if(page==='staff.html') extras.push('staff-dynamic.js');
  if(page==='' || page==='index.html') extras.push('home-news.js');
  extras.forEach((src)=>{
    const script=document.createElement('script');
    script.src=src+'?v=5';
    script.defer=true;
    document.head.appendChild(script);
  });
})();