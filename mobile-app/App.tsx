import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type TabName = 'Home' | 'Squadre' | 'News' | 'Risultati' | 'Altro';

const SUPABASE_URL = 'https://vgxatjdtawugxkzjkyxw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4FuMVey4xj_B55InGcb1uw_pSMZ9Lk_';
const TABS: TabName[] = ['Home', 'Squadre', 'News', 'Risultati', 'Altro'];
const SPORT_KEYS = ['calcio_a_5', 'pallavolo_maschile', 'pallavolo_femminile', 'basket', 'settore_giovanile'];
const SPORT_LABELS: Record<string, string> = {
  calcio_a_5: 'Calcio a 5',
  pallavolo_maschile: 'Pallavolo maschile',
  pallavolo_femminile: 'Pallavolo femminile',
  basket: 'Basket',
  settore_giovanile: 'Settore giovanile',
};

const C = {
  black: '#080808',
  panel: '#121212',
  panel2: '#191919',
  yellow: '#F3C600',
  white: '#FFFFFF',
  gray: '#A7A7A7',
  border: '#2A2A2A',
};

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : [];
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function HomeScreen({ data }: { data: any }) {
  const nextMatches = asArray(data?.next_matches).slice(0, 3);
  const results = asArray(data?.recent_results).slice(0, 3);
  const news = asArray(data?.news).slice(0, 3);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>ASD SGM SPADAFORA SPORT</Text>
        <Text style={styles.heroTitle}>Stagione sportiva 2026/2027</Text>
        <Text style={styles.heroText}>Tutto il mondo SGM in un'unica app.</Text>
      </View>

      <SectionTitle title="Prossime gare" />
      {nextMatches.length === 0 ? <Card><Text style={styles.muted}>Nessuna gara programmata.</Text></Card> : null}
      {nextMatches.map((m, i) => (
        <Card key={`m-${i}`}>
          <Text style={styles.yellow}>{m?.sport || 'SGM'}</Text>
          <Text style={styles.cardTitle}>{m?.home || '—'}  vs  {m?.away || '—'}</Text>
          <Text style={styles.muted}>{[m?.date, m?.time].filter(Boolean).join(' · ')}</Text>
        </Card>
      ))}

      <SectionTitle title="Ultimi risultati" />
      {results.length === 0 ? <Card><Text style={styles.muted}>Risultati in aggiornamento.</Text></Card> : null}
      {results.map((m, i) => (
        <Card key={`r-${i}`}>
          <Text style={styles.yellow}>{m?.sport || 'SGM'}</Text>
          <Text style={styles.cardTitle}>{m?.home || '—'} {m?.home_score ?? '-'} : {m?.away_score ?? '-'} {m?.away || '—'}</Text>
        </Card>
      ))}

      <SectionTitle title="Ultime news" />
      {news.length === 0 ? <Card><Text style={styles.muted}>News in aggiornamento.</Text></Card> : null}
      {news.map((n, i) => (
        <Card key={`n-${i}`}>
          <Text style={styles.cardTitle}>{n?.title || 'News SGM'}</Text>
          <Text style={styles.muted}>{n?.date || ''}</Text>
          <Text style={styles.body} numberOfLines={3}>{n?.excerpt || n?.body || ''}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

function TeamsScreen({ data }: { data: any }) {
  const sports = data?.sports || {};
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <SectionTitle title="Le nostre squadre" />
      {SPORT_KEYS.map((key) => {
        const s = sports?.[key];
        return (
          <Card key={key}>
            <Text style={styles.cardTitle}>{s?.name || SPORT_LABELS[key]}</Text>
            <Text style={styles.yellow}>{s?.league_name || 'Stagione 2026/2027'}</Text>
            <Text style={styles.muted}>{asArray(s?.roster).length} atleti · {asArray(s?.staff).length} staff</Text>
          </Card>
        );
      })}
    </ScrollView>
  );
}

function NewsScreen({ data }: { data: any }) {
  const news = asArray(data?.news);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <SectionTitle title="News" />
      {news.length === 0 ? <Card><Text style={styles.muted}>News in aggiornamento.</Text></Card> : null}
      {news.map((n, i) => (
        <Card key={`news-${i}`}>
          <Text style={styles.cardTitle}>{n?.title || 'News SGM'}</Text>
          <Text style={styles.muted}>{n?.date || ''}</Text>
          <Text style={styles.body}>{n?.body || n?.excerpt || ''}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

function ResultsScreen({ data }: { data: any }) {
  const results = asArray(data?.recent_results);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <SectionTitle title="Risultati" />
      {results.length === 0 ? <Card><Text style={styles.muted}>Risultati in aggiornamento.</Text></Card> : null}
      {results.map((m, i) => (
        <Card key={`result-${i}`}>
          <Text style={styles.yellow}>{m?.sport || 'SGM'}</Text>
          <Text style={styles.cardTitle}>{m?.home || '—'} {m?.home_score ?? '-'} : {m?.away_score ?? '-'} {m?.away || '—'}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

function MoreScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <SectionTitle title="Altro" />
      <Card><Text style={styles.cardTitle}>Palmarès</Text><Text style={styles.muted}>Trofei e risultati della società.</Text></Card>
      <Card><Text style={styles.cardTitle}>SGM TV</Text><Text style={styles.muted}>Video e contenuti multimediali.</Text></Card>
      <Card><Text style={styles.cardTitle}>Sponsor</Text><Text style={styles.muted}>I partner di ASD SGM Spadafora Sport.</Text></Card>
    </ScrollView>
  );
}

export default function App() {
  const [active, setActive] = useState<TabName>('Home');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/site_data?id=eq.1&select=payload`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rows = await response.json();
        if (alive && Array.isArray(rows) && rows[0]?.payload) {
          setData(rows[0].payload);
          setOnline(true);
        }
      } catch {
        if (alive) setOnline(false);
      } finally {
        if (alive) setLoading(false);
      }
    }, 350);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const screen = useMemo(() => {
    if (active === 'Squadre') return <TeamsScreen data={data} />;
    if (active === 'News') return <NewsScreen data={data} />;
    if (active === 'Risultati') return <ResultsScreen data={data} />;
    if (active === 'Altro') return <MoreScreen />;
    return <HomeScreen data={data} />;
  }, [active, data]);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="light" backgroundColor={C.black} />
      <View style={styles.androidTopPad} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerKicker}>ASD</Text>
          <Text style={styles.headerTitle}>SGM SPADAFORA SPORT</Text>
        </View>
        <View style={[styles.statusDot, online && styles.statusDotOnline]} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={C.yellow} />
            <Text style={styles.muted}>Caricamento SGM…</Text>
          </View>
        ) : screen}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const selected = active === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActive(tab)}
              style={({ pressed }) => [styles.tabButton, selected && styles.tabButtonActive, pressed && styles.pressed]}
            >
              <Text style={[styles.tabSymbol, selected && styles.tabTextActive]}>{tab === 'Home' ? '⌂' : tab === 'Squadre' ? '●' : tab === 'News' ? '▤' : tab === 'Risultati' ? '★' : '☰'}</Text>
              <Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.black },
  androidTopPad: { height: NativeStatusBar.currentHeight || 0 },
  header: { height: 58, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: C.border },
  headerKicker: { color: C.yellow, fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { color: C.white, fontSize: 15, fontWeight: '900' },
  statusDot: { width: 9, height: 9, borderRadius: 9, backgroundColor: '#666' },
  statusDotOnline: { backgroundColor: C.yellow },
  content: { flex: 1 },
  screen: { flex: 1, backgroundColor: C.black },
  scrollContent: { paddingTop: 12, paddingBottom: 24 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  hero: { margin: 16, padding: 22, borderRadius: 22, backgroundColor: C.panel2, borderWidth: 1, borderColor: '#3A3210' },
  kicker: { color: C.yellow, fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  heroTitle: { color: C.white, fontSize: 29, lineHeight: 34, fontWeight: '900', marginTop: 8 },
  heroText: { color: C.gray, fontSize: 14, marginTop: 8 },
  sectionTitle: { color: C.white, fontSize: 24, fontWeight: '900', marginHorizontal: 18, marginTop: 16, marginBottom: 10 },
  card: { marginHorizontal: 16, marginBottom: 10, padding: 16, borderRadius: 17, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border },
  cardTitle: { color: C.white, fontSize: 17, fontWeight: '900', marginBottom: 5 },
  yellow: { color: C.yellow, fontSize: 12, fontWeight: '900', marginBottom: 5 },
  muted: { color: C.gray, fontSize: 13, lineHeight: 19 },
  body: { color: C.white, fontSize: 14, lineHeight: 21, marginTop: 8 },
  tabBar: { height: 78, paddingBottom: 10, flexDirection: 'row', backgroundColor: '#0A0A0A', borderTopWidth: 1, borderTopColor: C.border },
  tabButton: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  tabButtonActive: { borderTopWidth: 3, borderTopColor: C.yellow, backgroundColor: '#111111' },
  tabSymbol: { color: '#8C8C8C', fontSize: 18, fontWeight: '900', lineHeight: 20 },
  tabText: { color: '#8C8C8C', fontSize: 9, fontWeight: '800', marginTop: 3 },
  tabTextActive: { color: C.yellow },
  pressed: { opacity: 0.6 },
});
