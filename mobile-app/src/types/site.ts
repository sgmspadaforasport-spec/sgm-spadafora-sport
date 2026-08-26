export type Person = { name: string; role?: string; number?: number; image?: string };
export type Match = { sport?: string; home?: string; away?: string; date?: string; time?: string; home_score?: string | number; away_score?: string | number };
export type Standing = { pos?: number; team?: string; points?: number; played?: number; won?: number; drawn?: number; lost?: number; for?: number; against?: number };
export type Sport = { name?: string; league_name?: string; roster?: Person[]; staff?: Person[]; calendar?: Match[]; standings?: Standing[] };
export type NewsItem = { title?: string; excerpt?: string; body?: string; date?: string; image?: string };
export type SitePayload = {
  season?: string;
  home_hero?: { title?: string; subtitle?: string; image?: string; show_logo?: boolean };
  next_matches?: Match[];
  recent_results?: Match[];
  sports?: Record<string, Sport>;
  news?: NewsItem[];
  sponsors?: unknown[];
  gallery?: unknown[];
  palmares?: unknown[];
  sgm_tv?: unknown[];
  contacts?: Record<string, unknown>;
  general_staff?: Person[];
};
