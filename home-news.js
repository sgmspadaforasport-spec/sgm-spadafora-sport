(function(){
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  async function init(){
    try{
      if(!window.SGM_DB) return;
      await window.SGM_DB.init();
      if(!window.SGM_DB.enabled) return;
      const data=await window.SGM_DB.getSiteData();
      const news=Array.isArray(data.news)?data.news:[];
      const comunicati=Array.isArray(data.comunicati_ufficiali)?data.comunicati_ufficiali:[];

      let section=document.querySelector('.home-news-preview');
      if(!section){
        section=document.createElement('section');
        section.className='home-news-preview';
        const manifesto=document.querySelector('.home-manifesto');
        if(manifesto) manifesto.insertAdjacentElement('afterend',section);
        else document.querySelector('main')?.prepend(section);
      }

      const normalNews=[...news]
        .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))
        .map((n,i)=>({...n,_type:'news',_order:1000+i}));

      const officialNews=comunicati.map((c,i)=>({
        title:c.title||'Comunicato ufficiale',
        body:c.text||'',
        excerpt:c.text||'',
        image:c.image||'',
        date:c.date||'',
        _type:'comunicato',
        _order:i
      }));

      const combined=[...officialNews,...normalNews].slice(0,3);

      section.innerHTML=`<div class="container"><div class="home-section-head"><div><p class="section-kicker yellow">DAL MONDO SGM</p><h2>Ultime news</h2></div><a href="news.html">Tutte le news →</a></div><div id="homeNewsDynamic"></div></div>`;
      const box=section.querySelector('#homeNewsDynamic');

      if(!combined.length){
        box.innerHTML='<div class="home-feature-news-body"><p>Nessuna news pubblicata al momento.</p></div>';
        return;
      }

      box.innerHTML=combined.map((n,i)=>{
        const isOfficial=n._type==='comunicato';
        const label=isOfficial?'COMUNICATO UFFICIALE':(n.date||'NEWS');
        const href=isOfficial?'comunicati-ufficiali.html':'news.html';
        const button=isOfficial?'Leggi il comunicato':'Leggi la news';
        return `<article class="home-feature-news" style="margin-bottom:${i===combined.length-1?'0':'22px'}">${n.image?`<div class="home-feature-news-image"><img src="${esc(n.image)}" alt="${esc(n.title||'News')}">${isOfficial?'<span>COMUNICATO UFFICIALE</span>':''}</div>`:''}<div class="home-feature-news-body"><small>${esc(label)}</small><h3>${esc(n.title||'News')}</h3><p>${esc(n.excerpt||n.body||'')}</p><a class="btn btn-primary" href="${href}">${button}</a></div></article>`;
      }).join('');
    }catch(e){console.warn('News Home non disponibili',e);}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();