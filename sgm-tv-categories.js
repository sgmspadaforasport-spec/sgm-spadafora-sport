(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const DEFAULT_CATEGORIES=['Highlights','Interviste','Salottino Giallonero','Format','Puntate'];

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function normalizeCategories(tv){
    const hadCategories=Array.isArray(tv.categories);
    tv.categories=hadCategories?tv.categories.map(x=>typeof x==='string'?{name:String(x).trim(),cover:''}:{name:String(x?.name||'').trim(),cover:x?.cover||''}).filter(x=>x.name):[];
    if(!hadCategories){
      const used=(Array.isArray(tv.videos)?tv.videos:[]).map(v=>String(v.category||'').trim()).filter(Boolean);
      [...DEFAULT_CATEGORIES,...used].forEach(name=>{
        if(!tv.categories.some(x=>x.name.toLowerCase()===name.toLowerCase())) tv.categories.push({name,cover:''});
      });
    }
    return tv.categories;
  }


  async function initPublic(){
    if(!window.SGM_DB){setTimeout(initPublic,100);return;}
    try{
      await window.SGM_DB.init();
      const data=await window.SGM_DB.getSiteData();
      const tv=data.sgm_tv||{};normalizeCategories(tv);
      const videos=Array.isArray(tv.videos)?tv.videos:[];
      const target=document.querySelector('main>.section>.container');if(!target)return;
      const cats=tv.categories;
      const css=document.createElement('style');css.textContent=`
        main>.section{background:#f4f4f4;padding-top:34px}
        .sgm-tv-shell{max-width:1180px;margin:0 auto}
        .sgm-tv-top{background:#0b0b0b;border-radius:22px;padding:24px 24px 20px;margin-bottom:24px;box-shadow:0 14px 34px rgba(0,0,0,.12);position:relative;overflow:hidden}
        .sgm-tv-top:after{content:"TV";position:absolute;right:20px;top:-24px;font-size:120px;font-weight:1000;color:rgba(255,212,0,.06);line-height:1}
        .sgm-tv-kicker{color:#ffd400;font-size:12px;font-weight:1000;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 7px}
        .sgm-tv-top h2{color:#fff;font-size:clamp(25px,4vw,40px);margin:0 0 8px;line-height:1}
        .sgm-tv-top p{color:#aaa;margin:0;max-width:700px;font-size:14px}
        .sgm-tv-all{margin-top:20px;position:relative;z-index:2}
        .sgm-tv-all .sgm-tv-filter{border:1px solid #ffd400;background:#ffd400;color:#080808;border-radius:10px;padding:10px 16px;font-weight:1000;cursor:pointer}
        .sgm-tv-categories-title{font-size:22px;color:#111;text-transform:uppercase;letter-spacing:.4px;font-weight:1000;margin:4px 0 16px;display:flex;align-items:center;gap:10px}.sgm-tv-categories-title:before{content:"";width:5px;height:25px;border-radius:4px;background:#ffd400;display:block}
        .sgm-tv-filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:0 0 28px}
        .sgm-tv-filter.category{position:relative;aspect-ratio:16/8;border:0;background:#151515 center/cover no-repeat;color:#fff;border-radius:16px;padding:0;overflow:hidden;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.13);transition:.22s;text-align:left}
        .sgm-tv-filter.category:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.82))}
        .sgm-tv-filter.category span{position:absolute;left:15px;right:15px;bottom:14px;z-index:2;font-size:17px;font-weight:1000;line-height:1.05}
        .sgm-tv-filter.category span:after{content:"  →";color:#ffd400}
        .sgm-tv-filter.category:hover,.sgm-tv-filter.category.active{transform:translateY(-3px);box-shadow:0 12px 28px rgba(0,0,0,.2);outline:3px solid #ffd400}
        .sgm-tv-filter.category.active span{color:#ffd400}
        .sgm-tv-section-head{display:flex;justify-content:space-between;align-items:end;gap:16px;margin:0 2px 18px}
        .sgm-tv-section-head h3{font-size:25px;margin:0;color:#111}
        .sgm-tv-count{font-size:12px;font-weight:900;color:#777;text-transform:uppercase;letter-spacing:.8px}
        .sgm-tv-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
        .sgm-tv-card{background:#0c0c0c;border-radius:18px;overflow:hidden;box-shadow:0 9px 24px rgba(0,0,0,.12);transition:transform .2s,box-shadow .2s}
        .sgm-tv-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(0,0,0,.18)}
        .sgm-tv-thumb{aspect-ratio:16/9;background:#1b1b1b center/cover no-repeat;position:relative}
        .sgm-tv-thumb:after{content:"▶";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:#ffd400;color:#080808;font-size:19px;padding-left:3px;box-shadow:0 7px 20px rgba(0,0,0,.35)}
        .sgm-tv-card-body{padding:16px}
        .sgm-tv-card-cat{display:inline-block;color:#ffd400;font-size:10px;font-weight:1000;letter-spacing:1px;text-transform:uppercase;margin-bottom:7px}
        .sgm-tv-card h4{color:#fff;font-size:18px;line-height:1.2;margin:0 0 8px}
        .sgm-tv-date{color:#888;font-size:12px;margin:0 0 14px}
        .sgm-tv-watch{display:inline-flex;align-items:center;gap:7px;color:#111;background:#ffd400;border-radius:10px;padding:9px 12px;text-decoration:none;font-size:12px;font-weight:1000}
        .sgm-tv-empty{grid-column:1/-1;background:#fff;border:1px solid #e1e1e1;border-radius:16px;padding:30px;text-align:center;color:#777;font-weight:800}
        @media(max-width:900px){.sgm-tv-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sgm-tv-filters{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:600px){main>.section{padding-top:20px}.sgm-tv-top{border-radius:16px;padding:20px 16px 18px}.sgm-tv-filters{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.sgm-tv-filter.category{border-radius:12px;aspect-ratio:1.35}.sgm-tv-filter.category span{font-size:14px;left:11px;bottom:11px}.sgm-tv-grid{grid-template-columns:1fr;gap:14px}.sgm-tv-section-head h3{font-size:21px}.sgm-tv-thumb:after{width:46px;height:46px}.sgm-tv-card h4{font-size:17px}}
      `;document.head.appendChild(css);
      target.innerHTML=`<div class="sgm-tv-shell"><div class="sgm-tv-top"><p class="sgm-tv-kicker">Il canale ufficiale giallonero</p><h2>Guarda SGM TV</h2><p>Highlights, interviste, format e tutte le puntate dedicate al mondo ASD SGM Spadafora Sport.</p><div class="sgm-tv-all"><button class="sgm-tv-filter active" data-cat="">▶ Tutti i video</button></div></div><p class="sgm-tv-categories-title">Esplora per categoria</p><div class="sgm-tv-filters">${cats.map(c=>`<button class="sgm-tv-filter category" data-cat="${esc(c.name)}" style="${c.cover?`background-image:url('${esc(c.cover)}')`:''}"><span>${esc(c.name)}</span></button>`).join('')}</div><div class="sgm-tv-section-head"><h3 id="sgmTvTitle">Tutti i video</h3><span class="sgm-tv-count" id="sgmTvCount"></span></div><div id="sgmTvDynamicGrid" class="sgm-tv-grid"></div></div>`;
      const grid=document.getElementById('sgmTvDynamicGrid'),title=document.getElementById('sgmTvTitle'),count=document.getElementById('sgmTvCount');
      const render=cat=>{
        const list=cat?videos.filter(v=>v.category===cat):videos;
        title.textContent=cat||'Tutti i video';
        count.textContent=list.length+' '+(list.length===1?'video':'video');
        grid.innerHTML=list.length?list.map(v=>`<article class="sgm-tv-card">${v.thumbnail?`<div class="sgm-tv-thumb" style="background-image:url('${esc(v.thumbnail)}')"></div>`:'<div class="sgm-tv-thumb"></div>'}<div class="sgm-tv-card-body"><span class="sgm-tv-card-cat">${esc(v.category||'SGM TV')}</span><h4>${esc(v.title||'Video')}</h4>${v.date?`<p class="sgm-tv-date">${esc(v.date)}</p>`:''}${v.url?`<a class="sgm-tv-watch" href="${esc(v.url)}" target="_blank" rel="noopener">▶ Guarda il video</a>`:'<span class="sgm-tv-date">Contenuto in preparazione</span>'}</div></article>`).join(''):'<div class="sgm-tv-empty">Nessun video disponibile in questa categoria.</div>';
      };
      target.querySelectorAll('.sgm-tv-filter').forEach(b=>b.onclick=()=>{target.querySelectorAll('.sgm-tv-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.cat);});
      render('');
    }catch(e){console.warn('Categorie SGM TV non disponibili',e);}
  }

  if(page==='sgm-tv.html')setTimeout(initPublic,250);
})();