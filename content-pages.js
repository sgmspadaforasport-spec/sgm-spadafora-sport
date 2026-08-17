(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  if(!['news.html','sponsor.html','galleria.html'].includes(page))return;
  const css=document.createElement('style');
  css.textContent=`
    .content-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    .content-card{background:#111;color:#fff;border-radius:16px;overflow:hidden;border:1px solid #292929}
    .content-image{aspect-ratio:16/10;background:#ddd center/cover no-repeat}
    .content-body{padding:18px}.content-body h3{margin:0 0 8px;font-size:21px;line-height:1.1}.content-body small{color:#ffd400;font-weight:900}.content-body p{color:#aaa}.content-empty{padding:34px;border:1px dashed #ccc;border-radius:14px;text-align:center;color:#777}
    .content-label{display:inline-flex;align-items:center;width:max-content;max-width:100%;margin-bottom:9px;padding:6px 9px;border-radius:999px;background:#ffd400;color:#000!important;font-size:9px!important;font-weight:900!important;letter-spacing:.55px;text-transform:uppercase}
    .content-card.is-official{border-color:#ffd400}.content-card.is-official .content-body{border-top:3px solid #ffd400}
    .sponsor-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.sponsor-card{border:1px solid #ddd;border-radius:16px;padding:22px;display:grid;place-items:center;gap:12px;background:#fff;text-align:center;min-height:190px}.sponsor-card img{max-width:100%;max-height:110px;object-fit:contain}.sponsor-card strong{font-size:15px}.sponsor-card a{font-size:11px;font-weight:900}
    .gallery-grid{columns:3 260px;column-gap:16px}.gallery-card{break-inside:avoid;margin:0 0 16px;border-radius:14px;overflow:hidden;background:#111;color:#fff}.gallery-card img{width:100%;display:block}.gallery-card div{padding:14px}.gallery-card h3{margin:0 0 6px}.gallery-card p{margin:0;color:#aaa;font-size:12px}
    @media(max-width:850px){.content-grid{grid-template-columns:repeat(2,1fr)}.sponsor-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:560px){.content-grid,.sponsor-grid{grid-template-columns:1fr}.gallery-grid{columns:1}}
  `;document.head.appendChild(css);

  function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function formatDate(v){if(!v)return'';const d=new Date(v+'T12:00:00');return isNaN(d)?esc(v):d.toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'})}

  async function load(){
    const target=document.querySelector('main .section .container');if(!target)return;
    try{
      await window.SGM_DB.init();
      const d=await window.SGM_DB.getSiteData();
      if(page==='news.html')renderNews(target,d.news||[],d.comunicati_ufficiali||[]);
      if(page==='sponsor.html')renderSponsors(target,d.sponsors||[]);
      if(page==='galleria.html')renderGallery(target,d.gallery||[]);
    }catch(e){target.innerHTML='<div class="content-empty">Contenuti momentaneamente non disponibili.</div>';}
  }

  function renderNews(target,news,comunicati){
    const normalNews=(Array.isArray(news)?news:[]).map((n,i)=>({
      type:'news',
      order:i,
      title:n.title||'News',
      excerpt:n.excerpt||'',
      body:n.body||'',
      image:n.image||'',
      date:n.date||''
    }));
    const official=(Array.isArray(comunicati)?comunicati:[]).map((c,i)=>({
      type:'official',
      order:i,
      title:c.title||'Comunicato ufficiale',
      excerpt:'',
      body:c.text||'',
      image:c.image||'',
      date:c.date||''
    }));

    const items=[...official,...normalNews];
    if(!items.length){target.innerHTML='<div class="content-empty">Nessuna news pubblicata al momento.</div>';return;}

    target.innerHTML=`<div class="content-grid">${items.map(n=>`<article class="content-card ${n.type==='official'?'is-official':''}">${n.image?`<div class="content-image" style="background-image:url('${esc(n.image)}')"></div>`:''}<div class="content-body">${n.type==='official'?'<small class="content-label">COMUNICATO UFFICIALE</small>':''}${n.date?`<small>${formatDate(n.date)}</small>`:''}<h3>${esc(n.title)}</h3>${n.excerpt?`<p>${esc(n.excerpt)}</p>`:''}${n.body?`<details><summary style="cursor:pointer;font-weight:900;color:#ffd400">${n.type==='official'?'Leggi il comunicato':'Leggi la news'}</summary><p style="white-space:pre-line">${esc(n.body)}</p></details>`:''}</div></article>`).join('')}</div>`;
  }
  function renderSponsors(target,arr){
    if(!arr.length){target.innerHTML='<div class="content-empty">Nessuno sponsor pubblicato al momento.</div>';return;}
    target.innerHTML=`<div class="sponsor-grid">${arr.map(s=>`<div class="sponsor-card">${s.image?`<img src="${esc(s.image)}" alt="${esc(s.name||'Sponsor')}">`:''}<strong>${esc(s.name||'Sponsor')}</strong>${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">Visita il sito →</a>`:''}</div>`).join('')}</div>`;
  }
  function renderGallery(target,arr){
    if(!arr.length){target.innerHTML='<div class="content-empty">Nessuna fotografia pubblicata al momento.</div>';return;}
    target.innerHTML=`<div class="gallery-grid">${arr.map(g=>`<article class="gallery-card">${g.image?`<img src="${esc(g.image)}" alt="${esc(g.title||'Foto SGM')}">`:''}${g.title||g.caption||g.date?`<div>${g.date?`<small style="color:#ffd400;font-weight:900">${formatDate(g.date)}</small>`:''}${g.title?`<h3>${esc(g.title)}</h3>`:''}${g.caption?`<p>${esc(g.caption)}</p>`:''}</div>`:''}</article>`).join('')}</div>`;
  }
  load();
})();