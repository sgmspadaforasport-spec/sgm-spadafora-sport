(function(){
  function wait(){
    if(typeof openPanel!=='function'||!document.querySelector('.admin-nav')||typeof data==='undefined'||!data) return setTimeout(wait,100);
    install();
  }
  function install(){
    if(document.getElementById('homeHeroAdmin')) return;
    data.home_hero=data.home_hero||{image:'',title:'UNA SOLA\nPASSIONE.\nSGM.',subtitle:'Calcio a 5, pallavolo, basket e settore giovanile. Una società, una comunità, una famiglia giallonera.',show_logo:true};
    const nav=document.querySelector('.admin-nav');
    const btn=document.createElement('button');btn.className='nav-btn';btn.dataset.panel='homeHeroAdmin';btn.textContent='🏠 Home / Copertina';btn.onclick=()=>{openPanel('homeHeroAdmin');load();};
    nav.insertBefore(btn,nav.firstElementChild?.nextSibling||null);
    const main=document.querySelector('.admin-layout main');const sticky=main.querySelector('.sticky-save');
    const sec=document.createElement('section');sec.className='admin-panel';sec.id='homeHeroAdmin';sec.innerHTML=`<div class="panel-head"><div><h2>Home / Copertina</h2><p>Gestisci l'immagine principale della Home.</p></div></div><div class="fields"><div class="field full"><label>Immagine di copertina</label><input id="hhImage" placeholder="URL immagine"><input id="hhImageFile" type="file" accept="image/jpeg,image/png,image/webp"><small>Formato consigliato: 1920×1080 px (16:9).</small></div><div class="field full"><label>Titolo</label><textarea id="hhTitle" style="min-height:110px"></textarea></div><div class="field full"><label>Sottotitolo</label><textarea id="hhSubtitle"></textarea></div><div class="field full"><label style="display:flex;align-items:center;gap:9px;text-transform:none"><input id="hhShowLogo" type="checkbox" style="width:auto"> Mostra il logo SGM nella copertina</label></div><div class="field full"><button class="btn btn-primary" id="hhApply">Applica copertina</button><p class="upload-note">Puoi premere “Applica copertina” oppure direttamente “Salva online”: i dati verranno sincronizzati automaticamente.</p></div></div>`;
    main.insertBefore(sec,sticky);
    document.getElementById('hhApply').onclick=async()=>{await sync(true);if(typeof status==='function')status('Copertina pronta. Premi “Salva online” per pubblicarla.');};
    const save=document.getElementById('saveOnline');
    if(save){save.addEventListener('click',()=>sync(false),true);}
    load();
  }
  function load(){const h=data.home_hero||{};document.getElementById('hhImage').value=h.image||'';document.getElementById('hhTitle').value=h.title||'UNA SOLA\nPASSIONE.\nSGM.';document.getElementById('hhSubtitle').value=h.subtitle||'';document.getElementById('hhShowLogo').checked=h.show_logo!==false;}
  async function sync(upload){
    try{
      let image=document.getElementById('hhImage').value.trim();
      const file=document.getElementById('hhImageFile').files[0];
      if(upload&&file){image=await window.SGM_DB.uploadImage(file,'home');document.getElementById('hhImage').value=image;document.getElementById('hhImageFile').value='';}
      data.home_hero={image,title:document.getElementById('hhTitle').value.trim(),subtitle:document.getElementById('hhSubtitle').value.trim(),show_logo:document.getElementById('hhShowLogo').checked};
      return true;
    }catch(e){if(typeof status==='function')status('Errore copertina: '+e.message,true);return false;}
  }
  wait();
})();