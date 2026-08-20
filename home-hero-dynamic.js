(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const css=document.createElement('style');css.textContent=`.home-hero.has-custom-cover .home-hero-bg{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;opacity:.48}.home-hero.has-custom-cover:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.86) 0%,rgba(0,0,0,.55) 45%,rgba(0,0,0,.22) 100%);z-index:0}.home-hero.has-custom-cover .home-hero-content,.home-hero.has-custom-cover .home-hero-logo,.home-hero.has-custom-cover .home-hero-stripe{position:relative;z-index:1}.home-hero .home-hero-custom-title{white-space:pre-line}@media(max-width:700px){.home-hero.has-custom-cover .home-hero-bg{background-position:center top!important}.home-hero.has-custom-cover:before{background:linear-gradient(180deg,rgba(0,0,0,.72),rgba(0,0,0,.84))}}`;document.head.appendChild(css);
  function apply(data){
    const h=data?.home_hero||{};const hero=document.querySelector('.home-hero');if(!hero)return;
    const bg=hero.querySelector('.home-hero-bg');const logo=hero.querySelector('.home-hero-logo');const title=hero.querySelector('h1');const subtitle=hero.querySelector('.home-hero-copy');
    if(h.image&&bg){bg.style.backgroundImage=`url("${String(h.image).replace(/"/g,'\\"')}")`;hero.classList.add('has-custom-cover');}
    else hero.classList.remove('has-custom-cover');
    if(title&&h.title){title.textContent=h.title;title.classList.add('home-hero-custom-title');}
    if(subtitle&&typeof h.subtitle==='string'&&h.subtitle.trim()) subtitle.textContent=h.subtitle;
    if(logo) logo.style.display=h.show_logo===false?'none':'';
  }
  async function init(){try{if(window.SGM_SITE_DATA){apply(window.SGM_SITE_DATA);return;}if(window.SGM_DB){await window.SGM_DB.init();const d=await window.SGM_DB.getSiteData();apply(d||{});}}catch(e){console.warn('Copertina Home non disponibile',e)}}
  document.addEventListener('sgm-data-ready',e=>apply(e.detail||{}));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();