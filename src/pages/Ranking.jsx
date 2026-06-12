import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthContext'
import { getGlobalRanking } from '../lib/supabase'

// Demo data shown when no real ranking is available yet
const DEMO_RANKING = [
  { username: 'ElProfetico', points: 48, exact: 6, correct: 4, predictions: 24 },
  { username: 'FutbolMaster', points: 39, exact: 4, correct: 5, predictions: 22 },
  { username: 'Mundialero_MX', points: 33, exact: 3, correct: 5, predictions: 20 },
  { username: 'GolesYMas', points: 27, exact: 2, correct: 5, predictions: 18 },
  { username: 'TacticaFina', points: 24, exact: 2, correct: 4, predictions: 16 },
  { username: 'BalónDeOro', points: 21, exact: 1, correct: 6, predictions: 15 },
  { username: 'CamisetaVerde', points: 18, exact: 1, correct: 5, predictions: 14 },
  { username: 'ArqueroFiel', points: 15, exact: 1, correct: 4, predictions: 12 },
]

export default function Ranking() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [useDemo, setUseDemo] = useState(false)

  useEffect(() => {
    getGlobalRanking().then(({ data, error }) => {
      setLoading(false)
      if (error || !data || data.length === 0) {
        setUseDemo(true)
        setRanking(DEMO_RANKING)
      } else {
        setRanking(data)
      }
    })
  }, [])

  const entries = useDemo ? DEMO_RANKING : ranking

  const medalFor = (pos) => {
    if (pos === 1) return '🥇'
    if (pos === 2) return '🥈'
    if (pos === 3) return '🥉'
    return null
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h2>Ranking Global</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.9rem' }}>
            Los mejores pronosticadores del Mundial 2026
          </p>
          {useDemo && (
            <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              👀 Ejemplo del ranking — se actualiza en tiempo real cuando empiezan los partidos.
            </div>
          )}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Jugador</th>
                  <th style={{ textAlign: 'right' }}>Puntos</th>
                  <th style={{ textAlign: 'right' }} className="hide-mobile">Exactos</th>
                  <th style={{ textAlign: 'right' }} className="hide-mobile">Correctos</th>
                  <th style={{ textAlign: 'right' }} className="hide-mobile">Predichos</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const pos = i + 1
                  const isMe = user && entry.user_id === user.id
                  return (
                    <tr key={entry.username || entry.user_id} style={isMe ? { background: 'rgba(245,166,35,0.08)' } : {}}>
                      <td>
                        {medalFor(pos) ? (
                          <span style={{ fontSize: '1.1rem' }}>{medalFor(pos)}</span>
                        ) : (
                          <span className={`rank-pos ${pos <= 3 ? `rank-${pos}` : ''}`}>{pos}</span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{entry.username}</span>
                        {isMe && (
                          <span style={{
                            marginLeft: '0.5rem', fontSize: '0.7rem',
                            background: 'rgba(245,166,35,0.2)', color: 'var(--accent)',
                            padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 600
                          }}>TÚ</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent)' }}>
                          {entry.points}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="hide-mobile">
                        <span style={{ color: 'var(--green)', fontWeight: 600 }}>{entry.exact ?? '—'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="hide-mobile">
                        <span style={{ color: 'var(--text-muted)' }}>{entry.correct ?? '—'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="hide-mobile">
                        <span style={{ color: 'var(--text-muted)' }}>{entry.predictions ?? '—'}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
