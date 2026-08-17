(function(){
  function waitForAdmin(){
    if(typeof openPanel!=='function' || typeof openModal!=='function' || !document.querySelector('.admin-nav')) return setTimeout(waitForAdmin,60);
    installUI();
    waitForData();
  }

  function installUI(){
    if(document.getElementById('comunicatiAdmin')) return;
    const nav=document.querySelector('.admin-nav');
    const staffBtn=[...nav.querySelectorAll('.nav-btn')].find(b=>/staff/i.test(b.textContent||''));
    const before=staffBtn || nav.querySelector('[data-panel="contacts"]') || nav.lastElementChild;
    const btn=document.createElement('button');
    btn.className='nav-btn';
    btn.dataset.panel='comunicatiAdmin';
    btn.textContent='📣 Comunicati ufficiali';
    btn.onclick=()=>openPanel('comunicatiAdmin');
    nav.insertBefore(btn,before);

    const main=document.querySelector('.admin-layout main');
    const sticky=main.querySelector('.sticky-save');
    const section=document.createElement('section');
    section.className='admin-panel';
    section.id='comunicatiAdmin';
    section.innerHTML=`
      <div class="panel-head">
        <div><h2>Comunicati ufficiali</h2><p>Crea, modifica ed elimina i comunicati ufficiali pubblicati sul sito.</p></div>
        <button class="btn btn-primary" id="addComunicatoAdmin">+ Aggiungi comunicato</button>
      </div>
      <div id="comunicatiAdminList" class="item-list"></div>`;
    main.insertBefore(section,sticky);
    document.getElementById('addComunicatoAdmin').onclick=()=>editComunicato();
  }

  function waitForData(){
    if(typeof data==='undefined' || !data) return setTimeout(waitForData,100);
    ensureData();
    render();
  }

  function ensureData(){
    data.comunicati_ufficiali=Array.isArray(data.comunicati_ufficiali)?data.comunicati_ufficiali:[];
  }

  function render(){
    ensureData();
    const list=document.getElementById('comunicatiAdminList');
    if(!list) return;
    if(!data.comunicati_ufficiali.length){
      list.innerHTML='<div class="empty">Nessun comunicato ufficiale inserito.</div>';
      return;
    }
    list.innerHTML=data.comunicati_ufficiali.map((c,i)=>`
      <div class="item-card">
        <div><h3>${esc(c.title||'Comunicato ufficiale')}</h3><p>${esc((c.text||'').slice(0,180))}${(c.text||'').length>180?'…':''}${c.image?'<br>Immagine inserita':''}</p></div>
        <div class="item-actions"><button class="btn btn-dark btn-small edit-comunicato" data-i="${i}">Modifica</button><button class="btn btn-danger btn-small del-comunicato" data-i="${i}">Elimina</button></div>
      </div>`).join('');
    list.querySelectorAll('.edit-comunicato').forEach(b=>b.onclick=()=>editComunicato(+b.dataset.i));
    list.querySelectorAll('.del-comunicato').forEach(b=>b.onclick=()=>{data.comunicati_ufficiali.splice(+b.dataset.i,1);render();note();});
  }

  function note(){if(typeof status==='function')status('Modifica pronta. Premi “Salva online” per pubblicarla.');}

  function editComunicato(i=null){
    ensureData();
    const c=i===null?{title:'',text:'',image:''}:data.comunicati_ufficiali[i];
    openModal(i===null?'Aggiungi comunicato ufficiale':'Modifica comunicato ufficiale',`
      <div class="fields">
        <div class="field full"><label>Titolo</label><input id="coTitle" value="${esc(c.title||'')}"></div>
        <div class="field full"><label>Testo</label><textarea id="coText" style="min-height:240px">${esc(c.text||'')}</textarea></div>
        <div class="field full"><label>Immagine</label><input id="coImage" value="${esc(c.image||'')}" placeholder="URL immagine"><input id="coImageFile" type="file" accept="image/jpeg,image/png,image/webp"><small>Carica l'immagine del comunicato oppure lascia quella esistente.</small></div>
      </div>`,async()=>{
        const obj={title:$('coTitle').value.trim(),text:$('coText').value.trim(),image:$('coImage').value.trim()};
        const file=$('coImageFile').files[0];
        try{
          if(file)obj.image=await window.SGM_DB.uploadImage(file,'comunicati');
          if(i===null)data.comunicati_ufficiali.unshift(obj);else data.comunicati_ufficiali[i]=obj;
          render();note();
        }catch(e){alert('Errore caricamento immagine: '+e.message);}
      });
  }

  window.SGM_COMUNICATI_RENDER=render;
  waitForAdmin();
})();