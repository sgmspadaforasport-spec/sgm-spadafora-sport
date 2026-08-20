(function(){
  function wait(){
    if(typeof openPanel!=='function'||typeof openModal!=='function'||!document.querySelector('.admin-nav')||typeof data==='undefined') return setTimeout(wait,80);
    install();
  }
  function install(){
    if(document.getElementById('homeHeroAdmin')) return;
    data.home_hero=data.home_hero||{image:'',title:'UNA SOLA\nPASSIONE.\nSGM.',subtitle:'Calcio a 5, pallavolo, basket e settore giovanile. Una società, una comunità, una famiglia giallonera.',show_logo:true};
    const nav=document.querySelector('.admin-nav');
    const btn=document.createElement('button');btn.className='nav-btn';btn.dataset.panel='homeHeroAdmin';btn.textContent='🏠 Home / Copertina';btn.onclick=()=>{openPanel('homeHeroAdmin');load();};
    nav.insertBefore(btn,nav.firstElementChild?.nextSibling||null);
    const main=document.querySelector('.admin-layout main');const sticky=main.querySelector('.sticky-save');
    const sec=document.createElement('section');sec.className='admin-panel';sec.id='homeHeroAdmin';sec.innerHTML=`<div class="panel-head"><div><h2>Home / Copertina</h2><p>Gestisci la copertina principale della Home.</p></div></div><div class="fields"><div class="field full"><label>Immagine di copertina</label><input id="hhImage" placeholder="URL immagine"><input id="hhImageFile" type="file" accept="image/jpeg,image/png,image/webp"><small>Consigliato: 1920×1080 px, formato 16:9.</small></div><div class="field full"><label>Titolo</label><textarea id="hhTitle" style="min-height:110px"></textarea></div><div class="field full"><label>Sottotitolo</label><textarea id="hhSubtitle"></textarea></div><div class="field full"><label style="display:flex;align-items:center;gap:9px;text-transform:none"><input id="hhShowLogo" type="checkbox" style="width:auto"> Mostra il logo SGM nella copertina</label></div><div class="field full"><button class="btn btn-primary" id="hhApply">Applica modifiche</button></div></div>`;
    main.insertBefore(sec,sticky);
    document.getElementById('hhApply').onclick=saveLocal;
    load();
  }
  function load(){const h=data.home_hero||{};$('hhImage').value=h.image||'';$('hhTitle').value=h.title||'UNA SOLA\nPASSIONE.\nSGM.';$('hhSubtitle').value=h.subtitle||'';$('hhShowLogo').checked=h.show_logo!==false;}
  async function saveLocal(){
    try{
      const file=$('hhImageFile').files[0];let image=$('hhImage').value.trim();if(file) image=await window.SGM_DB.uploadImage(file,'home');
      data.home_hero={image,title:$('hhTitle').value.trim(),subtitle:$('hhSubtitle').value.trim(),show_logo:$('hhShowLogo').checked};
      $('hhImage').value=image;
      if(typeof status==='function') status('Copertina aggiornata. Premi “Salva online” per pubblicarla.');
    }catch(e){alert('Errore caricamento immagine: '+e.message);}
  }
  wait();
})();