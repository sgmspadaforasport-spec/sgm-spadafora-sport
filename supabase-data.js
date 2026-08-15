// ============================================================
// SGM SPADAFORA SPORT
// Gestione dati online con Supabase
// ============================================================

const SGM_TABLE = "site_data";
const SGM_ROW_ID = 1;

// ------------------------------------------------------------
// CLIENT SUPABASE
// ------------------------------------------------------------

function getSGMSupabase() {
  if (window.sgmSupabase) {
    return window.sgmSupabase;
  }

  console.error("Supabase non inizializzato. Controlla supabase-config.js");
  return null;
}

// ------------------------------------------------------------
// LETTURA DATI ONLINE
// ------------------------------------------------------------

async function loadSiteData() {
  const supabase = getSGMSupabase();

  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(SGM_TABLE)
      .select("payload")
      .eq("id", SGM_ROW_ID)
      .single();

    if (error) {
      console.error("Errore caricamento dati:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data.payload || {};

  } catch (error) {
    console.error("Errore durante il caricamento:", error);
    return null;
  }
}

// ------------------------------------------------------------
// SALVATAGGIO DATI ONLINE
// ------------------------------------------------------------

async function saveSiteData(payload) {
  const supabase = getSGMSupabase();

  if (!supabase) {
    return {
      success: false,
      error: "Supabase non inizializzato"
    };
  }

  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Utente non autenticato");

      return {
        success: false,
        error: "Devi effettuare il login come amministratore."
      };
    }

    const { error } = await supabase
      .from(SGM_TABLE)
      .update({
        payload: payload,
        updated_at: new Date().toISOString()
      })
      .eq("id", SGM_ROW_ID);

    if (error) {
      console.error("Errore salvataggio:", error);

      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error("Errore durante il salvataggio:", error);

    return {
      success: false,
      error: error.message
    };
  }
}

// ------------------------------------------------------------
// AGGIORNAMENTO PARZIALE
// ------------------------------------------------------------

async function updateSiteData(section, value) {
  const currentData = await loadSiteData();

  if (!currentData) {
    return {
      success: false,
      error: "Impossibile caricare i dati attuali."
    };
  }

  currentData[section] = value;

  return await saveSiteData(currentData);
}

// ------------------------------------------------------------
// CONTROLLO LOGIN ADMIN
