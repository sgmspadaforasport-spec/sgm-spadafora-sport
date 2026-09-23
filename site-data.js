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
     HOME: PROSSIME GARE AUTOMATICHE
     Legge direttamente i calendari di ogni sport.
  ========================================= */

  function parseGameDate(dateValue, timeValue) {
    const raw = String(dateValue || "").trim();
    if (!raw) return null;

    let y, m, d;
    let match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) {
      y = +match[1]; m = +match[2]; d = +match[3];
    } else {
      match = raw.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
      if (!match) return null;
      d = +match[1]; m = +match[2]; y = +match[3];
    }

    const time = String(timeValue || "").match(/(\d{1,2}):(\d{2})/);
    const hh = time ? +time[1] : 23;
    const mm = time ? +time[2] : 59;
    const result = new Date(y, m - 1, d, hh, mm, 59);
    return Number.isNaN(result.getTime()) ? null : result;
  }

  function renderHomeUpcoming(data) {
    const root = document.querySelector(".upcoming-grid");
    if (!root) return;

    const sports = [
      { key: "calcio_a_5", label: "Calcio a 5", icon: "⚽", page: "calcio-a-5-calendario.html" },
      { key: "pallavolo_maschile", label: "Pallavolo Maschile", icon: "🏐", page: "pallavolo-maschile-calendario.html" },
      { key: "pallavolo_femminile", label: "Pallavolo Femminile", icon: "🏐", page: "pallavolo-femminile-calendario.html" },
      { key: "basket", label: "Basket", icon: "🏀", page: "basket-calendario.html" }
    ];

    const now = new Date();
    const upcoming = [];

    sports.forEach(info => {
      const calendar = getCalendar(getSport(data, info.key));
      const futureGames = calendar
        .map(game => ({ game, when: parseGameDate(game.date || game.data, game.time || game.ora) }))
        .filter(item => item.when && item.when >= now)
        .sort((a, b) => a.when - b.when);

      if (futureGames.length) {
        upcoming.push({ ...info, ...futureGames[0] });
      }
    });

    upcoming.sort((a, b) => a.when - b.when);

    if (!upcoming.length) {
      root.innerHTML = `
        <div class="dynamic-empty">
          <strong>PROSSIME GARE IN AGGIORNAMENTO</strong>
          <span>Le prossime partite compariranno automaticamente quando saranno inseriti i calendari.</span>
        </div>`;
      return;
    }

    root.innerHTML = upcoming.map(item => {
      const g = item.game;
      const date = g.date || g.data || "";
      const time = g.time || g.ora || "";
      const home = g.home || g.casa || "";
      const away = g.away || g.trasferta || "";

      return `
        <article class="upcoming-card">
          <div class="upcoming-top">
            <span class="upcoming-sport">${esc(item.label)}</span>
            <span class="upcoming-icon">${item.icon}</span>
          </div>
          <div class="upcoming-date">
            <strong>${esc(date)}</strong>
            <span>${time ? "Ore " + esc(time) : "Orario da definire"}</span>
          </div>
          <div class="upcoming-match">
            <strong>${esc(home)}</strong>
            <span>VS</span>
            <strong>${esc(away)}</strong>
          </div>
          <a href="${esc(item.page)}">Vai al calendario →</a>
        </article>`;
    }).join("");
  }


  /* =========================================
     HOME: RISULTATI RECENTI AUTOMATICI
     Mostra l'ultima gara con risultato per ogni sport.
  ========================================= */

  function renderHomeRecentResults(data) {
    const root = document.querySelector(".results-grid");
    if (!root) return;

    const sports = [
      { key: "calcio_a_5", label: "Calcio a 5", icon: "⚽", page: "calcio-a-5-calendario.html" },
      { key: "pallavolo_maschile", label: "Pallavolo Maschile", icon: "🏐", page: "pallavolo-maschile-calendario.html" },
      { key: "pallavolo_femminile", label: "Pallavolo Femminile", icon: "🏐", page: "pallavolo-femminile-calendario.html" },
      { key: "basket", label: "Basket", icon: "🏀", page: "basket-calendario.html" }
    ];

    const recent = [];

    sports.forEach(info => {
      const calendar = getCalendar(getSport(data, info.key));

      const played = calendar
        .map(game => {
          const homeScore = game.home_score ?? game.gol_casa ?? game.punti_casa ?? game.set_casa;
          const awayScore = game.away_score ?? game.gol_trasferta ?? game.punti_trasferta ?? game.set_trasferta;
          const hasScore =
            homeScore !== undefined && homeScore !== null && homeScore !== "" && homeScore !== "-" &&
            awayScore !== undefined && awayScore !== null && awayScore !== "" && awayScore !== "-";

          return {
            game,
            when: parseGameDate(game.date || game.data, game.time || game.ora),
            homeScore,
            awayScore,
            hasScore
          };
        })
        .filter(item => item.hasScore)
        .sort((a, b) => {
          if (a.when && b.when) return b.when - a.when;
          if (a.when) return -1;
          if (b.when) return 1;
          return 0;
        });

      if (played.length) recent.push({ ...info, ...played[0] });
    });

    recent.sort((a, b) => {
      if (a.when && b.when) return b.when - a.when;
      if (a.when) return -1;
      if (b.when) return 1;
      return 0;
    });

    if (!recent.length) {
      root.innerHTML = `
        <div class="dynamic-empty">
          <strong>RISULTATI IN AGGIORNAMENTO</strong>
          <span>I risultati compariranno automaticamente quando saranno inseriti nei calendari.</span>
        </div>`;
      return;
    }

    root.innerHTML = recent.map(item => {
      const g = item.game;
      const date = g.date || g.data || "";
      const home = g.home || g.casa || "";
      const away = g.away || g.trasferta || "";

      return `
        <article class="result-card">
          <div class="result-top">
            <span class="result-sport">${esc(item.label)}</span>
            <span class="result-icon">${item.icon}</span>
          </div>
          <div class="result-date">${esc(date)}</div>
          <div class="result-match">
            <strong>${esc(home)}</strong>
            <b>${esc(item.homeScore)} - ${esc(item.awayScore)}</b>
            <strong>${esc(away)}</strong>
          </div>
          <a href="${esc(item.page)}">Vai al calendario →</a>
        </article>`;
    }).join("");
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

      renderHomeUpcoming(data);

      renderHomeRecentResults(data);


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
