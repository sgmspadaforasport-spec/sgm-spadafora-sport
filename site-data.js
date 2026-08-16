(function () {

  const esc = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");


  /* =========================================
     NORMALIZZAZIONE CHIAVI SPORT
  ========================================= */

  function normalizeSportKey(key) {

    const aliases = {
      "calcio-a-5": "calcio_a_5",
      "calcio_a_5": "calcio_a_5",
      "calcioa5": "calcio_a_5",

      "pallavolo-maschile": "pallavolo_maschile",
      "pallavolo_maschile": "pallavolo_maschile",

      "pallavolo-femminile": "pallavolo_femminile",
      "pallavolo_femminile": "pallavolo_femminile",

      "basket": "basket"
    };

    return aliases[key] || key;
  }


  function getSport(data, key) {

    const normalized = normalizeSportKey(key);

    if (data?.sports?.[normalized]) {
      return data.sports[normalized];
    }

    if (data?.sports?.[key]) {
      return data.sports[key];
    }

    if (data?.[normalized]) {
      return data[normalized];
    }

    if (data?.[key]) {
      return data[key];
    }

    return {};
  }


  /* =========================================
     TROVA ARRAY ROSA
  ========================================= */

  function getRoster(sport) {

    if (Array.isArray(sport?.roster)) {
      return sport.roster;
    }

    if (Array.isArray(sport?.rosa)) {
      return sport.rosa;
    }

    if (Array.isArray(sport?.players)) {
      return sport.players;
    }

    if (Array.isArray(sport?.giocatori)) {
      return sport.giocatori;
    }

    return [];
  }


  /* =========================================
     TROVA ARRAY STAFF
  ========================================= */

  function getStaff(sport) {

    if (Array.isArray(sport?.staff)) {
      return sport.staff;
    }

    if (Array.isArray(sport?.staff_members)) {
      return sport.staff_members;
    }

    return [];
  }


  /* =========================================
     TROVA CALENDARIO
  ========================================= */

  function getCalendar(sport) {

    if (Array.isArray(sport?.calendar)) {
      return sport.calendar;
    }

    if (Array.isArray(sport?.calendario)) {
      return sport.calendario;
    }

    if (Array.isArray(sport?.matches)) {
      return sport.matches;
    }

    if (Array.isArray(sport?.partite)) {
      return sport.partite;
    }

    return [];
  }


  /* =========================================
     TROVA CLASSIFICA
  ========================================= */

  function getStandings(sport) {

    if (Array.isArray(sport?.standings)) {
      return sport.standings;
    }

    if (Array.isArray(sport?.classifica)) {
      return sport.classifica;
    }

    return [];
  }


  /* =========================================
     RUOLI CALCIO A 5
  ========================================= */

  function normalizeRole(role) {

    const value =
      String(role || "")
        .trim()
        .toLowerCase();

    if (value.includes("portier")) {
      return "PORTIERI";
    }

    if (
      value.includes("difensor") ||
      value.includes("centrale")
    ) {
      return "DIFENSORI";
    }

    if (
      value.includes("laterale") &&
      value.includes("pivot")
    ) {
      return "LATERALI / PIVOT";
    }

    if (value.includes("laterale")) {
      return "LATERALI";
    }

    if (value.includes("pivot")) {
      return "PIVOT";
    }

    return "GIOCATORI";
  }


  const calcioRoleOrder = [
    "PORTIERI",
    "DIFENSORI",
    "LATERALI",
    "LATERALI / PIVOT",
    "PIVOT",
    "GIOCATORI"
  ];


  /* =========================================
     RENDER ROSA
  ========================================= */

  function renderSportRoster(data) {

    document
      .querySelectorAll("[data-sgm-roster]")
      .forEach(root => {

        const key =
          normalizeSportKey(
            root.dataset.sgmRoster
          );

        const sport =
          getSport(data, key);

        const roster =
          getRoster(sport);


        if (!roster.length) {

          root.innerHTML = `
            <div class="dynamic-empty">
              <strong>ROSA IN AGGIORNAMENTO</strong>
              <span>
                I giocatori saranno pubblicati
                appena disponibili.
              </span>
            </div>
          `;

          return;
        }


        /*
          CALCIO A 5:
          suddivisione automatica per ruolo
        */

        if (key === "calcio_a_5") {

          const groups = {};

          roster.forEach(player => {

            const role =
              normalizeRole(
                player.role ||
                player.ruolo
              );

            if (!groups[role]) {
              groups[role] = [];
            }

            groups[role].push(player);

          });


          let html = "";


          calcioRoleOrder.forEach(role => {

            const players =
              groups[role];

            if (!players?.length) {
              return;
            }


            html += `
              <section class="roster-group">

                <p class="section-kicker yellow">
                  CALCIO A 5
                </p>

                <h2 class="roster-title">
                  ${esc(role)}
                </h2>

                <div class="roster-list">
            `;


            players.forEach(player => {

              const name =
                player.name ||
                player.nome ||
                "";

              const playerRole =
                player.role ||
                player.ruolo ||
                "";

              const number =
                player.number ??
                player.numero ??
                "";


              html += `

                <article class="dynamic-card player-card">

                  <div class="dynamic-number">
                    ${esc(number || "SGM")}
                  </div>

                  <div class="dynamic-card-content">

                    <h3>
                      ${esc(name)}
                    </h3>

                    <p>
                      ${esc(
                        String(playerRole)
                          .toUpperCase()
                      )}
                    </p>

                  </div>

                </article>

              `;

            });


            html += `
                </div>
              </section>
            `;

          });


          root.innerHTML = html;

          return;
        }


        /*
          PALLAVOLO / BASKET
        */

        root.innerHTML =
          roster.map(player => {

            const name =
              player.name ||
              player.nome ||
              "";

            const role =
              player.role ||
              player.ruolo ||
              "";

            const number =
              player.number ??
              player.numero ??
              "";


            return `

              <article class="dynamic-card player-card">

                <div class="dynamic-number">
                  ${esc(number || "SGM")}
                </div>

                <div class="dynamic-card-content">

                  <h3>
                    ${esc(name)}
                  </h3>

                  <p>
                    ${esc(
                      String(role)
                        .toUpperCase()
                    )}
                  </p>

                </div>

              </article>

            `;

          }).join("");

      });

  }


  /* =========================================
     RENDER STAFF
  ========================================= */

  function renderSportStaff(data) {

    document
      .querySelectorAll("[data-sgm-staff]")
      .forEach(root => {

        const key =
          normalizeSportKey(
            root.dataset.sgmStaff
          );

        const sport =
          getSport(data, key);

        const staff =
          getStaff(sport);


        if (!staff.length) {

          root.innerHTML = `
            <div class="dynamic-empty">
              <strong>STAFF IN AGGIORNAMENTO</strong>
              <span>
                Lo staff sarà pubblicato
                appena disponibile.
              </span>
            </div>
          `;

          return;
        }


        root.innerHTML =
          staff.map(person => {

            const name =
              person.name ||
              person.nome ||
              "";

            const role =
              person.role ||
              person.ruolo ||
              "";


            return `

              <article class="dynamic-card">

                <div class="dynamic-number">
                  SGM
                </div>

                <div class="dynamic-card-content">

                  <h3>
                    ${esc(name)}
                  </h3>

                  <p>
                    ${esc(
                      String(role)
                        .toUpperCase()
                    )}
                  </p>

                </div>

              </article>

            `;

          }).join("");

      });

  }


  /* =========================================
     RENDER CALENDARIO
  ========================================= */

  function renderSportCalendar(data) {

    document
      .querySelectorAll("[data-sgm-calendar]")
      .forEach(root => {

        const key =
          normalizeSportKey(
            root.dataset.sgmCalendar
          );

        const sport =
          getSport(data, key);

        const calendar =
          getCalendar(sport);


        if (!calendar.length) {

          root.innerHTML = `

            <div class="dynamic-empty">

              <strong>
                📅 CALENDARIO IN AGGIORNAMENTO
              </strong>

              <span>
                Le gare saranno pubblicate
                appena disponibili.
              </span>

            </div>

          `;

          return;
        }


        root.innerHTML =
          calendar.map(game => {

            const round =
              game.round ||
              game.giornata ||
              "Gara";

            const date =
              game.date ||
              game.data ||
              "";

            const time =
              game.time ||
              game.ora ||
              "";

            const home =
              game.home ||
              game.casa ||
              "";

            const away =
              game.away ||
              game.trasferta ||
              "";

            const homeScore =
              game.home_score ??
              game.gol_casa ??
              "-";

            const awayScore =
              game.away_score ??
              game.gol_trasferta ??
              "-";

            const venue =
              game.venue ||
              game.luogo ||
              "";


            return `

              <article class="calendar-card">

                <div class="calendar-head">

                  <strong>
                    ${esc(round)}
                  </strong>

                  <span>
                    ${esc(date)}
                    ${
                      time
                        ? " · " + esc(time)
                        : ""
                    }
                  </span>

                </div>


                <div class="calendar-teams">

                  <strong>
                    ${esc(home)}
                  </strong>

                  <b>
                    ${esc(homeScore)}
                    :
                    ${esc(awayScore)}
                  </b>

                  <strong>
                    ${esc(away)}
                  </strong>

                </div>


                ${
                  venue
                    ? `<small>${esc(venue)}</small>`
                    : ""
                }

              </article>

            `;

          }).join("");

      });

  }


  /* =========================================
     RENDER CLASSIFICA
  ========================================= */

  function renderSportStandings(data) {

    document
      .querySelectorAll("[data-sgm-standings]")
      .forEach(root => {

        const key =
          normalizeSportKey(
            root.dataset.sgmStandings
          );

        const sport =
          getSport(data, key);

        const standings =
          getStandings(sport);


        if (!standings.length) {

          root.innerHTML = `
            <div class="dynamic-empty">
              <strong>
                CLASSIFICA IN AGGIORNAMENTO
              </strong>
            </div>
          `;

          return;
        }


        root.innerHTML = `

          <div class="standings-table">

            <div class="
              standings-row
              standings-head
            ">

              <span>#</span>
              <span>Squadra</span>
              <span>PG</span>
              <span>PT</span>

            </div>


            ${standings.map(row => {

              const pos =
                row.pos ??
                row.position ??
                row.posizione ??
                "";

              const team =
                row.team ||
                row.squadra ||
                "";

              const played =
                row.played ??
                row.pg ??
                0;

              const points =
                row.points ??
                row.punti ??
                0;


              return `

                <div class="standings-row">

                  <span>
                    ${esc(pos)}
                  </span>

                  <strong>
                    ${esc(team)}
                  </strong>

                  <span>
                    ${esc(played)}
                  </span>

                  <b>
                    ${esc(points)}
                  </b>

                </div>

              `;

            }).join("")}

          </div>

        `;

      });

  }


  /* =========================================
     AVVIO SUPABASE
  ========================================= */

  async function initSGMSiteData() {

    try {

      if (!window.SGM_DB) {

        console.error(
          "SGM_DB non disponibile"
        );

        return;
      }


      const ready =
        await window.SGM_DB.init();


      if (!ready) {

        console.error(
          "Supabase non configurato"
        );

        return;
      }


      const data =
        await window.SGM_DB.getSiteData();


      window.SGM_SITE_DATA =
        data || {};


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
        "SGM: dati caricati correttamente",
        data
      );


    } catch (error) {

      console.error(
        "SGM: errore caricamento dati",
        error
      );

    }

  }


  /* =========================================
     START
  ========================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initSGMSiteData
    );

  } else {

    initSGMSiteData();

  }

})();
