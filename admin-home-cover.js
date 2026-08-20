(function(){
function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function setup(){
 const nav=document.querySelector('.admin-nav'), main=document.querySelector('.admin-layout main');
 if(!nav||!main||document.getElementById('homeCoverAdmin')) return;
 const btn=document.createElement('button');btn.className='nav-btn';btn.dataset.panel='homeCoverAdmin';btn.textContent='Home / Copertina';
 const first=nav.querySelector('button'); first?first.insertAdjacentElement('afterend',btn):nav.appendChild(btn);
 const panel=document.createElement('section');panel.className='admin-panel';panel.id='homeCoverAdmin';panel.innerHTML=`<div class="panel-head"><div><h2>Home / Copertina</h2><p>Gestisci la grande immagine iniziale della Home.</p></div></div><div class="fields"><div class="field full"><label>Immagine di copertina</label><input id="homeCoverUrl" placeholder="URL immagine"><input id="homeCoverFile" type="file" accept="image/jpeg,image/png,image/webp"><p class="upload-note">Formato consigliato: 1920×1080 px (16:9).</p></div><div class="field full"><label>Titolo</label><input id="homeCoverTitle"></div><div class="field full"><label>Sottotitolo</label><textarea id="homeCoverSubtitle"></textarea></div><div class="field full"><label style="display:flex;align-items:center;gap:10px;text-transform:none;font-size:12px"><input id="homeCoverLogo" type="checkbox" style="width:auto"> Mostra il logo SGM sulla copertina</label></div><div class="field full"><div id="homeCoverPreview" style="min-height:170px;border:1px solid #333;border-radius:12px;background:#090909 center/cover no-repeat;display:grid;place-items:center;color:#777">Anteprima copertina</div></div></div>`;
 const sticky=main.querySelector('.sticky-save'); main.insertBefore(panel,sticky);
 btn.onclick=()=>{document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');panel.classList.add('active');loadFields()};
 function loadFields(){if(!window.data)return;data.home_cover=data.home_cover||{};homeCoverUrl.value=data.home_cover.image||'';homeCoverTitle.value=data.home_cover.title||'';homeCoverSubtitle.value=data.home_cover.subtitle||'';homeCoverLogo.checked=data.home_cover.show_logo!==false;preview()}
 function preview(){const u=homeCoverUrl.value.trim();homeCoverPreview.style.backgroundImage=u?`linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)),url("${u.replace(/"/g,'')}")`:'none';homeCoverPreview.textContent=u?'':'Anteprima copertina'}
 homeCoverUrl.oninput=preview;
 homeCoverFile.onchange=async e=>{const f=e.target.files[0];if(!f)return;try{homeCoverFile.disabled=true;const u=await window.SGM_DB.uploadImage(f,'home-cover');homeCoverUrl.value=u;preview()}catch(err){alert('Errore caricamento: '+err.message)}finally{homeCoverFile.disabled=false}};
 const save=document.getElementById('saveOnline');if(save)save.addEventListener('click',()=>{if(!window.data)return;data.home_cover=data.home_cover||{};data.home_cover.image=homeCoverUrl.value.trim();data.home_cover.title=homeCoverTitle.value.trim();data.home_cover.subtitle=homeCoverSubtitle.value.trim();data.home_cover.show_logo=homeCoverLogo.checked;},true);
 const oldRender=window.renderAll;if(typeof oldRender==='function')window.renderAll=function(){oldRender();loadFields()};
 setTimeout(loadFields,500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();