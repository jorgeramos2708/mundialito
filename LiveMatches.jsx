import { useState, useEffect, useCallback } from 'react'
import { ALL_MATCHES, FLAGS } from '../lib/matches'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_KEY  = import.meta.env.VITE_FOOTBALL_API_KEY || ''
const WC_ID    = 2000 // football-data.org: competition id for FIFA World Cup 2026
const API_BASE = 'https://api.football-data.org/v4'

// Mapa de siglas / nombres cortos de la API → nombre en español (para buscar en FLAGS)
const TEAM_NAME_MAP = {
  // Grupo A
  'MEX': 'México', 'Mexico': 'México',
  'RSA': 'Sudáfrica', 'South Africa': 'Sudáfrica',
  'KOR': 'Corea del Sur', 'Korea Republic': 'Corea del Sur', 'South Korea': 'Corea del Sur',
  'CZE': 'Chequia', 'Czechia': 'Chequia', 'Czech Republic': 'Chequia',
  // Grupo B
  'CAN': 'Canadá', 'Canada': 'Canadá',
  'SUI': 'Suiza', 'Switzerland': 'Suiza',
  'QAT': 'Qatar',
  'BIH': 'Bosnia y Herzegovina', 'Bosnia and Herzegovina': 'Bosnia y Herzegovina',
  // Grupo C
  'BRA': 'Brasil', 'Brazil': 'Brasil',
  'MAR': 'Marruecos', 'Morocco': 'Marruecos',
  'HAI': 'Haití', 'Haiti': 'Haití',
  'SCO': 'Escocia', 'Scotland': 'Escocia',
  // Grupo D
  'USA': 'Estados Unidos', 'United States': 'Estados Unidos',
  'PAR': 'Paraguay',
  'AUS': 'Australia',
  'TUR': 'Turquía', 'Turkey': 'Turquía',
  // Grupo E
  'GER': 'Alemania', 'Germany': 'Alemania',
  'CUW': 'Curazao', 'Curaçao': 'Curazao',
  'CIV': 'Costa de Marfil', "Côte d'Ivoire": 'Costa de Marfil', 'Ivory Coast': 'Costa de Marfil',
  'ECU': 'Ecuador',
  // Grupo F
  'NED': 'Países Bajos', 'Netherlands': 'Países Bajos',
  'JPN': 'Japón', 'Japan': 'Japón',
  'TUN': 'Túnez', 'Tunisia': 'Túnez',
  'SWE': 'Suecia', 'Sweden': 'Suecia',
  // Grupo G
  'BEL': 'Bélgica', 'Belgium': 'Bélgica',
  'EGY': 'Egipto', 'Egypt': 'Egipto',
  'IRN': 'Irán', 'Iran': 'Irán',
  'NZL': 'Nueva Zelanda', 'New Zealand': 'Nueva Zelanda',
  // Grupo H
  'ESP': 'España', 'Spain': 'España',
  'CPV': 'Cabo Verde', 'Cape Verde': 'Cabo Verde',
  'KSA': 'Arabia Saudita', 'Saudi Arabia': 'Arabia Saudita',
  'URU': 'Uruguay',
  // Grupo I
  'FRA': 'Francia', 'France': 'Francia',
  'SEN': 'Senegal',
  'NOR': 'Noruega', 'Norway': 'Noruega',
  'IRQ': 'Iraq',
  // Grupo J
  'ARG': 'Argentina',
  'ALG': 'Argelia', 'Algeria': 'Argelia',
  'AUT': 'Austria',
  'JOR': 'Jordania', 'Jordan': 'Jordania',
  // Grupo K
  'POR': 'Portugal',
  'COL': 'Colombia',
  'UZB': 'Uzbekistán', 'Uzbekistan': 'Uzbekistán',
  'COD': 'DR Congo', 'DR Congo': 'DR Congo',
  // Grupo L
  'ENG': 'Inglaterra', 'England': 'Inglaterra',
  'CRO': 'Croacia', 'Croatia': 'Croacia',
  'GHA': 'Ghana',
  'PAN': 'Panamá', 'Panama': 'Panamá',
}

// Devuelve { flag, name } dado cualquier nombre/sigla
function resolveTeam(raw) {
  if (!raw || raw === '?') return { flag: '🏳️', name: raw || '?' }
  const resolved = TEAM_NAME_MAP[raw] || raw
  const flag = FLAGS[resolved] || FLAGS[raw] || '🏳️'
  return { flag, name: resolved }
}

// Fallback: derive match info from our local ALL_MATCHES data
// so the UI is always populated even without API
const toDate = (d) => new Date(d)
const today  = () => new Date()

function getLocalMatches() {
  const now = today()
  const sorted = [...ALL_MATCHES]
    .filter(m => m.phase === 'groups' && m.date)
    .sort((a, b) => toDate(a.date) - toDate(b.date))

  const finished  = sorted.filter(m => m.homeScore !== null)
  const upcoming  = sorted.filter(m => m.homeScore === null && toDate(m.date) >= now)
  const live      = [] // local data has no live info

  return { finished, upcoming, live }
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown({ target }) {
  const [diff, setDiff] = useState(null)

  useEffect(() => {
    const tick = () => {
      const ms = toDate(target) - today()
      if (ms <= 0) { setDiff(null); return }
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setDiff({ h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!diff) return <span style={{ color: 'var(--green)', fontWeight: 700 }}>¡En curso!</span>

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {[
        { val: diff.h, lbl: 'h' },
        { val: diff.m, lbl: 'm' },
        { val: diff.s, lbl: 's' },
      ].map(({ val, lbl }) => (
        <div key={lbl} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.6rem',
            color: 'var(--accent)', lineHeight: 1,
            background: 'var(--bg-surface)',
            padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)',
            minWidth: '2.4rem'
          }}>
            {String(val).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{lbl}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Single match row ─────────────────────────────────────────────────────────

function MatchRow({ match, showScore = false, isLive = false }) {
  const homeRaw = match.home || match.homeTeam?.shortName || match.homeTeam?.name || '?'
  const awayRaw = match.away || match.awayTeam?.shortName || match.awayTeam?.name || '?'
  const { flag: hFlag, name: homeName } = resolveTeam(homeRaw)
  const { flag: aFlag, name: awayName } = resolveTeam(awayRaw)

  const dateStr = match.date
    ? toDate(match.date).toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' })
    : ''
  const timeStr = match.date
    ? toDate(match.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Monterrey' })
    : ''

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.85rem 1.25rem',
      borderBottom: '1px solid var(--border)',
      background: isLive ? 'rgba(46,204,113,0.04)' : 'transparent',
      transition: 'background 0.15s',
    }}>
      {/* Home */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.8rem', lineHeight: 1, flexShrink: 0 }}>{hFlag}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>{homeName}</span>
      </div>

      {/* Center */}
      <div style={{ textAlign: 'center', minWidth: '5.5rem' }}>
        {showScore ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}>
            {isLive && (
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--green)', display: 'inline-block',
                animation: 'pulse 1.2s infinite',
                marginRight: '0.2rem'
              }} />
            )}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: isLive ? 'var(--green)' : 'var(--accent)' }}>
              {match.homeScore ?? match.score?.home ?? 0}
            </span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>–</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: isLive ? 'var(--green)' : 'var(--accent)' }}>
              {match.awayScore ?? match.score?.away ?? 0}
            </span>
            {isLive && match.minute && (
              <span style={{ fontSize: '0.7rem', color: 'var(--green)', marginLeft: '0.3rem' }}>{match.minute}'</span>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            <div>{dateStr}</div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginTop: '0.1rem' }}>{timeStr}</div>
          </div>
        )}
      </div>

      {/* Away */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2, textAlign: 'right' }}>{awayName}</span>
        <span style={{ fontSize: '1.8rem', lineHeight: 1, flexShrink: 0 }}>{aFlag}</span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LiveMatches() {
  const [tab, setTab] = useState('upcoming')
  const [data, setData] = useState({ live: [], finished: [], upcoming: [] })
  const [nextMatch, setNextMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usingLocal, setUsingLocal] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchMatches = useCallback(async () => {
    // Try football-data.org API first (needs API key in env)
    if (API_KEY) {
      try {
        const [liveRes, allRes] = await Promise.all([
          fetch(`${API_BASE}/competitions/${WC_ID}/matches?status=LIVE`, {
            headers: { 'X-Auth-Token': API_KEY }
          }),
          fetch(`${API_BASE}/competitions/${WC_ID}/matches`, {
            headers: { 'X-Auth-Token': API_KEY }
          }),
        ])

        if (liveRes.ok && allRes.ok) {
          const liveJson = await liveRes.json()
          const allJson  = await allRes.json()
          const matches  = allJson.matches || []

          const mapM = (m) => ({
            id: m.id,
            home: m.homeTeam?.shortName || m.homeTeam?.name,
            away: m.awayTeam?.shortName || m.awayTeam?.name,
            homeTeam: m.homeTeam,
            awayTeam: m.awayTeam,
            date: m.utcDate,
            homeScore: m.score?.fullTime?.home,
            awayScore: m.score?.fullTime?.away,
            score: { home: m.score?.fullTime?.home, away: m.score?.fullTime?.away },
            minute: m.minute,
            status: m.status,
          })

          const live     = (liveJson.matches || []).map(mapM)
          const finished = matches.filter(m => m.status === 'FINISHED').map(mapM).slice(-10).reverse()
          const upcoming = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED').map(mapM).slice(0, 10)
          const next     = upcoming[0] || null

          setData({ live, finished, upcoming })
          setNextMatch(next)
          setLastUpdated(new Date())
          setLoading(false)
          return
        }
      } catch (_) {
        // fall through to local
      }
    }

    // Fallback: use local match schedule
    setUsingLocal(true)
    const { finished, upcoming, live } = getLocalMatches()
    setData({ live, finished, upcoming: upcoming.slice(0, 12) })
    setNextMatch(upcoming[0] || null)
    setLastUpdated(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMatches()
    // Refresh every 60 seconds if API key present
    if (API_KEY) {
      const id = setInterval(fetchMatches, 60000)
      return () => clearInterval(id)
    }
  }, [fetchMatches])

  // Auto-switch to live tab if there are live matches
  useEffect(() => {
    if (data.live.length > 0) setTab('live')
  }, [data.live.length])

  const tabs = [
    { key: 'live',     label: '🔴 En vivo',   count: data.live.length },
    { key: 'upcoming', label: '📅 Próximos',   count: data.upcoming.length },
    { key: 'finished', label: '✅ Finalizados', count: data.finished.length },
  ]

  const currentList = data[tab] || []

  return (
    <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
      <div className="container">

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Partidos del Mundial</h2>
            {lastUpdated && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {usingLocal ? 'Calendario oficial · ' : 'Actualizado '}
                {lastUpdated.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                {!usingLocal && (
                  <button onClick={fetchMatches} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                    ↻ Actualizar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Countdown to next match */}
          {nextMatch && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Próximo partido
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                {resolveTeam(nextMatch.home).flag} {resolveTeam(nextMatch.home).name}
                {' vs '}
                {resolveTeam(nextMatch.away).name} {resolveTeam(nextMatch.away).flag}
              </div>
              <Countdown target={nextMatch.date} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border)', marginBottom: '0' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '0.6rem 1rem', fontSize: '0.85rem', fontWeight: 600,
                color: tab === t.key ? 'var(--accent)' : 'var(--text-muted)',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${tab === t.key ? 'var(--accent)' : 'transparent'}`,
                marginBottom: '-1px', cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              {t.label}
              {t.count > 0 && (
                <span style={{
                  background: t.key === 'live' ? 'var(--green)' : 'var(--bg-surface)',
                  color: t.key === 'live' ? '#000' : 'var(--text-muted)',
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '0.1rem 0.4rem', borderRadius: '999px',
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Match list */}
        <div style={{
          background: 'var(--bg-deep)', borderRadius: '0 0 var(--radius) var(--radius)',
          border: '1px solid var(--border)', borderTop: 'none',
          maxHeight: '420px', overflowY: 'auto',
        }}>
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : currentList.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {tab === 'live' ? 'No hay partidos en vivo ahora mismo.' :
               tab === 'finished' ? 'Aún no hay partidos finalizados.' :
               'No hay partidos próximos disponibles.'}
            </div>
          ) : (
            currentList.map((m, i) => (
              <MatchRow
                key={m.id || i}
                match={m}
                showScore={tab === 'finished' || tab === 'live'}
                isLive={tab === 'live'}
              />
            ))
          )}
        </div>

        {/* API key notice */}
        {usingLocal && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
            💡 Para resultados en tiempo real, agrega <code style={{ background: 'var(--bg-surface)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>VITE_FOOTBALL_API_KEY</code> en Netlify con tu key de{' '}
            <a href="https://www.football-data.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>football-data.org</a>
            {' '}(gratis).
          </p>
        )}

        {/* Pulse animation */}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </div>
    </section>
  )
}
