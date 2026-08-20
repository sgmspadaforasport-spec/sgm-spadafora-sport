(function(){
  const css=document.createElement('style');
  css.textContent=`
    .home-hero{position:relative;overflow:hidden}
    .home-hero.has-custom-cover .home-hero-bg{position:absolute;inset:0;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;opacity:1!important;z-index:0}
    .home-hero.has-custom-cover:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.82) 0%,rgba(0,0,0,.54) 48%,rgba(0,0,0,.28) 100%);z-index:1;pointer-events:none}
    .home-hero.has-custom-cover .home-hero-content,.home-hero.has-custom-cover .home-hero-logo,.home-hero.has-custom-cover .home-hero-stripe{position:relative;z-index:2}
    .home-hero .home-hero-custom-title{white-space:pre-line}
    @media(max-width:700px){.home-hero.has-custom-cover .home-hero-bg{background-position:center!important}.home-hero.has-custom-cover:before{background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.82))}}
  `;
  document.head.appendChild(css);

  function apply(data){
    const h=data&&data.home_hero?data.home_hero:{};
    const hero=document.querySelector('.home-hero');if(!hero)return;
    const bg=hero.querySelector('.home-hero-bg');
    const logo=hero.querySelector('.home-hero-logo');
    const title=hero.querySelector('h1');
    const subtitle=hero.querySelector('.home-hero-copy');
    if(bg){
      if(h.image){bg.style.setProperty('background-image',`url("${String(h.image).replace(/"/g,'\\"')}")`,'important');hero.classList.add('has-custom-cover');}
      else{bg.style.removeProperty('background-image');hero.classList.remove('has-custom-cover');}
    }
    if(title&&typeof h.title==='string'&&h.title.trim()){title.textContent=h.title;title.classList.add('home-hero-custom-title');}
    if(subtitle&&typeof h.subtitle==='string')subtitle.textContent=h.subtitle;
    if(logo)logo.style.display=h.show_logo===false?'none':'';
  }

  async function refresh(){
    try{
      if(!window.SGM_DB)return;
      await window.SGM_DB.init();
      const fresh=await window.SGM_DB.getSiteData();
      window.SGM_SITE_DATA=fresh||{};
      apply(fresh||{});
    }catch(e){console.warn('Copertina Home non disponibile',e);}
  }

  document.addEventListener('sgm-data-ready',e=>apply(e.detail||{}));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
})();