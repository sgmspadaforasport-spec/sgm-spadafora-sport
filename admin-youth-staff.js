(function(){
  function waitForAdmin(){
    if(typeof sportLabels==='undefined' || typeof renderSportTabs!=='function' || typeof renderStaff!=='function' || typeof openModal!=='function' || typeof data==='undefined' || !data){
      return setTimeout(waitForAdmin,80);
    }
    install();
  }

  function install(){
    sportLabels.settore_giovanile='Settore Giovanile';
    data.sports=data.sports||{};
    data.sports.settore_giovanile=data.sports.settore_giovanile||{name:'Settore Giovanile',roster:[],staff:[],standings:[],calendar:[]};
    data.sports.settore_giovanile.roster=data.sports.settore_giovanile.roster||[];
    data.sports.settore_giovanile.staff=data.sports.settore_giovanile.staff||[];
    data.sports.settore_giovanile.standings=data.sports.settore_giovanile.standings||[];
    data.sports.settore_giovanile.calendar=data.sports.settore_giovanile.calendar||[];

    const originalEditStaff=window.editStaff;
    window.editStaff=function(i=null){
      if(currentSport!=='settore_giovanile') return originalEditStaff(i);
      const p=i===null?{name:'',role:'',image:''}:data.sports[currentSport].staff[i];
      openModal(i===null?'Aggiungi membro staff settore giovanile':'Modifica staff settore giovanile',`
        <div class="fields">
          <div class="field full"><label>Nome e cognome</label><input id="ysName" value="${esc(p.name||'')}"></div>
          <div class="field full"><label>Ruolo</label><input id="ysRole" value="${esc(p.role||'')}" placeholder="Es. Allenatore, Responsabile, Dirigente"></div>
          <div class="field full"><label>Foto</label><input id="ysImage" value="${esc(p.image||'')}" placeholder="URL immagine"><input id="ysImageFile" type="file" accept="image/jpeg,image/png,image/webp"><small>Puoi caricare la foto oppure lasciare vuoto.</small></div>
        </div>`,async()=>{
          try{
            let image=$('ysImage').value.trim();
            const file=$('ysImageFile').files[0];
            if(file) image=await window.SGM_DB.uploadImage(file,'staff-settore-giovanile');
            const obj={name:$('ysName').value.trim(),role:$('ysRole').value.trim(),image};
            if(i===null)data.sports[currentSport].staff.push(obj);else data.sports[currentSport].staff[i]=obj;
            renderStaff();
            if(typeof status==='function')status('Staff settore giovanile aggiornato. Premi “Salva online”.');
          }catch(e){alert('Errore caricamento foto: '+e.message);}
        });
    };

    renderSportTabs();renderRoster();renderStaff();
  }

  waitForAdmin();
})();