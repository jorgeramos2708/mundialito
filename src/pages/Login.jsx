import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos.'
        : error.message)
    } else {
      navigate('/predictions')
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            MUNDIALITO
          </div>
          <h2>Bienvenido de vuelta</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Inicia sesión para ver tus predicciones
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email" className="form-input" placeholder="tu@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password" className="form-input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
