(function(){
  function cleanupHome(){
    document.querySelectorAll('.home-quick-links,.home-contact-footer').forEach(el=>el.remove());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',cleanupHome); else cleanupHome();
})();
