import { supabase } from './supabase';
import type { SitePayload } from '../types/site';

export async function fetchSiteData(): Promise<SitePayload> {
  const { data, error } = await supabase
    .from('site_data')
    .select('payload, updated_at')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return (data?.payload ?? {}) as SitePayload;
}

export function subscribeSiteData(onChange: () => void) {
  const channel = supabase
    .channel('sgm-site-data-app')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_data', filter: 'id=eq.1' }, onChange)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
