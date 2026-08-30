import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
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
  pallavolo_maschile: 'Pallavolo M',
  pallavolo_femminile: 'Pallavolo F',
  basket: 'Basket',
  settore_giovanile: 'Giovanili',
};
const SPORT_ICONS: Record<string, string> = {
  calcio_a_5: '⚽',
  pallavolo_maschile: '🏐',
  pallavolo_femminile: '🏐',
  basket: '🏀',
  settore_giovanile: '★',
};
const TAB_ICONS: Record<TabName, string> = {
  Home: '⌂', Squadre: '♟', News: '▤', Risultati: '🏆', Altro: '☰',
};

const C = {
  black: '#050505',
  black2: '#0C0C0C',
  panel: '#111111',
  panel2: '#171717',
  yellow: '#F3C600',
  yellowSoft: '#D7AF00',
  white: '#FFFFFF',
  gray: '#A2A2A2',
  gray2: '#737373',
  border: '#272727',
};

function asArray(value: any): any[] { return Array.isArray(value) ? value : []; }
function compactDate(value: any) { return typeof value === 'string' ? value : ''; }

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return (
    <View style={styles.sectionHead}>
      <View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function MatchCard({ m, result = false }: { m: any; result?: boolean }) {
  return (
    <View style={styles.matchCard}>
      <View style={styles.matchAccent} />
      <View style={styles.matchBody}>
        <View style={styles.matchMetaRow}>
          <Text style={styles.matchSport}>{m?.sport || 'SGM'}</Text>
          <Text style={styles.matchDate}>{[m?.date, m?.time].filter(Boolean).join(' · ')}</Text>
        </View>
        <View style={styles.teamsRow}>
          <Text style={styles.teamName} numberOfLines={2}>{m?.home || '—'}</Text>
          {result ? (
            <View style={styles.scoreBox}><Text style={styles.scoreText}>{m?.home_score ?? '-'} : {m?.away_score ?? '-'}</Text></View>
          ) : (
            <View style={styles.vsBox}><Text style={styles.vsText}>VS</Text></View>
          )}
          <Text style={[styles.teamName, styles.teamAway]} numberOfLines={2}>{m?.away || '—'}</Text>
        </View>
      </View>
    </View>
  );
}

function HomeScreen({ data }: { data: any }) {
  const nextMatches = asArray(data?.next_matches).slice(0, 3);
  const results = asArray(data?.recent_results).slice(0, 3);
  const news = asArray(data?.news).slice(0, 3);
  const sports = data?.sports || {};

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroSlashOne} />
        <View style={styles.heroSlashTwo} />
        <View style={styles.heroSeason}><Text style={styles.heroSeasonText}>2026 / 2027</Text></View>
        <Text style={styles.heroKicker}>ASD SGM SPADAFORA SPORT</Text>
        <Text style={styles.heroTitle}>PASSIONE.{`\n`}SQUADRA.{`\n`}TERRITORIO.</Text>
        <Text style={styles.heroText}>Il mondo giallonero sempre con te.</Text>
        <View style={styles.heroBottom}>
          <View style={styles.heroLine} />
          <Text style={styles.heroBottomText}>NOI SIAMO SGM</Text>
        </View>
      </View>

      <SectionHeader eyebrow="LE NOSTRE DISCIPLINE" title="Tutto SGM" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sportsRow}>
        {SPORT_KEYS.map((key) => {
          const s = sports?.[key];
          return (
            <View style={styles.sportTile} key={key}>
              <View style={styles.sportIconCircle}><Text style={styles.sportIcon}>{SPORT_ICONS[key]}</Text></View>
              <Text style={styles.sportName}>{s?.name || SPORT_LABELS[key]}</Text>
              <Text style={styles.sportLeague} numberOfLines={1}>{s?.league_name || 'SGM'}</Text>
            </View>
          );
        })}
      </ScrollView>

      <SectionHeader eyebrow="MATCH CENTER" title="Prossime gare" action="SGM LIVE" />
      {nextMatches.length === 0 ? <View style={styles.emptyCard}><Text style={styles.muted}>Nessuna gara programmata.</Text></View> : null}
      {nextMatches.map((m, i) => <MatchCard key={`m-${i}`} m={m} />)}

      <SectionHeader eyebrow="DAL CAMPO" title="Ultimi risultati" />
      {results.length === 0 ? <View style={styles.emptyCard}><Text style={styles.muted}>Risultati in aggiornamento.</Text></View> : null}
      {results.map((m, i) => <MatchCard key={`r-${i}`} m={m} result />)}

      <SectionHeader eyebrow="MONDO SGM" title="Ultime news" />
      {news.length === 0 ? <View style={styles.emptyCard}><Text style={styles.muted}>News in aggiornamento.</Text></View> : null}
      {news.map((n, i) => (
        <View style={styles.newsCard} key={`n-${i}`}>
          {n?.image ? <Image source={{ uri: n.image }} style={styles.newsImage} /> : <View style={styles.newsImageFallback}><Text style={styles.newsFallbackText}>SGM</Text></View>}
          <View style={styles.newsContent}>
            <Text style={styles.newsDate}>{compactDate(n?.date) || 'NEWS'}</Text>
            <Text style={styles.newsTitle} numberOfLines={2}>{n?.title || 'News SGM'}</Text>
            <Text style={styles.newsExcerpt} numberOfLines={3}>{n?.excerpt || n?.body || ''}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function TeamsScreen({ data }: { data: any }) {
  const sports = data?.sports || {};
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pageIntro}>
        <Text style={styles.pageEyebrow}>STAGIONE 2026/2027</Text>
        <Text style={styles.pageTitle}>LE NOSTRE{`\n`}SQUADRE</Text>
        <Text style={styles.pageSubtitle}>Cinque anime, un solo stemma.</Text>
      </View>
      {SPORT_KEYS.map((key, index) => {
        const s = sports?.[key];
        return (
          <View style={styles.teamCard} key={key}>
            <Text style={styles.teamIndex}>0{index + 1}</Text>
            <View style={styles.teamIconWrap}><Text style={styles.teamIcon}>{SPORT_ICONS[key]}</Text></View>
            <View style={styles.teamInfo}>
              <Text style={styles.teamCardName}>{s?.name || SPORT_LABELS[key]}</Text>
              <Text style={styles.teamLeague}>{s?.league_name || 'Stagione 2026/2027'}</Text>
              <Text style={styles.teamStats}>{asArray(s?.roster).length} ATLETI  ·  {asArray(s?.staff).length} STAFF</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

function NewsScreen({ data }: { data: any }) {
  const news = asArray(data?.news);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pageIntroCompact}>
        <Text style={styles.pageEyebrow}>DAL MONDO GIALLONERO</Text>
        <Text style={styles.pageTitle}>NEWS</Text>
      </View>
      {news.length === 0 ? <View style={styles.emptyCard}><Text style={styles.muted}>News in aggiornamento.</Text></View> : null}
      {news.map((n, i) => (
        <View style={styles.newsCard} key={`news-${i}`}>
          {n?.image ? <Image source={{ uri: n.image }} style={styles.newsImage} /> : <View style={styles.newsImageFallback}><Text style={styles.newsFallbackText}>SGM</Text></View>}
          <View style={styles.newsContent}>
            <Text style={styles.newsDate}>{compactDate(n?.date) || 'NEWS'}</Text>
            <Text style={styles.newsTitle}>{n?.title || 'News SGM'}</Text>
            <Text style={styles.newsExcerpt}>{n?.body || n?.excerpt || ''}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function ResultsScreen({ data }: { data: any }) {
  const results = asArray(data?.recent_results);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.pageIntroCompact}>
        <Text style={styles.pageEyebrow}>MATCH CENTER</Text>
        <Text style={styles.pageTitle}>RISULTATI</Text>
      </View>
      {results.length === 0 ? <View style={styles.emptyCard}><Text style={styles.muted}>Risultati in aggiornamento.</Text></View> : null}
      {results.map((m, i) => <MatchCard key={`result-${i}`} m={m} result />)}
    </ScrollView>
  );
}

function MoreScreen() {
  const [showNotify, setShowNotify] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const sendNotification = async () => {
    if (!email.trim() || !password || !title.trim() || !message.trim()) {
      Alert.alert('Dati mancanti', 'Inserisci email, password, titolo e testo della notifica.');
      return;
    }
    setSending(true);
    try {
      const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const loginData = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok || !loginData?.access_token) {
        throw new Error(loginData?.error_description || loginData?.msg || 'Credenziali amministratore non valide.');
      }

      const notifyRes = await fetch(`${SUPABASE_URL}/functions/v1/send-app-notification`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${loginData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'custom', title: title.trim(), body: message.trim() }),
      });
      const result = await notifyRes.json().catch(() => ({}));
      if (!notifyRes.ok || result?.error) throw new Error(result?.error || 'Invio non riuscito.');

      setTitle('');
      setMessage('');
      setPassword('');
      Alert.alert('Notifica inviata', `Invio completato. Destinatari: ${result?.recipients ?? 0} · Inviate: ${result?.sent ?? 0}.`);
    } catch (e: any) {
      Alert.alert('Errore', e?.message || 'Impossibile inviare la notifica.');
    } finally {
      setSending(false);
    }
  };

  const items = [
    ['🏆', 'Palmarès', 'Trofei e traguardi della società'],
    ['▶', 'SGM TV', 'Video, interviste e contenuti'],
    ['◆', 'Sponsor', 'I partner che credono nel progetto'],
    ['◎', 'Contatti', 'Rimani in contatto con SGM'],
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.pageIntroCompact}>
        <Text style={styles.pageEyebrow}>ASD SGM SPADAFORA SPORT</Text>
        <Text style={styles.pageTitle}>ALTRO</Text>
      </View>

      <Pressable onPress={() => setShowNotify((v) => !v)} style={({ pressed }) => [styles.notifyButton, pressed && styles.pressed]}>
        <View style={styles.notifyButtonIcon}><Text style={styles.notifyButtonIconText}>🔔</Text></View>
        <View style={styles.notifyButtonCopy}>
          <Text style={styles.notifyButtonEyebrow}>AREA AMMINISTRATORE</Text>
          <Text style={styles.notifyButtonTitle}>INVIA NOTIFICA</Text>
        </View>
        <Text style={styles.notifyButtonArrow}>{showNotify ? '⌃' : '›'}</Text>
      </Pressable>

      {showNotify ? (
        <View style={styles.notifyPanel}>
          <Text style={styles.notifyPanelTitle}>Notifica push</Text>
          <Text style={styles.notifyPanelText}>Accedi con l'account amministratore e invia un messaggio agli utenti registrati.</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email amministratore"
            placeholderTextColor={C.gray2}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={C.gray2}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Titolo notifica"
            placeholderTextColor={C.gray2}
            maxLength={80}
            style={styles.input}
          />
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Scrivi il messaggio..."
            placeholderTextColor={C.gray2}
            multiline
            maxLength={500}
            textAlignVertical="top"
            style={[styles.input, styles.messageInput]}
          />
          <Pressable disabled={sending} onPress={sendNotification} style={({ pressed }) => [styles.sendButton, (pressed || sending) && styles.pressed]}>
            {sending ? <ActivityIndicator size="small" color={C.black} /> : <Text style={styles.sendButtonText}>INVIA A TUTTI</Text>}
          </Pressable>
          <Text style={styles.notifySecurity}>Accesso protetto dalle credenziali amministratore.</Text>
        </View>
      ) : null}

      {items.map(([icon, itemTitle, text]) => (
        <View style={styles.moreCard} key={itemTitle}>
          <View style={styles.moreIcon}><Text style={styles.moreIconText}>{icon}</Text></View>
          <View style={styles.moreInfo}><Text style={styles.moreTitle}>{itemTitle}</Text><Text style={styles.moreText}>{text}</Text></View>
          <Text style={styles.chevron}>›</Text>
        </View>
      ))}
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
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
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
    }, 300);
    return () => { alive = false; clearTimeout(timer); };
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
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>SGM</Text></View>
        <View style={styles.brandCopy}>
          <Text style={styles.headerKicker}>ASD</Text>
          <Text style={styles.headerTitle}>SPADAFORA SPORT</Text>
        </View>
        <View style={styles.liveWrap}><View style={[styles.statusDot, online && styles.statusDotOnline]} /><Text style={styles.liveText}>{online ? 'LIVE' : 'APP'}</Text></View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <View style={styles.loaderBadge}><Text style={styles.loaderBadgeText}>SGM</Text></View>
            <ActivityIndicator size="small" color={C.yellow} />
            <Text style={styles.muted}>Caricamento mondo giallonero…</Text>
          </View>
        ) : screen}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const selected = active === tab;
          return (
            <Pressable key={tab} onPress={() => setActive(tab)} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
              <View style={[styles.tabIconWrap, selected && styles.tabIconWrapActive]}>
                <Text style={[styles.tabSymbol, selected && styles.tabSymbolActive]}>{TAB_ICONS[tab]}</Text>
              </View>
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
  header: { height: 64, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1D1D1D', backgroundColor: C.black },
  brandMark: { width: 42, height: 42, borderRadius: 10, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-3deg' }] },
  brandMarkText: { color: C.black, fontSize: 13, fontWeight: '900', letterSpacing: -0.5 },
  brandCopy: { flex: 1, marginLeft: 11 },
  headerKicker: { color: C.yellow, fontSize: 8, fontWeight: '900', letterSpacing: 2.3 },
  headerTitle: { color: C.white, fontSize: 14, fontWeight: '900', letterSpacing: 0.5, marginTop: 1 },
  liveWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 6, gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 6, backgroundColor: '#666' },
  statusDotOnline: { backgroundColor: C.yellow },
  liveText: { color: C.gray, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  content: { flex: 1 },
  screen: { flex: 1, backgroundColor: C.black },
  scrollContent: { paddingBottom: 28 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loaderBadge: { width: 72, height: 72, borderRadius: 20, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', marginBottom: 4, transform: [{ rotate: '-4deg' }] },
  loaderBadgeText: { color: C.black, fontSize: 22, fontWeight: '900' },
  hero: { margin: 14, height: 300, borderRadius: 28, backgroundColor: '#14120A', padding: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#332C0A', justifyContent: 'center' },
  heroSlashOne: { position: 'absolute', width: 120, height: 430, backgroundColor: C.yellow, right: -80, top: -70, transform: [{ rotate: '18deg' }] },
  heroSlashTwo: { position: 'absolute', width: 20, height: 430, backgroundColor: '#6C5900', right: 52, top: -60, transform: [{ rotate: '18deg' }], opacity: 0.55 },
  heroSeason: { position: 'absolute', right: 18, top: 18, backgroundColor: C.black, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 8 },
  heroSeasonText: { color: C.yellow, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  heroKicker: { color: C.yellow, fontSize: 9, fontWeight: '900', letterSpacing: 1.7, marginBottom: 11 },
  heroTitle: { color: C.white, fontSize: 39, lineHeight: 40, fontWeight: '900', letterSpacing: -1.8, maxWidth: '82%' },
  heroText: { color: '#D0D0D0', fontSize: 14, marginTop: 13, fontWeight: '600' },
  heroBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  heroLine: { width: 28, height: 3, backgroundColor: C.yellow, marginRight: 9 },
  heroBottomText: { color: C.white, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  sectionHead: { marginHorizontal: 17, marginTop: 22, marginBottom: 11, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  eyebrow: { color: C.yellow, fontSize: 8, fontWeight: '900', letterSpacing: 1.8, marginBottom: 4 },
  sectionTitle: { color: C.white, fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  sectionAction: { color: C.gray2, fontSize: 8, fontWeight: '900', letterSpacing: 1.2, marginBottom: 4 },
  sportsRow: { paddingHorizontal: 14, paddingRight: 24, gap: 10 },
  sportTile: { width: 142, height: 150, borderRadius: 22, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, padding: 15, justifyContent: 'flex-end' },
  sportIconCircle: { position: 'absolute', top: 14, left: 14, width: 45, height: 45, borderRadius: 14, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  sportIcon: { fontSize: 21 },
  sportName: { color: C.white, fontSize: 15, fontWeight: '900', marginBottom: 4 },
  sportLeague: { color: C.gray2, fontSize: 10, fontWeight: '700' },
  matchCard: { marginHorizontal: 14, marginBottom: 10, minHeight: 122, flexDirection: 'row', borderRadius: 20, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  matchAccent: { width: 5, backgroundColor: C.yellow },
  matchBody: { flex: 1, padding: 15 },
  matchMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  matchSport: { color: C.yellow, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  matchDate: { color: C.gray2, fontSize: 10, fontWeight: '700' },
  teamsRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  teamName: { flex: 1, color: C.white, fontSize: 14, fontWeight: '900', lineHeight: 18 },
  teamAway: { textAlign: 'right' },
  vsBox: { width: 36, height: 30, borderRadius: 9, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  vsText: { color: C.black, fontSize: 9, fontWeight: '900' },
  scoreBox: { minWidth: 58, height: 34, borderRadius: 10, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  scoreText: { color: C.black, fontSize: 15, fontWeight: '900' },
  emptyCard: { marginHorizontal: 14, marginBottom: 10, padding: 18, borderRadius: 18, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border },
  newsCard: { marginHorizontal: 14, marginBottom: 13, borderRadius: 22, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  newsImage: { width: '100%', height: 190, backgroundColor: C.panel2 },
  newsImageFallback: { height: 145, backgroundColor: '#17150B', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#302A0D' },
  newsFallbackText: { color: C.yellow, fontSize: 52, fontWeight: '900', letterSpacing: -4, transform: [{ rotate: '-4deg' }] },
  newsContent: { padding: 17 },
  newsDate: { color: C.yellow, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginBottom: 7 },
  newsTitle: { color: C.white, fontSize: 20, lineHeight: 24, fontWeight: '900', letterSpacing: -0.35 },
  newsExcerpt: { color: C.gray, fontSize: 13, lineHeight: 20, marginTop: 8 },
  pageIntro: { minHeight: 190, paddingHorizontal: 18, paddingTop: 28, paddingBottom: 22, backgroundColor: '#111008', borderBottomWidth: 1, borderBottomColor: '#2B2509' },
  pageIntroCompact: { paddingHorizontal: 18, paddingTop: 26, paddingBottom: 20, marginBottom: 4 },
  pageEyebrow: { color: C.yellow, fontSize: 9, fontWeight: '900', letterSpacing: 1.8, marginBottom: 8 },
  pageTitle: { color: C.white, fontSize: 38, lineHeight: 39, fontWeight: '900', letterSpacing: -1.5 },
  pageSubtitle: { color: C.gray, fontSize: 13, marginTop: 10, fontWeight: '600' },
  teamCard: { marginHorizontal: 14, marginTop: 11, minHeight: 118, borderRadius: 22, borderWidth: 1, borderColor: C.border, backgroundColor: C.panel, flexDirection: 'row', alignItems: 'center', padding: 15, overflow: 'hidden' },
  teamIndex: { position: 'absolute', right: 38, top: -11, color: '#202020', fontSize: 58, fontWeight: '900' },
  teamIconWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  teamIcon: { fontSize: 24 },
  teamInfo: { flex: 1, marginLeft: 14, zIndex: 2 },
  teamCardName: { color: C.white, fontSize: 17, fontWeight: '900', marginBottom: 4 },
  teamLeague: { color: C.yellow, fontSize: 10, fontWeight: '900', marginBottom: 7 },
  teamStats: { color: C.gray2, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  chevron: { color: C.gray2, fontSize: 30, fontWeight: '300', marginLeft: 5, zIndex: 2 },
  notifyButton: { marginHorizontal: 14, marginBottom: 12, minHeight: 92, borderRadius: 22, backgroundColor: C.yellow, padding: 14, flexDirection: 'row', alignItems: 'center' },
  notifyButtonIcon: { width: 56, height: 56, borderRadius: 17, backgroundColor: C.black, alignItems: 'center', justifyContent: 'center' },
  notifyButtonIconText: { fontSize: 23 },
  notifyButtonCopy: { flex: 1, marginLeft: 13 },
  notifyButtonEyebrow: { color: '#594900', fontSize: 8, fontWeight: '900', letterSpacing: 1.3, marginBottom: 4 },
  notifyButtonTitle: { color: C.black, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  notifyButtonArrow: { color: C.black, fontSize: 32, fontWeight: '900', marginHorizontal: 4 },
  notifyPanel: { marginHorizontal: 14, marginBottom: 15, padding: 17, borderRadius: 22, backgroundColor: C.panel, borderWidth: 1, borderColor: '#453A0B' },
  notifyPanelTitle: { color: C.white, fontSize: 21, fontWeight: '900', marginBottom: 5 },
  notifyPanelText: { color: C.gray, fontSize: 12, lineHeight: 18, marginBottom: 13 },
  input: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: '#0A0A0A', color: C.white, paddingHorizontal: 14, fontSize: 14, marginBottom: 10 },
  messageInput: { minHeight: 105, paddingTop: 14, paddingBottom: 14 },
  sendButton: { height: 52, borderRadius: 14, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  sendButtonText: { color: C.black, fontSize: 13, fontWeight: '900', letterSpacing: 1.1 },
  notifySecurity: { color: C.gray2, fontSize: 9, lineHeight: 13, textAlign: 'center', marginTop: 10 },
  moreCard: { marginHorizontal: 14, marginBottom: 10, minHeight: 84, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.panel, padding: 13, flexDirection: 'row', alignItems: 'center' },
  moreIcon: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#1D1A0B', borderWidth: 1, borderColor: '#3A320D', alignItems: 'center', justifyContent: 'center' },
  moreIconText: { color: C.yellow, fontSize: 20, fontWeight: '900' },
  moreInfo: { flex: 1, marginLeft: 13 },
  moreTitle: { color: C.white, fontSize: 16, fontWeight: '900', marginBottom: 3 },
  moreText: { color: C.gray2, fontSize: 11, lineHeight: 16 },
  muted: { color: C.gray, fontSize: 13, lineHeight: 19 },
  tabBar: { height: 82, paddingBottom: 9, flexDirection: 'row', alignItems: 'center', backgroundColor: '#090909', borderTopWidth: 1, borderTopColor: '#202020' },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 66 },
  tabIconWrap: { width: 36, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabIconWrapActive: { backgroundColor: C.yellow },
  tabSymbol: { color: '#858585', fontSize: 17, fontWeight: '900' },
  tabSymbolActive: { color: C.black },
  tabText: { color: '#777', fontSize: 8, fontWeight: '900', marginTop: 4 },
  tabTextActive: { color: C.yellow },
  pressed: { opacity: 0.58 },
});
