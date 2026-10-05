(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const DEFAULT_CATEGORIES=['Highlights','Interviste','Salottino Giallonero','Format','Puntate'];

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function normalizeCategories(tv){
    const hadCategories=Array.isArray(tv.categories);
    tv.categories=hadCategories?tv.categories.map(x=>String(x||'').trim()).filter(Boolean):[];
    if(!hadCategories){
      const used=(Array.isArray(tv.videos)?tv.videos:[]).map(v=>String(v.category||'').trim()).filter(Boolean);
      [...DEFAULT_CATEGORIES,...used].forEach(name=>{
        if(!tv.categories.some(x=>String(x).toLowerCase()===name.toLowerCase())) tv.categories.push(name);
      });
    }
    return tv.categories;
  }

  function initAdmin(){
    if(typeof ensureData!=='function'||typeof data==='undefined'||!data){setTimeout(initAdmin,100);return;}
    ensureData();
    normalizeCategories(data.sgm_tv);

    const videoList=document.getElementById('videoList');
    if(!videoList)return;
    let box=document.getElementById('tvCategoriesManager');
    if(!box){
      box=document.createElement('div');
      box.id='tvCategoriesManager';
      box.style.margin='18px 0 22px';
      videoList.parentNode.insertBefore(box,videoList);
    }

    window.renderTVCategories=function(){
      normalizeCategories(data.sgm_tv);
      box.innerHTML=`<div style="border:1px solid #333;border-radius:12px;padding:16px;background:#0b0b0b">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">
          <div><strong style="font-size:15px">Categorie SGM TV</strong><div style="font-size:10px;color:#999;margin-top:4px">Aggiungi o elimina le categorie disponibili per i video.</div></div>
          <button class="btn btn-primary btn-small" id="addTvCategory">+ Aggiungi categoria</button>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">${data.sgm_tv.categories.map((c,i)=>`<span style="display:inline-flex;align-items:center;gap:7px;background:#171717;border:1px solid #333;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:800">${esc(c)} <button data-i="${i}" class="del-tv-category" title="Elimina" style="border:0;background:transparent;color:#ff8b8b;font-weight:900;cursor:pointer">×</button></span>`).join('')}</div>
      </div>`;
      document.getElementById('addTvCategory').onclick=()=>{
        openModal('Aggiungi categoria',`<div class="field full"><label>Nome categoria</label><input id="tvCategoryName" placeholder="Es. Dietro le quinte"></div>`,()=>{
          const name=document.getElementById('tvCategoryName').value.trim();
          if(!name)return;
          if(data.sgm_tv.categories.some(x=>x.toLowerCase()===name.toLowerCase())){alert('Questa categoria esiste già.');return;}
          data.sgm_tv.categories.push(name);renderTVCategories();
        });
      };
      box.querySelectorAll('.del-tv-category').forEach(btn=>btn.onclick=()=>{
        const i=+btn.dataset.i, name=data.sgm_tv.categories[i];
        const count=data.sgm_tv.videos.filter(v=>v.category===name).length;
        if(count && !confirm(`La categoria "${name}" contiene ${count} video. I video resteranno pubblicati ma senza una categoria valida. Vuoi eliminarla?`))return;
        data.sgm_tv.categories.splice(i,1);renderTVCategories();
      });
    };

    window.editVideo=function(i=null){
      normalizeCategories(data.sgm_tv);
      const fallback=data.sgm_tv.categories[0]||'SGM TV';
      const v=i===null?{title:'',category:fallback,date:'',url:'',thumbnail:''}:data.sgm_tv.videos[i];
      const cats=[...data.sgm_tv.categories];
      if(v.category&&!cats.includes(v.category))cats.push(v.category);
      openModal(i===null?'Aggiungi video':'Modifica video',`
       <div class="fields">
       <div class="field full"><label>Titolo</label><input id="vTitle" value="${esc(v.title)}"></div>
       <div class="field"><label>Categoria SGM TV</label><select id="vCategory">${cats.map(x=>`<option value="${esc(x)}" ${x===v.category?'selected':''}>${esc(x)}</option>`).join('')}</select></div>
       <div class="field"><label>Data</label><input id="vDate" value="${esc(v.date)}"></div>
       <div class="field full"><label>Link video</label><input id="vUrl" value="${esc(v.url)}"></div>
       <div class="field full"><label>Copertina / immagine (percorso)</label><input id="vThumb" value="${esc(v.thumbnail)}"></div></div>`,
       ()=>{
         const obj={title:document.getElementById('vTitle').value.trim(),category:document.getElementById('vCategory').value,date:document.getElementById('vDate').value.trim(),url:document.getElementById('vUrl').value.trim(),thumbnail:document.getElementById('vThumb').value.trim()};
         if(i===null)data.sgm_tv.videos.unshift(obj);else data.sgm_tv.videos[i]=obj;
         renderVideos();renderTVCategories();
       });
    };
    const add=document.getElementById('addVideo');if(add)add.onclick=()=>window.editVideo();
    window.renderTVCategories();
    if(typeof renderVideos==='function')renderVideos();
  }

  async function initPublic(){
    if(!window.SGM_DB){setTimeout(initPublic,100);return;}
    try{
      await window.SGM_DB.init();
      const data=await window.SGM_DB.getSiteData();
      const tv=data.sgm_tv||{};normalizeCategories(tv);
      const videos=Array.isArray(tv.videos)?tv.videos:[];
      const target=document.querySelector('main>.section>.container');if(!target)return;
      const cats=tv.categories.filter(c=>videos.some(v=>v.category===c));
      const css=document.createElement('style');css.textContent=`
        main>.section{background:#f4f4f4;padding-top:34px}
        .sgm-tv-shell{max-width:1180px;margin:0 auto}
        .sgm-tv-top{background:#0b0b0b;border-radius:22px;padding:24px 24px 20px;margin-bottom:24px;box-shadow:0 14px 34px rgba(0,0,0,.12);position:relative;overflow:hidden}
        .sgm-tv-top:after{content:"TV";position:absolute;right:20px;top:-24px;font-size:120px;font-weight:1000;color:rgba(255,212,0,.06);line-height:1}
        .sgm-tv-kicker{color:#ffd400;font-size:12px;font-weight:1000;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 7px}
        .sgm-tv-top h2{color:#fff;font-size:clamp(25px,4vw,40px);margin:0 0 8px;line-height:1}
        .sgm-tv-top p{color:#aaa;margin:0;max-width:700px;font-size:14px}
        .sgm-tv-filters{display:flex;gap:9px;overflow-x:auto;padding:4px 2px 12px;margin:20px -2px 0;scrollbar-width:none;position:relative;z-index:2}
        .sgm-tv-filters::-webkit-scrollbar{display:none}
        .sgm-tv-filter{flex:0 0 auto;border:1px solid #343434;background:#171717;color:#ddd;border-radius:999px;padding:10px 15px;font-weight:900;cursor:pointer;transition:.2s}
        .sgm-tv-filter:hover,.sgm-tv-filter.active{background:#ffd400;color:#050505;border-color:#ffd400}
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
        @media(max-width:900px){.sgm-tv-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:600px){main>.section{padding-top:20px}.sgm-tv-top{border-radius:16px;padding:20px 16px 14px}.sgm-tv-grid{grid-template-columns:1fr;gap:14px}.sgm-tv-section-head h3{font-size:21px}.sgm-tv-thumb:after{width:46px;height:46px}.sgm-tv-card h4{font-size:17px}}
      `;document.head.appendChild(css);
      target.innerHTML=`<div class="sgm-tv-shell"><div class="sgm-tv-top"><p class="sgm-tv-kicker">Il canale ufficiale giallonero</p><h2>Guarda SGM TV</h2><p>Highlights, interviste, format e tutte le puntate dedicate al mondo ASD SGM Spadafora Sport.</p><div class="sgm-tv-filters"><button class="sgm-tv-filter active" data-cat="">Tutti i video</button>${cats.map(c=>`<button class="sgm-tv-filter" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div></div><div class="sgm-tv-section-head"><h3 id="sgmTvTitle">Tutti i video</h3><span class="sgm-tv-count" id="sgmTvCount"></span></div><div id="sgmTvDynamicGrid" class="sgm-tv-grid"></div></div>`;
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

  if(page==='admin.html'||page==='admin')initAdmin();
  if(page==='sgm-tv.html')setTimeout(initPublic,250);
})();