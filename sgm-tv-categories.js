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
        .sgm-tv-filters{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:24px}
        .sgm-tv-filter{border:1px solid #d6d6d6;background:#fff;color:#111;border-radius:999px;padding:10px 14px;font-weight:900;cursor:pointer}
        .sgm-tv-filter.active{background:#111;color:#ffd400;border-color:#111}
      `;document.head.appendChild(css);
      target.innerHTML=`<div class="sgm-tv-filters"><button class="sgm-tv-filter active" data-cat="">Tutti</button>${cats.map(c=>`<button class="sgm-tv-filter" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div><div id="sgmTvDynamicGrid" class="premium-tv-grid"></div>`;
      const grid=document.getElementById('sgmTvDynamicGrid');
      const render=cat=>{
        const list=cat?videos.filter(v=>v.category===cat):videos;
        grid.innerHTML=list.length?list.map(v=>`<article class="premium-card">${v.thumbnail?`<div class="premium-video-thumb" style="background-image:url('${esc(v.thumbnail)}')"></div>`:'<div class="premium-video-thumb"></div>'}<div class="premium-head"><span class="premium-pill">${esc(v.category||'SGM TV')}</span><h2>${esc(v.title||'Video')}</h2>${v.date?`<p class="premium-sub">${esc(v.date)}</p>`:''}</div><div class="premium-body">${v.url?`<a class="premium-video-link" href="${esc(v.url)}" target="_blank" rel="noopener">Guarda il video →</a>`:'Contenuto in preparazione.'}</div></article>`).join(''):'<div class="premium-empty">Nessun video in questa categoria.</div>';
      };
      target.querySelectorAll('.sgm-tv-filter').forEach(b=>b.onclick=()=>{target.querySelectorAll('.sgm-tv-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.cat);});
      render('');
    }catch(e){console.warn('Categorie SGM TV non disponibili',e);}
  }

  if(page==='admin.html'||page==='admin')initAdmin();
  if(page==='sgm-tv.html')setTimeout(initPublic,250);
})();