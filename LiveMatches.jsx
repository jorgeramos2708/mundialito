import { useState, useEffect, useCallback } from 'react'
import { ALL_MATCHES, FLAGS } from '../lib/matches'

// ─── Config ───────────────────────────────────────────────────────────────────
// API gratuita sin key — datos reales del Mundial 2026
const WC_API = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

const toDate = (d) => new Date(d)
const today  = () => new Date()

// ─── Team resolver ─────────────────────────────────────────────────────────────
const TEAM_NAME_MAP = {
  'MEX': 'México', 'Mexico': 'México',
  'RSA': 'Sudáfrica', 'South Africa': 'Sudáfrica',
  'KOR': 'Corea del Sur', 'Korea Republic': 'Corea del Sur', 'South Korea': 'Corea del Sur',
  'CZE': 'Chequia', 'Czechia': 'Chequia', 'Czech Republic': 'Chequia',
  'CAN': 'Canadá', 'Canada': 'Canadá',
  'SUI': 'Suiza', 'Switzerland': 'Suiza',
  'QAT': 'Qatar',
  'BIH': 'Bosnia y Herzegovina', 'Bosnia and Herzegovina': 'Bosnia y Herzegovina',
  'BRA': 'Brasil', 'Brazil': 'Brasil',
  'MAR': 'Marruecos', 'Morocco': 'Marruecos',
  'HAI': 'Haití', 'Haiti': 'Haití',
  'SCO': 'Escocia', 'Scotland': 'Escocia',
  'USA': 'Estados Unidos', 'United States': 'Estados Unidos',
  'PAR': 'Paraguay',
  'AUS': 'Australia',
  'TUR': 'Turquía', 'Turkey': 'Turquía',
  'GER': 'Alemania', 'Germany': 'Alemania',
  'CUW': 'Curazao', 'Curaçao': 'Curazao',
  'CIV': 'Costa de Marfil', "Côte d'Ivoire": 'Costa de Marfil', 'Ivory Coast': 'Costa de Marfil',
  'ECU': 'Ecuador',
  'NED': 'Países Bajos', 'Netherlands': 'Países Bajos',
  'JPN': 'Japón', 'Japan': 'Japón',
  'TUN': 'Túnez', 'Tunisia': 'Túnez',
  'SWE': 'Suecia', 'Sweden': 'Suecia',
  'BEL': 'Bélgica', 'Belgium': 'Bélgica',
  'EGY': 'Egipto', 'Egypt': 'Egipto',
  'IRN': 'Irán', 'Iran': 'Irán',
  'NZL': 'Nueva Zelanda', 'New Zealand': 'Nueva Zelanda',
  'ESP': 'España', 'Spain': 'España',
  'CPV': 'Cabo Verde', 'Cape Verde': 'Cabo Verde',
  'KSA': 'Arabia Saudita', 'Saudi Arabia': 'Arabia Saudita',
  'URU': 'Uruguay',
  'FRA': 'Francia', 'France': 'Francia',
  'SEN': 'Senegal',
  'NOR': 'Noruega', 'Norway': 'Noruega',
  'IRQ': 'Iraq',
  'ARG': 'Argentina',
  'ALG': 'Argelia', 'Algeria': 'Argelia',
  'AUT': 'Austria',
  'JOR': 'Jordania', 'Jordan': 'Jordania',
  'POR': 'Portugal',
  'COL': 'Colombia',
  'UZB': 'Uzbekistán', 'Uzbekistan': 'Uzbekistán',
  'COD': 'DR Congo',
  'ENG': 'Inglaterra', 'England': 'Inglaterra',
  'CRO': 'Croacia', 'Croatia': 'Croacia',
  'GHA': 'Ghana',
  'PAN': 'Panamá', 'Panama': 'Panamá',
}

function resolveTeam(raw) {
  if (!raw || raw === '?') return { flag: '🏳️', name: raw || '?' }
  const resolved = TEAM_NAME_MAP[raw] || raw
  const flag = FLAGS[resolved] || FLAGS[raw] || '🏳️'
  return { flag, name: resolved }
}

// ─── Parse openfootball JSON ──────────────────────────────────────────────────
function parseMatches(data) {
  const now = today()
  const result = []

  const rounds = data.rounds || []
  rounds.forEach(round => {
    ;(round.matches || []).forEach(m => {
      const dateStr = m.date || ''
      const timeStr = (m.time || '').split(' ')[0] // "13:00"
      let dateObj = null
      try {
        const iso = timeStr
          ? `${dateStr}T${timeStr}:00Z`
          : `${dateStr}T18:00:00Z`
        dateObj = new Date(iso)
      } catch (_) {}

      const score1 = m.score1 ?? null
      const score2 = m.score2 ?? null
      const isFinished = score1 !== null && score2 !== null
      const isToday = dateObj && dateObj.toDateString() === now.toDateString()
      const started = dateObj && dateObj <= now

      result.push({
        id: `${dateStr}-${m.team1?.name || m.team1}-${m.team2?.name || m.team2}`,
        home: m.team1?.name || m.team1 || '?',
        away: m.team2?.name || m.team2 || '?',
        date: dateObj ? dateObj.toISOString() : dateStr,
        homeScore: isFinished ? score1 : null,
        awayScore: isFinished ? score2 : null,
        isLive: isToday && started && !isFinished,
        group: round.name || '',
      })
    })
  })
  return result
}

// ─── Local fallback ───────────────────────────────────────────────────────────
function getLocalMatches() {
  const now = today()
  const sorted = [...ALL_MATCHES]
    .filter(m => m.phase === 'groups' && m.date)
    .sort((a, b) => toDate(a.date) - toDate(b.date))
  return {
    finished: sorted.filter(m => m.homeScore !== null),
    upcoming: sorted.filter(m => m.homeScore === null && toDate(m.date) >= now),
    live: [],
  }
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ target }) {
  const [diff, setDiff] = useState(null)

  useEffect(() => {
    const tick = () => {
      const ms = toDate(target) - today()
      if (ms <= 0) { setDiff(null); return }
      setDiff({
        h: Math.floor(ms / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!diff) return <span style={{ color: 'var(--green)', fontWeight: 700 }}>¡En curso!</span>

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {[{ val: diff.h, lbl: 'h' }, { val: diff.m, lbl: 'm' }, { val: diff.s, lbl: 's' }].map(({ val, lbl }) => (
        <div key={lbl} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--accent)',
            lineHeight: 1, background: 'var(--bg-surface)',
            padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', minWidth: '2.4rem'
          }}>
            {String(val).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{lbl}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Match row ────────────────────────────────────────────────────────────────
function MatchRow({ match, showScore = false, isLive = false }) {
  const { flag: hFlag, name: homeName } = resolveTeam(match.home)
  const { flag: aFlag, name: awayName } = resolveTeam(match.away)

  const dateStr = match.date
    ? toDate(match.date).toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' })
    : ''
  const timeStr = match.date
    ? toDate(match.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Monterrey' })
    : ''

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center', gap: '0.5rem',
      padding: '0.85rem 1.25rem',
      borderBottom: '1px solid var(--border)',
      background: isLive ? 'rgba(46,204,113,0.06)' : 'transparent',
    }}>
      {/* Home */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.8rem', lineHeight: 1, flexShrink: 0 }}>{hFlag}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{homeName}</span>
      </div>

      {/* Center */}
      <div style={{ textAlign: 'center', minWidth: '5.5rem' }}>
        {showScore ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}>
            {isLive && (
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
                display: 'inline-block', animation: 'pulse 1.2s infinite', marginRight: '0.2rem'
              }} />
            )}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: isLive ? 'var(--green)' : 'var(--accent)' }}>
              {match.homeScore ?? 0}
            </span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>–</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: isLive ? 'var(--green)' : 'var(--accent)' }}>
              {match.awayScore ?? 0}
            </span>
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
        <span style={{ fontSize: '0.875rem', fontWeight: 600, textAlign: 'right' }}>{awayName}</span>
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
    try {
      const res = await fetch(WC_API)
      if (!res.ok) throw new Error('API error')
      const json = await res.json()
      const all = parseMatches(json)

      if (all.length === 0) throw new Error('No matches')

      const now = today()
      const live     = all.filter(m => m.isLive)
      const finished = all.filter(m => m.homeScore !== null && !m.isLive).reverse()
      const upcoming = all.filter(m => m.homeScore === null && !m.isLive && toDate(m.date) >= now)
      const next     = upcoming[0] || null

      setData({ live, finished, upcoming })
      setNextMatch(next)
      setUsingLocal(false)
      setLastUpdated(new Date())
      setLoading(false)
    } catch (_) {
      // Fallback to local schedule
      const { finished, upcoming, live } = getLocalMatches()
      setData({ live, finished, upcoming: upcoming.slice(0, 15) })
      setNextMatch(upcoming[0] || null)
      setUsingLocal(true)
      setLastUpdated(new Date())
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatches()
    const id = setInterval(fetchMatches, 120000) // refresh each 2 min
    return () => clearInterval(id)
  }, [fetchMatches])

  useEffect(() => {
    if (data.live.length > 0) setTab('live')
    else if (data.finished.length > 0) setTab('finished')
  }, [data.live.length, data.finished.length])

  const tabs = [
    { key: 'live',     label: '🔴 En vivo',    count: data.live.length },
    { key: 'finished', label: '✅ Finalizados', count: data.finished.length },
    { key: 'upcoming', label: '📅 Próximos',    count: data.upcoming.length },
  ]

  const currentList = data[tab] || []

  return (
    <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Partidos del Mundial</h2>
            {lastUpdated && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {usingLocal ? '📋 Calendario oficial' : '🟢 Datos en tiempo real ·'}{' '}
                {lastUpdated.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                <button onClick={fetchMatches} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>
                  ↻
                </button>
              </div>
            )}
          </div>

          {/* Countdown */}
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
        <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border)' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '0.6rem 1rem', fontSize: '0.85rem', fontWeight: 600,
              color: tab === t.key ? 'var(--accent)' : 'var(--text-muted)',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${tab === t.key ? 'var(--accent)' : 'transparent'}`,
              marginBottom: '-1px', cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
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

        {/* List */}
        <div style={{
          background: 'var(--bg-deep)', borderRadius: '0 0 var(--radius) var(--radius)',
          border: '1px solid var(--border)', borderTop: 'none',
          maxHeight: '440px', overflowY: 'auto',
        }}>
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : currentList.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {tab === 'live' ? '⚽ No hay partidos en vivo ahora mismo.' :
               tab === 'finished' ? 'Aún no hay partidos finalizados.' :
               'No hay próximos partidos disponibles.'}
            </div>
          ) : (
            currentList.map((m, i) => (
              <MatchRow key={m.id || i} match={m} showScore={tab !== 'upcoming'} isLive={tab === 'live'} />
            ))
          )}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </section>
  )
}
