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

  function arrangeMenu(){
    const menu=document.querySelector('.main-nav');
    if(!menu) return;

    let about=menu.querySelector('a[href="chi-siamo.html"]');
    if(!about){
      about=document.createElement('a');
      about.href='chi-siamo.html';
      about.textContent='Chi siamo';
    }

    let staff=menu.querySelector('a[href="staff.html"]');
    if(!staff){
      staff=document.createElement('a');
      staff.href='staff.html';
      staff.textContent='Staff';
    }

    const contacts=menu.querySelector('a[href="contatti.html"]');

    if(contacts){
      menu.insertBefore(staff, contacts);
      menu.insertBefore(about, contacts);
    }else{
      menu.appendChild(staff);
      menu.appendChild(about);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',arrangeMenu);
  else arrangeMenu();

  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const extras=[];
  if(page==='admin.html') extras.push('admin-content.js','admin-staff.js','admin-about.js','admin-youth-staff.js');
  if(['news.html','sponsor.html','galleria.html'].includes(page)) extras.push('content-pages.js');
  if(page==='staff.html') extras.push('staff-dynamic.js');
  if(page==='' || page==='index.html') extras.push('home-news.js');
  extras.forEach((src)=>{
    const script=document.createElement('script');
    script.src=src+'?v=7';
    script.defer=true;
    document.head.appendChild(script);
  });
})();