import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { getPredictions, upsertPrediction } from '../lib/supabase'
import { ALL_MATCHES, GROUPS, FLAGS, PHASE_LABELS } from '../lib/matches'

const PHASES_ORDER = ['groups', 'r32', 'r16', 'qf', 'sf', '3rd', 'final']

export default function Predictions() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [predictions, setPredictions] = useState({}) // { matchId: { home, away } }
  const [saved, setSaved] = useState({})
  const [activePhase, setActivePhase] = useState('groups')
  const [activeGroup, setActiveGroup] = useState('A')
  const [savingId, setSavingId] = useState(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading, navigate])

  // Load predictions
  useEffect(() => {
    if (!user) return
    getPredictions(user.id).then(({ data }) => {
      if (!data) return
      const map = {}
      data.forEach(p => {
        map[p.match_id] = { home: p.home_goals, away: p.away_goals }
      })
      setPredictions(map)
    })
  }, [user])

  const handleScore = useCallback((matchId, side, value) => {
    const num = value === '' ? '' : Math.max(0, Math.min(99, parseInt(value) || 0))
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: num }
    }))
    setSaved(prev => ({ ...prev, [matchId]: false }))
  }, [])

  const handleSave = useCallback(async (matchId) => {
    if (!user) return
    const pred = predictions[matchId]
    if (pred?.home === '' || pred?.away === '' || pred?.home == null || pred?.away == null) return
    setSavingId(matchId)
    const { error } = await upsertPrediction(user.id, matchId, pred.home, pred.away)
    setSavingId(null)
    if (!error) setSaved(prev => ({ ...prev, [matchId]: true }))
  }, [user, predictions])

  const handleBlur = (matchId) => {
    const pred = predictions[matchId]
    if (pred?.home != null && pred?.away != null && pred.home !== '' && pred.away !== '') {
      handleSave(matchId)
    }
  }

  const groupMatches = ALL_MATCHES.filter(m => m.phase === 'groups' && m.group === activeGroup)
  const phaseMatches = activePhase !== 'groups'
    ? ALL_MATCHES.filter(m => m.phase === activePhase)
    : groupMatches

  const totalPredicted = Object.values(predictions).filter(p => p.home != null && p.away != null).length

  if (authLoading) return <div className="loader"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2>Mis predicciones</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {totalPredicted} / {ALL_MATCHES.length} partidos predichos
            </p>
          </div>
          <div className="card card-sm" style={{ padding: '0.6rem 1rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent)', textAlign: 'center' }}>
              {totalPredicted}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>predichos</div>
          </div>
        </div>

        {/* Phase tabs */}
        <div className="tabs">
          {PHASES_ORDER.map(phase => (
            <button
              key={phase}
              className={`tab ${activePhase === phase ? 'active' : ''}`}
              onClick={() => setActivePhase(phase)}
            >
              {phase === 'groups' ? 'Grupos' : PHASE_LABELS[phase]}
            </button>
          ))}
        </div>

        {/* Group sub-tabs */}
        {activePhase === 'groups' && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {Object.keys(GROUPS).map(g => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                style={{
                  padding: '0.35rem 0.8rem', borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid',
                  borderColor: activeGroup === g ? 'var(--accent)' : 'var(--border)',
                  background: activeGroup === g ? 'rgba(245,166,35,0.1)' : 'transparent',
                  color: activeGroup === g ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                  transition: 'all 0.15s'
                }}
              >
                Grupo {g}
              </button>
            ))}
          </div>
        )}

        {/* Matches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {activePhase === 'groups' && (
            <div className="group-label">GRUPO {activeGroup}</div>
          )}

          {phaseMatches.map(match => {
            const pred = predictions[match.id] || {}
            const isSaved = saved[match.id]
            const isSaving = savingId === match.id

            return (
              <div key={match.id} className="match-card">
                {/* Home team */}
                <div className="match-team">
                  <span className="match-flag">{FLAGS[match.home] || '🏳️'}</span>
                  <span className="hide-mobile">{match.home}</span>
                  <span style={{ display: 'none' }} className="show-mobile">
                    {match.home.substring(0, 3).toUpperCase()}
                  </span>
                </div>

                {/* Score inputs */}
                <div className="match-vs">
                  {match.homeScore !== null ? (
                    <span className="score-display">{match.homeScore} – {match.awayScore}</span>
                  ) : (
                    <>
                      <input
                        type="number" className="score-input"
                        min="0" max="99"
                        value={pred.home ?? ''}
                        onChange={e => handleScore(match.id, 'home', e.target.value)}
                        onBlur={() => handleBlur(match.id)}
                        placeholder="-"
                      />
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>—</span>
                      <input
                        type="number" className="score-input"
                        min="0" max="99"
                        value={pred.away ?? ''}
                        onChange={e => handleScore(match.id, 'away', e.target.value)}
                        onBlur={() => handleBlur(match.id)}
                        placeholder="-"
                      />
                      {isSaving && <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />}
                      {isSaved && !isSaving && <span className="saved-dot" title="Guardado" />}
                    </>
                  )}
                </div>

                {/* Away team */}
                <div className="match-team away">
                  <span className="hide-mobile">{match.away}</span>
                  <span className="match-flag">{FLAGS[match.away] || '🏳️'}</span>
                </div>
              </div>
            )
          })}

          {phaseMatches.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
              Los partidos de esta fase se desbloquean conforme avance el torneo.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
