(function(){
  function install(){
    if(document.querySelector('.home-admin-access')) return;
    const footer=document.querySelector('footer.footer');
    if(!footer)return;
    const style=document.createElement('style');
    style.textContent=`
      .home-admin-access{background:#f4f4f4;padding:28px 0 34px}
      .home-admin-access-inner{display:flex;justify-content:flex-end}
      .home-admin-button{display:inline-flex;align-items:center;gap:12px;background:#111;color:#fff;text-decoration:none;border:1px solid #2d2d2d;border-radius:14px;padding:13px 17px;box-shadow:0 8px 22px rgba(0,0,0,.08);transition:.2s ease}
      .home-admin-button:hover{transform:translateY(-2px);border-color:var(--yellow,#ffd400)}
      .home-admin-lock{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:var(--yellow,#ffd400);color:#000}
      .home-admin-button span:nth-child(2){display:grid;gap:2px}
      .home-admin-button small{font-size:8px;letter-spacing:.8px;color:#999;font-weight:900}
      .home-admin-button strong{font-size:12px;font-weight:900}
      .home-admin-button b{color:var(--yellow,#ffd400);margin-left:5px}
      @media(max-width:600px){.home-admin-access-inner{justify-content:stretch}.home-admin-button{width:100%;justify-content:flex-start}.home-admin-button b{margin-left:auto}}
    `;
    document.head.appendChild(style);
    const section=document.createElement('section');
    section.className='home-admin-access';
    section.innerHTML=`<div class="container home-admin-access-inner"><a href="admin.html" class="home-admin-button" aria-label="Accedi all'area amministratore"><span class="home-admin-lock">🔒</span><span><small>AREA RISERVATA</small><strong>Accesso Amministratore</strong></span><b>→</b></a></div>`;
    footer.parentNode.insertBefore(section,footer);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120));else setTimeout(install,120);
})();