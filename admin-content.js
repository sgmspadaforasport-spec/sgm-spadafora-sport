(function(){
  function waitForAdmin(){
    if(typeof openPanel!=='function' || typeof openModal!=='function' || !document.querySelector('.admin-nav')){
      return setTimeout(waitForAdmin,50);
    }
    installUI();
    waitForData();
  }

  function installUI(){
    if(document.getElementById('newsAdmin')) return;
    const nav=document.querySelector('.admin-nav');
    const before=nav.querySelector('[data-panel="tv"]') || nav.querySelector('[data-panel="contacts"]');
    const buttons=[
      ['newsAdmin','📰 News'],
      ['sponsorsAdmin','🤝 Sponsor'],
      ['galleryAdmin','📷 Galleria']
    ];
    buttons.forEach(([id,label])=>{
      const b=document.createElement('button');
      b.className='nav-btn';b.dataset.panel=id;b.textContent=label;
      b.onclick=()=>openPanel(id);
      nav.insertBefore(b,before);
    });

    const main=document.querySelector('.admin-layout main');
    const sticky=main.querySelector('.sticky-save');
    const html=`
      <section class="admin-panel" id="newsAdmin">
        <div class="panel-head"><div><h2>News</h2><p>Crea, modifica ed elimina le notizie pubblicate sul sito.</p></div><button class="btn btn-primary" id="addNewsAdmin">+ Aggiungi news</button></div>
        <div id="newsAdminList" class="item-list"></div>
      </section>
      <section class="admin-panel" id="sponsorsAdmin">
        <div class="panel-head"><div><h2>Sponsor</h2><p>Gestisci nomi, loghi e collegamenti degli sponsor.</p></div><button class="btn btn-primary" id="addSponsorAdmin">+ Aggiungi sponsor</button></div>
        <div id="sponsorsAdminList" class="item-list"></div>
      </section>
      <section class="admin-panel" id="galleryAdmin">
        <div class="panel-head"><div><h2>Galleria</h2><p>Carica e gestisci le fotografie della galleria del sito.</p></div><button class="btn btn-primary" id="addGalleryAdmin">+ Aggiungi foto</button></div>
        <div id="galleryAdminList" class="item-list"></div>
      </section>`;
    const box=document.createElement('div');box.innerHTML=html;
    [...box.children].forEach(el=>main.insertBefore(el,sticky));

    document.getElementById('addNewsAdmin').onclick=()=>editNews();
    document.getElementById('addSponsorAdmin').onclick=()=>editSponsor();
    document.getElementById('addGalleryAdmin').onclick=()=>editGallery();

    const dash=document.querySelector('#dashboard .item-list');
    if(dash){
      dash.insertAdjacentHTML('beforeend',`
        <div class="item-card"><div><h3>📰 News</h3><p>Pubblica e modifica le notizie del sito.</p></div><button class="btn btn-dark btn-small" id="jumpNewsAdmin">Apri</button></div>
        <div class="item-card"><div><h3>🤝 Sponsor</h3><p>Aggiungi e modifica sponsor e loghi.</p></div><button class="btn btn-dark btn-small" id="jumpSponsorsAdmin">Apri</button></div>
        <div class="item-card"><div><h3>📷 Galleria</h3><p>Carica e gestisci le foto della galleria.</p></div><button class="btn btn-dark btn-small" id="jumpGalleryAdmin">Apri</button></div>`);
      document.getElementById('jumpNewsAdmin').onclick=()=>openPanel('newsAdmin');
      document.getElementById('jumpSponsorsAdmin').onclick=()=>openPanel('sponsorsAdmin');
      document.getElementById('jumpGalleryAdmin').onclick=()=>openPanel('galleryAdmin');
    }
  }

  function waitForData(){
    if(typeof data==='undefined' || !data) return setTimeout(waitForData,100);
    ensureContentData();renderContentAdmin();
  }

  function ensureContentData(){
    data.news=Array.isArray(data.news)?data.news:[];
    data.sponsors=Array.isArray(data.sponsors)?data.sponsors:[];
    data.gallery=Array.isArray(data.gallery)?data.gallery:[];
  }
  window.SGM_CONTENT_ADMIN_ENSURE=ensureContentData;

  function note(){ if(typeof status==='function') status('Modifica pronta. Premi “Salva online” per pubblicarla.'); }

  function renderContentAdmin(){renderNews();renderSponsors();renderGallery();}
  window.SGM_CONTENT_ADMIN_RENDER=renderContentAdmin;

  function renderNews(){
    ensureContentData();const list=document.getElementById('newsAdminList');if(!list)return;
    if(!data.news.length){list.innerHTML='<div class="empty">Nessuna news inserita.</div>';return;}
    list.innerHTML=data.news.map((n,i)=>`<div class="item-card"><div><h3>${esc(n.title||'News')}</h3><p>${esc(n.date||'')}<br>${esc(n.excerpt||'')}</p></div><div class="item-actions"><button class="btn btn-dark btn-small edit-news-admin" data-i="${i}">Modifica</button><button class="btn btn-danger btn-small del-news-admin" data-i="${i}">Elimina</button></div></div>`).join('');
    list.querySelectorAll('.edit-news-admin').forEach(b=>b.onclick=()=>editNews(+b.dataset.i));
    list.querySelectorAll('.del-news-admin').forEach(b=>b.onclick=()=>{data.news.splice(+b.dataset.i,1);renderNews();note();});
  }

  function editNews(i=null){
    ensureContentData();const n=i===null?{title:'',date:new Date().toISOString().slice(0,10),excerpt:'',body:'',image:''}:data.news[i];
    openModal(i===null?'Aggiungi news':'Modifica news',`<div class="fields">
      <div class="field full"><label>Titolo</label><input id="cnTitle" value="${esc(n.title||'')}"></div>
      <div class="field"><label>Data</label><input id="cnDate" type="date" value="${esc(n.date||'')}"></div>
      <div class="field full"><label>Testo breve / anteprima</label><textarea id="cnExcerpt">${esc(n.excerpt||'')}</textarea></div>
      <div class="field full"><label>Testo completo</label><textarea id="cnBody" style="min-height:220px">${esc(n.body||'')}</textarea></div>
      <div class="field full"><label>Immagine</label><input id="cnImage" value="${esc(n.image||'')}" placeholder="URL immagine"><input id="cnImageFile" type="file" accept="image/jpeg,image/png,image/webp"><small>Puoi caricare una nuova immagine oppure lasciare quella esistente.</small></div>
      <div class="field full"><label style="display:flex;align-items:center;gap:10px;cursor:pointer"><input id="cnNotify" type="checkbox" style="width:18px;height:18px;accent-color:#ffd400"> 🔔 Invia anche una notifica</label><small>Se selezionato, dopo aver creato la news si aprirà la sezione Notifiche già compilata. Potrai scegliere App, Sito o entrambi e confermare l'invio.</small></div>
    </div>`,async()=>{
      const obj={title:$('cnTitle').value.trim(),date:$('cnDate').value,excerpt:$('cnExcerpt').value.trim(),body:$('cnBody').value.trim(),image:$('cnImage').value.trim()};
      const file=$('cnImageFile').files[0];
      try{if(file)obj.image=await window.SGM_DB.uploadImage(file,'news');const notify=i===null&&$('cnNotify')?.checked;if(i===null)data.news.unshift(obj);else data.news[i]=obj;renderNews();try{await window.SGM_DB.saveSiteData(data);if(typeof status==='function')status('✓ News pubblicata online.');}catch(saveErr){if(typeof status==='function')status('News aggiunta ma salvataggio online non riuscito: '+saveErr.message,true);throw saveErr;}if(notify){setTimeout(()=>{if(typeof openPanel==='function')openPanel('notificationsAdmin');const title=document.getElementById('pushTitle'),body=document.getElementById('pushBody'),target=document.getElementById('pushTarget');if(title)title.value='📰 '+(obj.title||'Nuova news');if(body)body.value=obj.excerpt||'È online una nuova notizia dal mondo SGM.';if(target)target.value='news.html';},80);}}catch(e){alert('Errore caricamento immagine: '+e.message);}
    });
  }

  function renderSponsors(){
    ensureContentData();const list=document.getElementById('sponsorsAdminList');if(!list)return;
    if(!data.sponsors.length){list.innerHTML='<div class="empty">Nessuno sponsor inserito.</div>';return;}
    list.innerHTML=data.sponsors.map((s,i)=>`<div class="item-card"><div><h3>${esc(s.name||'Sponsor')}</h3><p>${esc(s.url||'')}${s.image?'<br>Logo inserito':''}</p></div><div class="item-actions"><button class="btn btn-dark btn-small edit-sponsor-admin" data-i="${i}">Modifica</button><button class="btn btn-danger btn-small del-sponsor-admin" data-i="${i}">Elimina</button></div></div>`).join('');
    list.querySelectorAll('.edit-sponsor-admin').forEach(b=>b.onclick=()=>editSponsor(+b.dataset.i));
    list.querySelectorAll('.del-sponsor-admin').forEach(b=>b.onclick=()=>{data.sponsors.splice(+b.dataset.i,1);renderSponsors();note();});
  }

  function editSponsor(i=null){
    ensureContentData();const s=i===null?{name:'',image:'',url:''}:data.sponsors[i];
    openModal(i===null?'Aggiungi sponsor':'Modifica sponsor',`<div class="fields">
      <div class="field full"><label>Nome sponsor</label><input id="csName" value="${esc(s.name||'')}"></div>
      <div class="field full"><label>Sito / collegamento (facoltativo)</label><input id="csUrl" value="${esc(s.url||'')}" placeholder="https://..."></div>
      <div class="field full"><label>Logo</label><input id="csImage" value="${esc(s.image||'')}" placeholder="URL logo"><input id="csImageFile" type="file" accept="image/jpeg,image/png,image/webp"><small>Carica il logo dello sponsor.</small></div>
    </div>`,async()=>{
      const obj={name:$('csName').value.trim(),url:$('csUrl').value.trim(),image:$('csImage').value.trim()};
      const file=$('csImageFile').files[0];
      try{if(file)obj.image=await window.SGM_DB.uploadImage(file,'sponsor');if(i===null)data.sponsors.push(obj);else data.sponsors[i]=obj;renderSponsors();note();}catch(e){alert('Errore caricamento logo: '+e.message);}
    });
  }

  function renderGallery(){
    ensureContentData();const list=document.getElementById('galleryAdminList');if(!list)return;
    if(!data.gallery.length){list.innerHTML='<div class="empty">Nessuna foto inserita.</div>';return;}
    list.innerHTML=data.gallery.map((g,i)=>`<div class="item-card"><div><h3>${esc(g.title||'Foto')}</h3><p>${esc(g.date||'')} · ${esc(g.caption||'')}</p></div><div class="item-actions"><button class="btn btn-dark btn-small edit-gallery-admin" data-i="${i}">Modifica</button><button class="btn btn-danger btn-small del-gallery-admin" data-i="${i}">Elimina</button></div></div>`).join('');
    list.querySelectorAll('.edit-gallery-admin').forEach(b=>b.onclick=()=>editGallery(+b.dataset.i));
    list.querySelectorAll('.del-gallery-admin').forEach(b=>b.onclick=()=>{data.gallery.splice(+b.dataset.i,1);renderGallery();note();});
  }

  function editGallery(i=null){
    ensureContentData();const g=i===null?{title:'',caption:'',date:new Date().toISOString().slice(0,10),image:''}:data.gallery[i];
    openModal(i===null?'Aggiungi foto':'Modifica foto',`<div class="fields">
      <div class="field full"><label>Titolo (facoltativo)</label><input id="cgTitle" value="${esc(g.title||'')}"></div>
      <div class="field"><label>Data</label><input id="cgDate" type="date" value="${esc(g.date||'')}"></div>
      <div class="field full"><label>Didascalia</label><textarea id="cgCaption">${esc(g.caption||'')}</textarea></div>
      <div class="field full"><label>Fotografia</label><input id="cgImage" value="${esc(g.image||'')}" placeholder="URL immagine"><input id="cgImageFile" type="file" accept="image/jpeg,image/png,image/webp"><small>Carica la fotografia da pubblicare.</small></div>
    </div>`,async()=>{
      const obj={title:$('cgTitle').value.trim(),date:$('cgDate').value,caption:$('cgCaption').value.trim(),image:$('cgImage').value.trim()};
      const file=$('cgImageFile').files[0];
      try{if(file)obj.image=await window.SGM_DB.uploadImage(file,'galleria');if(i===null)data.gallery.unshift(obj);else data.gallery[i]=obj;renderGallery();note();}catch(e){alert('Errore caricamento fotografia: '+e.message);}
    });
  }

  waitForAdmin();
})();