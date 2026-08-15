(function () {

  async function initSGMSiteData() {
    try {
      if (!window.SGM_DB) {
        console.error("SGM_DB non disponibile");
        return;
      }

      const ready = await window.SGM_DB.init();

      if (!ready) {
        console.error("Supabase non configurato");
        return;
      }

      const data = await window.SGM_DB.getSiteData();

      window.SGM_SITE_DATA = data || {};

      document.dispatchEvent(
        new CustomEvent("sgm-data-ready", {
          detail: window.SGM_SITE_DATA
        })
      );

      console.log(
        "SGM: dati online caricati correttamente",
        window.SGM_SITE_DATA
      );

    } catch (error) {
      console.error(
        "SGM: errore caricamento dati online",
        error
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initSGMSiteData
    );
  } else {
    initSGMSiteData();
  }

})();
