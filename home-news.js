(function(){
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  async function init(){
    try{
      if(!window.SGM_DB) return;
      await window.SGM_DB.init();
      if(!window.SGM_DB.enabled) return;
      const data=await window.SGM_DB.getSiteData();
      const news=Array.isArray(data.news)?data.news:[];
      let section=document.querySelector('.home-news-preview');
      if(!section){
        section=document.createElement('section');
        section.className='home-news-preview';
        const manifesto=document.querySelector('.home-manifesto');
        if(manifesto) manifesto.insertAdjacentElement('afterend',section);
        else document.querySelector('main')?.prepend(section);
      }
      const sorted=[...news].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,3);
      section.innerHTML=`<div class="container"><div class="home-section-head"><div><p class="section-kicker yellow">DAL MONDO SGM</p><h2>Ultime news</h2></div><a href="news.html">Tutte le news →</a></div><div id="homeNewsDynamic"></div></div>`;
      const box=section.querySelector('#homeNewsDynamic');
      if(!sorted.length){box.innerHTML='<div class="home-feature-news-body"><p>Nessuna news pubblicata al momento.</p></div>';return;}
      box.innerHTML=sorted.map((n,i)=>`<article class="home-feature-news" style="margin-bottom:${i===sorted.length-1?'0':'22px'}">${n.image?`<div class="home-feature-news-image"><img src="${esc(n.image)}" alt="${esc(n.title||'News')}"></div>`:''}<div class="home-feature-news-body"><small>${esc(n.date||'')}</small><h3>${esc(n.title||'News')}</h3><p>${esc(n.excerpt||n.body||'')}</p><a class="btn btn-primary" href="news.html">Leggi la news</a></div></article>`).join('');
    }catch(e){console.warn('News Home non disponibili',e);}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();