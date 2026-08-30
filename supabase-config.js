window.SGM_SUPABASE_CONFIG = {
  url: "https://vgxatjdtawugxkzjkyxw.supabase.co",
  anonKey: "sb_publishable_4FuMVey4xj_B55InGcb1uw_pSMZ9Lk_",
  storageBucket: "sgm-media"
};

/* Favicon ufficiale SGM - formato supportato da Google Search */
(function () {
  const href = "https://asdsgmspadaforasport.it/IMG-20250217-WA0006.jpg";
  let icon = document.querySelector('link[rel="icon"]');
  if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
  icon.type = 'image/jpeg'; icon.setAttribute('sizes','500x500'); icon.href = href;
  let shortcut = document.querySelector('link[rel="shortcut icon"]');
  if (!shortcut) { shortcut = document.createElement('link'); shortcut.rel = 'shortcut icon'; document.head.appendChild(shortcut); }
  shortcut.type = 'image/jpeg'; shortcut.href = href;
  let apple = document.querySelector('link[rel="apple-touch-icon"]');
  if (!apple) { apple = document.createElement('link'); apple.rel = 'apple-touch-icon'; document.head.appendChild(apple); }
  apple.href = href;
})();

/* SEO centralizzato per le pagine pubbliche */
(function () {
  const base = "https://asdsgmspadaforasport.it/";
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const seo = {
    'index.html':['ASD SGM Spadafora Sport | Sito Ufficiale','Sito ufficiale ASD SGM Spadafora Sport, polisportiva di Spadafora (Messina). Calcio a 5, pallavolo, basket, settore giovanile, news e risultati.',''],
    'chi-siamo.html':['Chi siamo | ASD SGM Spadafora Sport','Scopri ASD SGM Spadafora Sport, polisportiva fondata nel 2024 a Spadafora (Messina): storia, missione, valori e attività sportive.','chi-siamo.html'],
    'squadre.html':['Squadre | ASD SGM Spadafora Sport','Scopri le squadre ASD SGM Spadafora Sport: calcio a 5, pallavolo maschile e femminile, basket e settore giovanile.','squadre.html'],
    'calcio-a-5.html':['Calcio a 5 Serie C2 | ASD SGM Spadafora Sport','Calcio a 5 ASD SGM Spadafora Sport: prima squadra, rosa, staff, calendario e risultati della stagione sportiva 2026/2027.','calcio-a-5.html'],
    'pallavolo-maschile.html':['Pallavolo Maschile Serie C | ASD SGM Spadafora Sport','Pallavolo maschile ASD SGM Spadafora Sport: squadra, staff, calendario e risultati della stagione sportiva 2026/2027.','pallavolo-maschile.html'],
    'pallavolo-femminile.html':['Pallavolo Femminile | ASD SGM Spadafora Sport','Pallavolo femminile ASD SGM Spadafora Sport: squadra, attività, staff e aggiornamenti della stagione sportiva 2026/2027.','pallavolo-femminile.html'],
    'basket.html':['Basket Divisione Regionale 2 | ASD SGM Spadafora Sport','Basket ASD SGM Spadafora Sport: prima squadra, rosa, staff, calendario e risultati della stagione sportiva 2026/2027.','basket.html'],
    'giovanile-calcio.html':['Scuola Calcio e Settore Giovanile | ASD SGM Spadafora Sport','Scuola calcio e settore giovanile ASD SGM Spadafora Sport a Spadafora: categorie, attività e informazioni per la stagione 2026/2027.','giovanile-calcio.html'],
    'news.html':['News | ASD SGM Spadafora Sport','Ultime news, attività, eventi e aggiornamenti ufficiali della polisportiva ASD SGM Spadafora Sport.','news.html'],
    'comunicati-ufficiali.html':['Comunicati Ufficiali | ASD SGM Spadafora Sport','Comunicati ufficiali e comunicazioni societarie di ASD SGM Spadafora Sport.','comunicati-ufficiali.html'],
    'calendario-risultati.html':['Calendario e Risultati | ASD SGM Spadafora Sport','Calendari, prossime gare e risultati delle squadre ASD SGM Spadafora Sport nella stagione sportiva 2026/2027.','calendario-risultati.html'],
    'rose.html':['Rose Squadre | ASD SGM Spadafora Sport','Le rose delle squadre ASD SGM Spadafora Sport: calcio a 5, pallavolo e basket.','rose.html'],
    'staff.html':['Staff | ASD SGM Spadafora Sport','Direttivo, dirigenti, allenatori e staff della polisportiva ASD SGM Spadafora Sport.','staff.html'],
    'palmares.html':['Palmarès | ASD SGM Spadafora Sport','Palmarès, promozioni e risultati sportivi raggiunti da ASD SGM Spadafora Sport dalla fondazione nel 2024.','palmares.html'],
    'sponsor.html':['Sponsor | ASD SGM Spadafora Sport','Sponsor e partner che sostengono le attività sportive e sociali di ASD SGM Spadafora Sport.','sponsor.html'],
    'galleria.html':['Galleria | ASD SGM Spadafora Sport','Foto e immagini delle squadre, degli eventi e delle attività ASD SGM Spadafora Sport.','galleria.html'],
    'sgm-tv.html':['SGM TV | ASD SGM Spadafora Sport','SGM TV: video, interviste, highlights e contenuti dal mondo ASD SGM Spadafora Sport.','sgm-tv.html'],
    'contatti.html':['Contatti | ASD SGM Spadafora Sport','Contatta ASD SGM Spadafora Sport, polisportiva con sede a Spadafora (Messina), per informazioni su squadre, attività e iscrizioni.','contatti.html']
  };
  const data=seo[page]; if(!data)return;
  document.title=data[0];
  let desc=document.querySelector('meta[name="description"]');if(!desc){desc=document.createElement('meta');desc.name='description';document.head.appendChild(desc);}desc.content=data[1];
  let robots=document.querySelector('meta[name="robots"]');if(!robots){robots=document.createElement('meta');robots.name='robots';document.head.appendChild(robots);}robots.content='index,follow,max-image-preview:large';
  let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}canonical.href=base+data[2];
  const setProp=(property,content)=>{let m=document.querySelector('meta[property="'+property+'"]');if(!m){m=document.createElement('meta');m.setAttribute('property',property);document.head.appendChild(m);}m.content=content;};
  setProp('og:site_name','ASD SGM Spadafora Sport');setProp('og:locale','it_IT');setProp('og:type','website');setProp('og:title',data[0]);setProp('og:description',data[1]);setProp('og:url',base+data[2]);setProp('og:image',base+'IMG-20250217-WA0006.jpg');
})();

/* Notifiche push del sito */
(function () {
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page==='admin.html'||document.querySelector('script[data-sgm-web-push]'))return;
  const script=document.createElement('script');
  script.src='web-notifications.js?v=6';
  script.defer=true;
  script.setAttribute('data-sgm-web-push','1');
  document.head.appendChild(script);
})();