import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { createGroup, joinGroup, getMyGroups, getGroupRanking } from '../lib/supabase'

export default function Groups() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [groupRanking, setGroupRanking] = useState([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingRanking, setLoadingRanking] = useState(false)

  // Create form
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')

  // Join form
  const [joinCode, setJoinCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [joinSuccess, setJoinSuccess] = useState('')

  // Copied
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading, navigate])

  const loadGroups = () => {
    if (!user) return
    setLoadingGroups(true)
    getMyGroups(user.id).then(({ data }) => {
      setLoadingGroups(false)
      setGroups(data || [])
    })
  }

  useEffect(() => { loadGroups() }, [user])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError(''); setCreateSuccess('')
    if (!newName.trim()) return
    setCreating(true)
    const { data, error } = await createGroup(user.id, newName.trim())
    setCreating(false)
    if (error) {
      setCreateError('Error al crear el grupo: ' + error.message)
    } else {
      setCreateSuccess(`¡Grupo "${data.name}" creado! Código: ${data.code}`)
      setNewName('')
      loadGroups()
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    setJoinError(''); setJoinSuccess('')
    if (!joinCode.trim()) return
    setJoining(true)
    const { error } = await joinGroup(user.id, joinCode.trim().toUpperCase())
    setJoining(false)
    if (error) {
      if (error.code === 'PGRST116') setJoinError('Código no encontrado.')
      else if (error.code === '23505') setJoinError('Ya eres miembro de ese grupo.')
      else setJoinError('Error al unirse: ' + error.message)
    } else {
      setJoinSuccess('¡Te uniste al grupo!')
      setJoinCode('')
      loadGroups()
    }
  }

  const handleSelectGroup = async (group) => {
    setSelectedGroup(group)
    setLoadingRanking(true)
    const { data } = await getGroupRanking(group.id)
    setLoadingRanking(false)
    setGroupRanking(data || [])
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  if (authLoading) return <div className="loader"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h2>Mis Grupos</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.9rem' }}>
            Compite con amigos, familia o la oficina.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Create group */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>➕ Crear grupo</h3>
            <form onSubmit={handleCreate}>
              {createError && <div className="alert alert-error">{createError}</div>}
              {createSuccess && <div className="alert alert-success">{createSuccess}</div>}
              <div className="form-group">
                <label className="form-label">Nombre del grupo</label>
                <input
                  type="text" className="form-input" placeholder="Ej: Oficina, Familia, El barrio"
                  value={newName} onChange={e => setNewName(e.target.value)}
                  maxLength={30} required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={creating}>
                {creating ? 'Creando...' : 'Crear grupo'}
              </button>
            </form>
          </div>

          {/* Join group */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>🔗 Unirse a un grupo</h3>
            <form onSubmit={handleJoin}>
              {joinError && <div className="alert alert-error">{joinError}</div>}
              {joinSuccess && <div className="alert alert-success">{joinSuccess}</div>}
              <div className="form-group">
                <label className="form-label">Código del grupo</label>
                <input
                  type="text" className="form-input" placeholder="Ej: AB1CD2"
                  value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6} required
                  style={{ letterSpacing: '0.15em', fontFamily: 'monospace', fontSize: '1.1rem' }}
                />
              </div>
              <button type="submit" className="btn btn-outline" style={{ width: '100%' }} disabled={joining}>
                {joining ? 'Uniéndose...' : 'Unirse con código'}
              </button>
            </form>
          </div>
        </div>

        {/* My groups list */}
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
            Grupos en los que participas
          </h3>

          {loadingGroups ? (
            <div className="loader"><div className="spinner" /></div>
          ) : groups.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
              Aún no perteneces a ningún grupo.<br />
              <span style={{ fontSize: '0.875rem' }}>Crea uno o pide el código a un amigo.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {groups.map(group => group && (
                <div
                  key={group.id}
                  className="card"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', gap: '1rem', flexWrap: 'wrap',
                    borderColor: selectedGroup?.id === group.id ? 'var(--accent)' : 'var(--border)'
                  }}
                  onClick={() => handleSelectGroup(group)}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{group.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Código:</span>
                      <span className="code-badge">{group.code}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={e => { e.stopPropagation(); copyCode(group.code) }}
                    >
                      {copied === group.code ? '✅ Copiado' : '📋 Copiar código'}
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => handleSelectGroup(group)}>
                      Ver ranking →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group ranking */}
        {selectedGroup && (
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                🏆 Ranking — {selectedGroup.name}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedGroup(null)}>✕ Cerrar</button>
            </div>

            {loadingRanking ? (
              <div className="loader"><div className="spinner" /></div>
            ) : groupRanking.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                El ranking se actualizará cuando empiecen los partidos.
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th style={{ width: 48 }}>#</th>
                      <th>Jugador</th>
                      <th style={{ textAlign: 'right' }}>Puntos</th>
                      <th style={{ textAlign: 'right' }} className="hide-mobile">Exactos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupRanking.map((entry, i) => (
                      <tr key={entry.user_id}>
                        <td><span className="rank-pos">{i + 1}</span></td>
                        <td style={{ fontWeight: 600 }}>{entry.username}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent)' }}>
                            {entry.points}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }} className="hide-mobile">
                          <span style={{ color: 'var(--green)' }}>{entry.exact}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
