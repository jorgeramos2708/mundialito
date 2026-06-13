import { useState, useEffect, useCallback } from 'react'
import { FLAGS } from '../lib/matches'

const toDate = (d) => new Date(d)
const now = () => new Date()

// ─── Team resolver ─────────────────────────────────────────────────────────────
const TEAMS = {
  // Grupo A
  'México':          { flag: '🇲🇽', es: 'México' },
  'Sudáfrica':       { flag: '🇿🇦', es: 'Sudáfrica' },
  'Corea del Sur':   { flag: '🇰🇷', es: 'Corea del Sur' },
  'Chequia':         { flag: '🇨🇿', es: 'Chequia' },
  // Grupo B
  'Canadá':          { flag: '🇨🇦', es: 'Canadá' },
  'Suiza':           { flag: '🇨🇭', es: 'Suiza' },
  'Qatar':           { flag: '🇶🇦', es: 'Qatar' },
  'Bosnia y Herzegovina': { flag: '🇧🇦', es: 'Bosnia y Herz.' },
  // Grupo C
  'Brasil':          { flag: '🇧🇷', es: 'Brasil' },
  'Marruecos':       { flag: '🇲🇦', es: 'Marruecos' },
  'Haití':           { flag: '🇭🇹', es: 'Haití' },
  'Escocia':         { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', es: 'Escocia' },
  // Grupo D
  'Estados Unidos':  { flag: '🇺🇸', es: 'Estados Unidos' },
  'Paraguay':        { flag: '🇵🇾', es: 'Paraguay' },
  'Australia':       { flag: '🇦🇺', es: 'Australia' },
  'Turquía':         { flag: '🇹🇷', es: 'Turquía' },
  // Grupo E
  'Alemania':        { flag: '🇩🇪', es: 'Alemania' },
  'Curazao':         { flag: '🇨🇼', es: 'Curazao' },
  'Costa de Marfil': { flag: '🇨🇮', es: 'Costa de Marfil' },
  'Ecuador':         { flag: '🇪🇨', es: 'Ecuador' },
  // Grupo F
  'Países Bajos':    { flag: '🇳🇱', es: 'Países Bajos' },
  'Japón':           { flag: '🇯🇵', es: 'Japón' },
  'Túnez':           { flag: '🇹🇳', es: 'Túnez' },
  'Suecia':          { flag: '🇸🇪', es: 'Suecia' },
  // Grupo G
  'Bélgica':         { flag: '🇧🇪', es: 'Bélgica' },
  'Egipto':          { flag: '🇪🇬', es: 'Egipto' },
  'Irán':            { flag: '🇮🇷', es: 'Irán' },
  'Nueva Zelanda':   { flag: '🇳🇿', es: 'Nueva Zelanda' },
  // Grupo H
  'España':          { flag: '🇪🇸', es: 'España' },
  'Cabo Verde':      { flag: '🇨🇻', es: 'Cabo Verde' },
  'Arabia Saudita':  { flag: '🇸🇦', es: 'Arabia Saudita' },
  'Uruguay':         { flag: '🇺🇾', es: 'Uruguay' },
  // Grupo I
  'Francia':         { flag: '🇫🇷', es: 'Francia' },
  'Senegal':         { flag: '🇸🇳', es: 'Senegal' },
  'Noruega':         { flag: '🇳🇴', es: 'Noruega' },
  'Iraq':            { flag: '🇮🇶', es: 'Iraq' },
  // Grupo J
  'Argentina':       { flag: '🇦🇷', es: 'Argentina' },
  'Argelia':         { flag: '🇩🇿', es: 'Argelia' },
  'Austria':         { flag: '🇦🇹', es: 'Austria' },
  'Jordania':        { flag: '🇯🇴', es: 'Jordania' },
  // Grupo K
  'Portugal':        { flag: '🇵🇹', es: 'Portugal' },
  'Colombia':        { flag: '🇨🇴', es: 'Colombia' },
  'Uzbekistán':      { flag: '🇺🇿', es: 'Uzbekistán' },
  'DR Congo':        { flag: '🇨🇩', es: 'DR Congo' },
  // Grupo L
  'Inglaterra':      { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', es: 'Inglaterra' },
  'Croacia':         { flag: '🇭🇷', es: 'Croacia' },
  'Ghana':           { flag: '🇬🇭', es: 'Ghana' },
  'Panamá':          { flag: '🇵🇦', es: 'Panamá' },
}

// Resuelve cualquier nombre/sigla al objeto { flag, es }
const ALIASES = {
  'Mexico':'México','South Africa':'Sudáfrica','South Korea':'Corea del Sur',
  'Korea Republic':'Corea del Sur','Czech Republic':'Chequia','Czechia':'Chequia',
  'Canada':'Canadá','Switzerland':'Suiza','Bosnia and Herzegovina':'Bosnia y Herzegovina',
  'Brazil':'Brasil','Morocco':'Marruecos','Haiti':'Haití','Scotland':'Escocia',
  'United States':'Estados Unidos','USA':'Estados Unidos','Turkey':'Turquía',
  'Germany':'Alemania','Curaçao':'Curazao',"Ivory Coast":'Costa de Marfil',
  "Côte d'Ivoire":'Costa de Marfil','Netherlands':'Países Bajos','Japan':'Japón',
  'Tunisia':'Túnez','Sweden':'Suecia','Belgium':'Bélgica','Egypt':'Egipto',
  'Iran':'Irán','New Zealand':'Nueva Zelanda','Spain':'España','Cape Verde':'Cabo Verde',
  'Saudi Arabia':'Arabia Saudita','France':'Francia','Norway':'Noruega',
  'Algeria':'Argelia','Jordan':'Jordania','Uzbekistan':'Uzbekistán',
  'England':'Inglaterra','Croatia':'Croacia','Panama':'Panamá',
  // siglas
  'MEX':'México','RSA':'Sudáfrica','KOR':'Corea del Sur','CZE':'Chequia',
  'CAN':'Canadá','SUI':'Suiza','QAT':'Qatar','BIH':'Bosnia y Herzegovina',
  'BRA':'Brasil','MAR':'Marruecos','HAI':'Haití','SCO':'Escocia',
  'USA':'Estados Unidos','PAR':'Paraguay','AUS':'Australia','TUR':'Turquía',
  'GER':'Alemania','CUW':'Curazao','CIV':'Costa de Marfil','ECU':'Ecuador',
  'NED':'Países Bajos','JPN':'Japón','TUN':'Túnez','SWE':'Suecia',
  'BEL':'Bélgica','EGY':'Egipto','IRN':'Irán','NZL':'Nueva Zelanda',
  'ESP':'España','CPV':'Cabo Verde','KSA':'Arabia Saudita','URU':'Uruguay',
  'FRA':'Francia','SEN':'Senegal','NOR':'Noruega','IRQ':'Iraq',
  'ARG':'Argentina','ALG':'Argelia','AUT':'Austria','JOR':'Jordania',
  'POR':'Portugal','COL':'Colombia','UZB':'Uzbekistán','COD':'DR Congo',
  'ENG':'Inglaterra','CRO':'Croacia','GHA':'Ghana','PAN':'Panamá',
}

function resolveTeam(raw) {
  if (!raw) return { flag: '🏳️', name: '?' }
  const esName = ALIASES[raw] || raw
  const team = TEAMS[esName]
  return { flag: team?.flag || FLAGS[esName] || '🏳️', name: team?.es || esName }
}

// ─── Calendario oficial del Mundial 2026 (fase de grupos) ────────────────────
// Horarios en UTC — se convierten a hora local del usuario
const SCHEDULE = [
  // Jornada 1 — 11 jun
  { id:'g1',  home:'México',        away:'Sudáfrica',          date:'2026-06-11T19:00:00Z', group:'A' },
  { id:'g2',  home:'Corea del Sur', away:'Chequia',            date:'2026-06-12T02:00:00Z', group:'A' },
  { id:'g3',  home:'Canadá',        away:'Suiza',              date:'2026-06-12T22:00:00Z', group:'B' },
  { id:'g4',  home:'Qatar',         away:'Bosnia y Herzegovina',date:'2026-06-13T02:00:00Z', group:'B' },
  { id:'g5',  home:'Brasil',        away:'Marruecos',          date:'2026-06-13T19:00:00Z', group:'C' },
  { id:'g6',  home:'Haití',         away:'Escocia',            date:'2026-06-14T02:00:00Z', group:'C' },
  { id:'g7',  home:'Estados Unidos',away:'Paraguay',           date:'2026-06-14T19:00:00Z', group:'D' },
  { id:'g8',  home:'Australia',     away:'Turquía',            date:'2026-06-15T02:00:00Z', group:'D' },
  { id:'g9',  home:'Alemania',      away:'Curazao',            date:'2026-06-15T22:00:00Z', group:'E' },
  { id:'g10', home:'Costa de Marfil',away:'Ecuador',           date:'2026-06-16T02:00:00Z', group:'E' },
  { id:'g11', home:'Países Bajos',  away:'Japón',              date:'2026-06-16T22:00:00Z', group:'F' },
  { id:'g12', home:'Túnez',         away:'Suecia',             date:'2026-06-17T02:00:00Z', group:'F' },
  { id:'g13', home:'Bélgica',       away:'Egipto',             date:'2026-06-17T22:00:00Z', group:'G' },
  { id:'g14', home:'Irán',          away:'Nueva Zelanda',      date:'2026-06-18T02:00:00Z', group:'G' },
  { id:'g15', home:'España',        away:'Cabo Verde',         date:'2026-06-18T22:00:00Z', group:'H' },
  { id:'g16', home:'Arabia Saudita',away:'Uruguay',            date:'2026-06-19T02:00:00Z', group:'H' },
  { id:'g17', home:'Francia',       away:'Senegal',            date:'2026-06-19T22:00:00Z', group:'I' },
  { id:'g18', home:'Noruega',       away:'Iraq',               date:'2026-06-20T02:00:00Z', group:'I' },
  { id:'g19', home:'Argentina',     away:'Argelia',            date:'2026-06-20T22:00:00Z', group:'J' },
  { id:'g20', home:'Austria',       away:'Jordania',           date:'2026-06-21T02:00:00Z', group:'J' },
  { id:'g21', home:'Portugal',      away:'Colombia',           date:'2026-06-21T22:00:00Z', group:'K' },
  { id:'g22', home:'Uzbekistán',    away:'DR Congo',           date:'2026-06-22T02:00:00Z', group:'K' },
  { id:'g23', home:'Inglaterra',    away:'Croacia',            date:'2026-06-22T22:00:00Z', group:'L' },
  { id:'g24', home:'Ghana',         away:'Panamá',             date:'2026-06-23T02:00:00Z', group:'L' },
  // Jornada 2 — 18-24 jun
  { id:'g25', home:'Chequia',       away:'Sudáfrica',          date:'2026-06-18T16:00:00Z', group:'A' },
  { id:'g26', home:'México',        away:'Corea del Sur',      date:'2026-06-19T16:00:00Z', group:'A' },
  { id:'g27', home:'Suiza',         away:'Qatar',              date:'2026-06-19T22:00:00Z', group:'B' },
  { id:'g28', home:'Bosnia y Herzegovina',away:'Canadá',       date:'2026-06-20T16:00:00Z', group:'B' },
  { id:'g29', home:'Marruecos',     away:'Haití',              date:'2026-06-20T22:00:00Z', group:'C' },
  { id:'g30', home:'Escocia',       away:'Brasil',             date:'2026-06-21T16:00:00Z', group:'C' },
  { id:'g31', home:'Turquía',       away:'Estados Unidos',     date:'2026-06-21T22:00:00Z', group:'D' },
  { id:'g32', home:'Paraguay',      away:'Australia',          date:'2026-06-22T16:00:00Z', group:'D' },
  { id:'g33', home:'Ecuador',       away:'Alemania',           date:'2026-06-22T22:00:00Z', group:'E' },
  { id:'g34', home:'Curazao',       away:'Costa de Marfil',    date:'2026-06-23T16:00:00Z', group:'E' },
  { id:'g35', home:'Japón',         away:'Túnez',              date:'2026-06-23T22:00:00Z', group:'F' },
  { id:'g36', home:'Suecia',        away:'Países Bajos',       date:'2026-06-24T16:00:00Z', group:'F' },
  { id:'g37', home:'Egipto',        away:'Irán',               date:'2026-06-24T22:00:00Z', group:'G' },
  { id:'g38', home:'Nueva Zelanda', away:'Bélgica',            date:'2026-06-25T16:00:00Z', group:'G' },
  { id:'g39', home:'Uruguay',       away:'España',             date:'2026-06-25T22:00:00Z', group:'H' },
  { id:'g40', home:'Cabo Verde',    away:'Arabia Saudita',     date:'2026-06-26T16:00:00Z', group:'H' },
  { id:'g41', home:'Senegal',       away:'Noruega',            date:'2026-06-26T22:00:00Z', group:'I' },
  { id:'g42', home:'Iraq',          away:'Francia',            date:'2026-06-27T16:00:00Z', group:'I' },
  { id:'g43', home:'Argelia',       away:'Austria',            date:'2026-06-27T22:00:00Z', group:'J' },
  { id:'g44', home:'Jordania',      away:'Argentina',          date:'2026-06-28T16:00:00Z', group:'J' },
  { id:'g45', home:'Colombia',      away:'Uzbekistán',         date:'2026-06-28T22:00:00Z', group:'K' },
  { id:'g46', home:'DR Congo',      away:'Portugal',           date:'2026-06-29T16:00:00Z', group:'K' },
  { id:'g47', home:'Croacia',       away:'Ghana',              date:'2026-06-29T22:00:00Z', group:'L' },
  { id:'g48', home:'Panamá',        away:'Inglaterra',         date:'2026-06-30T16:00:00Z', group:'L' },
  // Jornada 3 — 25 jun - 2 jul
  { id:'g49', home:'Sudáfrica',     away:'México',             date:'2026-06-25T02:00:00Z', group:'A' },
  { id:'g50', home:'Chequia',       away:'Corea del Sur',      date:'2026-06-25T02:00:00Z', group:'A' },
  { id:'g51', home:'Canadá',        away:'Qatar',              date:'2026-06-26T02:00:00Z', group:'B' },
  { id:'g52', home:'Suiza',         away:'Bosnia y Herzegovina',date:'2026-06-26T02:00:00Z', group:'B' },
  { id:'g53', home:'Brasil',        away:'Haití',              date:'2026-06-27T02:00:00Z', group:'C' },
  { id:'g54', home:'Marruecos',     away:'Escocia',            date:'2026-06-27T02:00:00Z', group:'C' },
  { id:'g55', home:'Estados Unidos',away:'Australia',          date:'2026-06-28T02:00:00Z', group:'D' },
  { id:'g56', home:'Turquía',       away:'Paraguay',           date:'2026-06-28T02:00:00Z', group:'D' },
  { id:'g57', home:'Alemania',      away:'Costa de Marfil',    date:'2026-06-29T02:00:00Z', group:'E' },
  { id:'g58', home:'Ecuador',       away:'Curazao',            date:'2026-06-29T02:00:00Z', group:'E' },
  { id:'g59', home:'Países Bajos',  away:'Suecia',             date:'2026-06-30T02:00:00Z', group:'F' },
  { id:'g60', home:'Japón',         away:'Túnez',              date:'2026-06-30T02:00:00Z', group:'F' },
  { id:'g61', home:'Bélgica',       away:'Irán',               date:'2026-07-01T02:00:00Z', group:'G' },
  { id:'g62', home:'Egipto',        away:'Nueva Zelanda',      date:'2026-07-01T02:00:00Z', group:'G' },
  { id:'g63', home:'España',        away:'Arabia Saudita',     date:'2026-07-02T02:00:00Z', group:'H' },
  { id:'g64', home:'Uruguay',       away:'Cabo Verde',         date:'2026-07-02T02:00:00Z', group:'H' },
  { id:'g65', home:'Francia',       away:'Noruega',            date:'2026-07-03T02:00:00Z', group:'I' },
  { id:'g66', home:'Senegal',       away:'Iraq',               date:'2026-07-03T02:00:00Z', group:'I' },
  { id:'g67', home:'Argentina',     away:'Austria',            date:'2026-07-04T02:00:00Z', group:'J' },
  { id:'g68', home:'Argelia',       away:'Jordania',           date:'2026-07-04T02:00:00Z', group:'J' },
  { id:'g69', home:'Portugal',      away:'Uzbekistán',         date:'2026-07-05T02:00:00Z', group:'K' },
  { id:'g70', home:'Colombia',      away:'DR Congo',           date:'2026-07-05T02:00:00Z', group:'K' },
  { id:'g71', home:'Inglaterra',    away:'Ghana',              date:'2026-07-06T02:00:00Z', group:'L' },
  { id:'g72', home:'Croacia',       away:'Panamá',             date:'2026-07-06T02:00:00Z', group:'L' },
]

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ target }) {
  const [diff, setDiff] = useState(null)
  useEffect(() => {
    const tick = () => {
      const ms = toDate(target) - now()
      if (ms <= 0) { setDiff(null); return }
      setDiff({ h: Math.floor(ms/3600000), m: Math.floor((ms%3600000)/60000), s: Math.floor((ms%60000)/1000) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [target])

  if (!diff) return <span style={{ color:'var(--green)', fontWeight:700 }}>¡En curso!</span>
  return (
    <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
      {[{val:diff.h,lbl:'h'},{val:diff.m,lbl:'m'},{val:diff.s,lbl:'s'}].map(({val,lbl}) => (
        <div key={lbl} style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', color:'var(--accent)', lineHeight:1, background:'var(--bg-surface)', padding:'0.2rem 0.5rem', borderRadius:'var(--radius-sm)', minWidth:'2.4rem' }}>
            {String(val).padStart(2,'0')}
          </div>
          <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>{lbl}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Match row ────────────────────────────────────────────────────────────────
function MatchRow({ match, showScore, isLive }) {
  const home = resolveTeam(match.home)
  const away = resolveTeam(match.away)
  const dateStr = match.date ? toDate(match.date).toLocaleDateString('es-MX',{ weekday:'short', month:'short', day:'numeric' }) : ''
  const timeStr = match.date ? toDate(match.date).toLocaleTimeString('es-MX',{ hour:'2-digit', minute:'2-digit' }) : ''

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:'0.5rem', padding:'0.85rem 1.25rem', borderBottom:'1px solid var(--border)', background: isLive ? 'rgba(46,204,113,0.06)' : 'transparent' }}>
      {/* Home */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
        <span style={{ fontSize:'1.8rem', lineHeight:1 }}>{home.flag}</span>
        <span style={{ fontSize:'0.875rem', fontWeight:600 }}>{home.name}</span>
      </div>
      {/* Score / time */}
      <div style={{ textAlign:'center', minWidth:'5.5rem' }}>
        {showScore ? (
          <div style={{ display:'flex', alignItems:'center', gap:'0.3rem', justifyContent:'center' }}>
            {isLive && <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', display:'inline-block', animation:'pulse 1.2s infinite', marginRight:'0.2rem' }}/>}
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color: isLive ? 'var(--green)' : 'var(--accent)' }}>{match.homeScore ?? 0}</span>
            <span style={{ color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'1.2rem' }}>–</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color: isLive ? 'var(--green)' : 'var(--accent)' }}>{match.awayScore ?? 0}</span>
          </div>
        ) : (
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', lineHeight:1.3 }}>
            <div>{dateStr}</div>
            <div style={{ fontWeight:700, color:'var(--text)', marginTop:'0.1rem' }}>{timeStr}</div>
          </div>
        )}
      </div>
      {/* Away */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', justifyContent:'flex-end' }}>
        <span style={{ fontSize:'0.875rem', fontWeight:600, textAlign:'right' }}>{away.name}</span>
        <span style={{ fontSize:'1.8rem', lineHeight:1 }}>{away.flag}</span>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LiveMatches() {
  const [tab, setTab] = useState('upcoming')
  const [data, setData] = useState({ live:[], finished:[], upcoming:[] })
  const [nextMatch, setNextMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchMatches = useCallback(async () => {
    const n = now()

    // Intentar obtener resultados reales de openfootball
    try {
      const res = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json', { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        // Merge resultados reales con nuestro calendario
        const resultsMap = {}
        ;(json.rounds || []).forEach(round => {
          ;(round.matches || []).forEach(m => {
            const h = m.team1?.name || m.team1 || ''
            const a = m.team2?.name || m.team2 || ''
            const hEs = ALIASES[h] || h
            const aEs = ALIASES[a] || a
            if (m.score1 !== undefined && m.score1 !== null) {
              resultsMap[`${hEs}-${aEs}`] = { homeScore: m.score1, awayScore: m.score2 }
            }
          })
        })

        // Aplicar resultados al calendario local
        const enriched = SCHEDULE.map(m => {
          const key = `${m.home}-${m.away}`
          const result = resultsMap[key]
          return result ? { ...m, ...result } : m
        })

        buildState(enriched, n)
        return
      }
    } catch (_) {}

    // Fallback: solo calendario sin resultados
    buildState(SCHEDULE, n)
  }, [])

  function buildState(matches, n) {
    const live     = matches.filter(m => m.homeScore === null && toDate(m.date) <= n && toDate(m.date) >= new Date(n - 120*60*1000))
    const finished = matches.filter(m => m.homeScore !== null).reverse()
    const upcoming = matches.filter(m => m.homeScore === null && toDate(m.date) > n)
    const next     = upcoming[0] || null
    setData({ live, finished, upcoming })
    setNextMatch(next)
    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => {
    fetchMatches()
    const id = setInterval(fetchMatches, 120000)
    return () => clearInterval(id)
  }, [fetchMatches])

  useEffect(() => {
    if (data.live.length > 0) setTab('live')
    else if (data.finished.length > 0) setTab('finished')
  }, [data.live.length, data.finished.length])

  const tabs = [
    { key:'live',     label:'🔴 En vivo',    count:data.live.length },
    { key:'finished', label:'✅ Finalizados', count:data.finished.length },
    { key:'upcoming', label:'📅 Próximos',    count:data.upcoming.length },
  ]

  return (
    <section style={{ background:'var(--bg-card)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' }}>
          <div>
            <h2 style={{ fontSize:'1.4rem' }}>Partidos del Mundial</h2>
            {lastUpdated && (
              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.2rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                🕐 {lastUpdated.toLocaleTimeString('es-MX',{ hour:'2-digit', minute:'2-digit' })}
                <button onClick={fetchMatches} style={{ background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontSize:'0.8rem', padding:0 }}>↻ actualizar</button>
              </div>
            )}
          </div>
          {/* Countdown */}
          {nextMatch && (
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>Próximo partido</div>
              <div style={{ fontSize:'0.8rem', fontWeight:600, marginBottom:'0.4rem' }}>
                {resolveTeam(nextMatch.home).flag} {resolveTeam(nextMatch.home).name} vs {resolveTeam(nextMatch.away).name} {resolveTeam(nextMatch.away).flag}
              </div>
              <Countdown target={nextMatch.date} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'0.25rem', borderBottom:'1px solid var(--border)' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding:'0.6rem 1rem', fontSize:'0.85rem', fontWeight:600, color: tab===t.key ? 'var(--accent)' : 'var(--text-muted)', background:'none', border:'none', borderBottom:`2px solid ${tab===t.key?'var(--accent)':'transparent'}`, marginBottom:'-1px', cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              {t.label}
              {t.count > 0 && <span style={{ background: t.key==='live' ? 'var(--green)' : 'var(--bg-surface)', color: t.key==='live' ? '#000' : 'var(--text-muted)', fontSize:'0.7rem', fontWeight:700, padding:'0.1rem 0.4rem', borderRadius:'999px' }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ background:'var(--bg-deep)', borderRadius:'0 0 var(--radius) var(--radius)', border:'1px solid var(--border)', borderTop:'none', maxHeight:'440px', overflowY:'auto' }}>
          {loading ? (
            <div className="loader"><div className="spinner"/></div>
          ) : (data[tab]||[]).length === 0 ? (
            <div style={{ padding:'2.5rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.9rem' }}>
              {tab==='live' ? '⚽ No hay partidos en vivo ahora mismo.' : tab==='finished' ? 'Aún no hay partidos finalizados.' : 'No hay próximos partidos.'}
            </div>
          ) : (
            (data[tab]||[]).map((m,i) => <MatchRow key={m.id||i} match={m} showScore={tab!=='upcoming'} isLive={tab==='live'}/>)
          )}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </section>
  )
}
