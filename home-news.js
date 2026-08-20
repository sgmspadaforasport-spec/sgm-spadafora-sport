(function(){
  const MAX_HOME_NEWS=3;
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt',"'":'&#39;','"':'&quot;'}[c]));

  function removeHomeUtilityBlocks(){
    document.querySelectorAll('.home-quick-links, .home-contact-footer').forEach(el=>el.remove());
  }

  function installStyle(){
    if(document.getElementById('homeNewsCompactStyle')) return;
    const style=document.createElement('style');
    style.id='homeNewsCompactStyle';
    style.textContent=`
      .home-news-preview{padding:52px 0}
      #homeNewsDynamic{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
      #homeNewsDynamic .home-feature-news{display:flex;flex-direction:column;margin:0!important;min-width:0;height:100%;border-radius:16px;overflow:hidden}
      #homeNewsDynamic .home-feature-news-image{height:170px;min-height:170px;overflow:hidden;position:relative}
      #homeNewsDynamic .home-feature-news-image img{width:100%;height:100%;object-fit:cover;display:block}
      #homeNewsDynamic .home-feature-news-image span{position:absolute;left:12px;bottom:12px;padding:6px 9px;border-radius:999px;font-size:9px;font-weight:900;letter-spacing:.45px}
      #homeNewsDynamic .home-feature-news-body{padding:18px;display:flex;flex-direction:column;align-items:flex-start;flex:1}
      #homeNewsDynamic .home-feature-news-body small{font-size:10px;font-weight:900;letter-spacing:.45px}
      #homeNewsDynamic .home-feature-news-body h3{font-size:21px;line-height:1.08;margin:8px 0 10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      #homeNewsDynamic .home-feature-news-body p{font-size:13px;line-height:1.45;margin:0 0 16px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      #homeNewsDynamic .home-feature-news-body .btn{margin-top:auto;padding:10px 13px;font-size:11px}
      @media(max-width:900px){#homeNewsDynamic{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:620px){.home-news-preview{padding:42px 0}#homeNewsDynamic{display:flex;overflow-x:auto;gap:14px;padding-bottom:6px;scroll-snap-type:x mandatory}#homeNewsDynamic .home-feature-news{flex:0 0 84%;scroll-snap-align:start}#homeNewsDynamic .home-feature-news-image{height:150px;min-height:150px}}
    `;
    document.head.appendChild(style);
  }

  async function init(){
    removeHomeUtilityBlocks();
    try{
      installStyle();
      if(!window.SGM_DB) return;
      await window.SGM_DB.init();
      if(!window.SGM_DB.enabled) return;
      const data=await window.SGM_DB.getSiteData();
      const news=Array.isArray(data.news)?data.news:[];
      const comunicati=Array.isArray(data.comunicati_ufficiali)?data.comunicati_ufficiali:[];
      const sections=[...document.querySelectorAll('.home-news-preview')];
      let section=sections[0];
      sections.slice(1).forEach(el=>el.remove());
      if(!section){section=document.createElement('section');section.className='home-news-preview';const manifesto=document.querySelector('.home-manifesto');if(manifesto) manifesto.insertAdjacentElement('afterend',section);else document.querySelector('main')?.prepend(section);}
      const normalNews=news.map((n,i)=>({...n,_type:'news',_sequence:100000+i}));
      const officialNews=comunicati.map((c,i)=>({title:c.title||'Comunicato ufficiale',body:c.text||'',excerpt:c.text||'',image:c.image||'',date:c.date||c.created_at||'',_type:'comunicato',_sequence:i}));
      const timestamp=item=>{const raw=item.date||item.created_at||item.updated_at||'';const t=raw?Date.parse(raw):NaN;return Number.isFinite(t)?t:null;};
      const combined=[...officialNews,...normalNews].sort((a,b)=>{const ta=timestamp(a),tb=timestamp(b);if(ta!==null&&tb!==null&&ta!==tb)return tb-ta;if(ta!==null&&tb===null)return -1;if(ta===null&&tb!==null)return 1;return a._sequence-b._sequence;}).slice(0,MAX_HOME_NEWS);
      section.innerHTML=`<div class="container"><div class="home-section-head"><div><p class="section-kicker yellow">DAL MONDO SGM</p><h2>Ultime news</h2></div><a href="news.html">Tutte le news →</a></div><div id="homeNewsDynamic"></div></div>`;
      const box=section.querySelector('#homeNewsDynamic');
      if(!combined.length){box.style.display='block';box.innerHTML='<div class="home-feature-news-body"><p>Nessuna news pubblicata al momento.</p></div>';return;}
      box.innerHTML=combined.map(n=>{const isOfficial=n._type==='comunicato';const label=isOfficial?'COMUNICATO UFFICIALE':(n.date||'NEWS');const href=isOfficial?'comunicati-ufficiali.html':'news.html';const button=isOfficial?'Leggi il comunicato':'Leggi la news';return `<article class="home-feature-news">${n.image?`<div class="home-feature-news-image"><img src="${esc(n.image)}" alt="${esc(n.title||'News')}">${isOfficial?'<span>COMUNICATO UFFICIALE</span>':''}</div>`:''}<div class="home-feature-news-body"><small>${esc(label)}</small><h3>${esc(n.title||'News')}</h3><p>${esc(n.excerpt||n.body||'')}</p><a class="btn btn-primary" href="${href}">${button}</a></div></article>`;}).join('');
    }catch(e){console.warn('News Home non disponibili',e);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();