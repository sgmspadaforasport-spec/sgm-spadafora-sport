(function(){
  const css=document.createElement('style');
  css.textContent=`
  .footer.sgm-pro-footer{background:#090909;color:#fff;border-top:4px solid var(--yellow,#ffd400);padding:0}
  .sgm-footer-main{padding:52px 0 38px}
  .sgm-footer-grid{display:grid;grid-template-columns:minmax(250px,1.35fr) repeat(3,minmax(150px,.75fr));gap:38px;align-items:start}
  .sgm-footer-brand img{width:84px;height:84px;object-fit:contain;border-radius:12px;margin-bottom:18px}
  .sgm-footer-brand h2{margin:0 0 10px;font-size:25px;line-height:1;font-weight:900;text-transform:uppercase}
  .sgm-footer-brand p{margin:0;max-width:330px;color:#9d9d9d;font-size:13px;line-height:1.6}
  .sgm-footer-title{display:block;color:var(--yellow,#ffd400);font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin:4px 0 16px}
  .sgm-footer-links{display:grid;gap:9px}
  .sgm-footer-links a,.sgm-footer-contact a,.sgm-footer-contact p{color:#c8c8c8;font-size:12px;line-height:1.45;text-decoration:none;margin:0;overflow-wrap:anywhere}
  .sgm-footer-links a:hover,.sgm-footer-contact a:hover{color:var(--yellow,#ffd400)}
  .sgm-footer-contact{display:grid;gap:9px}
  .sgm-footer-social{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
  .sgm-footer-social a{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:0 11px;border:1px solid #333;border-radius:8px;color:#fff;font-size:10px;font-weight:900;text-decoration:none}
  .sgm-footer-social a:hover{background:var(--yellow,#ffd400);border-color:var(--yellow,#ffd400);color:#000}
  .sgm-footer-bottom{border-top:1px solid #202020;background:#050505}
  .sgm-footer-bottom-inner{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:18px;color:#777;font-size:10px}
  .sgm-footer-legal{display:flex;gap:16px;flex-wrap:wrap}
  .sgm-footer-legal a{color:#888;text-decoration:none}.sgm-footer-legal a:hover{color:#fff}
  .sgm-footer-admin{color:#555!important;font-size:9px!important}
  @media(max-width:900px){.sgm-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:600px){.sgm-footer-main{padding:38px 0 28px}.sgm-footer-grid{grid-template-columns:1fr;gap:28px}.sgm-footer-bottom-inner{padding-top:18px;padding-bottom:18px;align-items:flex-start;flex-direction:column}.sgm-footer-brand img{width:72px;height:72px}}
  `;
  document.head.appendChild(css);

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safe=u=>/^https?:\/\//i.test(String(u||'').trim())?String(u).trim():'#';

  function render(data){
    const footer=document.querySelector('footer.footer'); if(!footer)return;
    const c=data?.contacts||data?.contatti||data?.contact||{};
    const address=c.address||'Via Riolo 2, 98048 Spadafora (ME)';
    const email=c.email||'sgmspadaforasport@gmail.com';
    const pec=c.pec||'';
    const socials=[['Facebook',c.facebook],['Instagram',c.instagram],['TikTok',c.tiktok],['Twitch',c.twitch]].filter(x=>x[1]);
    footer.className='footer sgm-pro-footer';
    footer.innerHTML=`<div class="sgm-footer-main"><div class="container sgm-footer-grid">
      <div class="sgm-footer-brand"><img src="IMG-20250217-WA0006.jpg" alt="Logo ASD SGM Spadafora Sport"><h2>ASD SGM<br>Spadafora Sport</h2><p>Polisportiva dilettantistica. Sport, crescita e comunità nel territorio di Spadafora.</p></div>
      <div><span class="sgm-footer-title">Società</span><div class="sgm-footer-links"><a href="chi-siamo.html">Chi siamo</a><a href="staff.html">Staff</a><a href="palmares.html">Palmarès</a><a href="news.html">News</a><a href="comunicati-ufficiali.html">Comunicati ufficiali</a><a href="contatti.html">Contatti</a></div></div>
      <div><span class="sgm-footer-title">Sport</span><div class="sgm-footer-links"><a href="calcio-a-5.html">Calcio a 5</a><a href="pallavolo-maschile.html">Pallavolo maschile</a><a href="pallavolo-femminile.html">Pallavolo femminile</a><a href="basket.html">Basket</a><a href="giovanile-calcio.html">Settore giovanile</a><a href="calendario-risultati.html">Calendario e risultati</a></div></div>
      <div><span class="sgm-footer-title">Contatti</span><div class="sgm-footer-contact"><p>${esc(address)}</p>${email?`<a href="mailto:${esc(email)}">${esc(email)}</a>`:''}${pec?`<a href="mailto:${esc(pec)}">PEC: ${esc(pec)}</a>`:''}</div>${socials.length?`<div class="sgm-footer-social">${socials.map(([n,u])=>`<a href="${esc(safe(u))}" target="_blank" rel="noopener noreferrer">${esc(n)}</a>`).join('')}</div>`:''}</div>
    </div></div><div class="sgm-footer-bottom"><div class="container sgm-footer-bottom-inner"><span>© 2026 ASD SGM Spadafora Sport · Stagione sportiva 2026/2027</span><div class="sgm-footer-legal"><a href="privacy.html">Privacy Policy</a><a href="cookie.html">Cookie Policy</a><a class="sgm-footer-admin" href="admin.html">Area amministratore</a></div></div></div>`;
  }

  async function init(){
    try{
      if(window.SGM_SITE_DATA){render(window.SGM_SITE_DATA);return;}
      if(window.SGM_DB){await window.SGM_DB.init();const d=await window.SGM_DB.getSiteData();render(d||{});return;}
    }catch(e){console.warn('Footer: dati dinamici non disponibili',e)}
    render({});
  }
  document.addEventListener('sgm-data-ready',e=>render(e.detail||{}));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,80));else setTimeout(init,80);
})();