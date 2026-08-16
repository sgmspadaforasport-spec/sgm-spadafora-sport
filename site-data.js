(function () {

  const esc = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");


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


      renderHome(data);

      renderContacts(data);

      renderSportRoster(data);

      renderSportStaff(data);

      renderSportCalendar(data);

      renderSportStandings(data);


      document.dispatchEvent(
        new CustomEvent(
          "sgm-data-ready",
          {
            detail: data
          }
        )
      );


      console.log(
        "SGM: dati online caricati correttamente",
        data
      );


    } catch (error) {

      console.error(
        "SGM: errore caricamento dati online",
        error
      );

    }

  }



  function getSport(data, key) {

    return data?.sports?.[key] || null;

  }



  /* =========================
     HOME
  ========================= */

  function renderHome(data) {

    const matches =
      Array.isArray(data.next_matches)
        ? data.next_matches
        : [];


    document
      .querySelectorAll(".upcoming-card")
      .forEach((card, i) => {

        const item = matches[i];

        if (!item) return;


        const sport =
          card.querySelector(".upcoming-sport");

        const date =
          card.querySelector(
            ".upcoming-date strong"
          );

        const time =
          card.querySelector(
            ".upcoming-date span"
          );

        const teams =
          card.querySelectorAll(
            ".upcoming-match strong"
          );

        const link =
          card.querySelector("a");


        if (sport) {
          sport.textContent =
            item.sport || "";
       
