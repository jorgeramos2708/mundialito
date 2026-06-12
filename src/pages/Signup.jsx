import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/supabase'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    const { data, error } = await signUp(email, password, username)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else if (data?.user?.identities?.length === 0) {
      setError('Este email ya está registrado.')
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/predictions'), 2500)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            MUNDIALITO
          </div>
          <h2>Crea tu cuenta</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Gratis para siempre. Sin tarjeta.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">✅ ¡Cuenta creada! Revisa tu email y luego entra a predecir.</div>}

            <div className="form-group">
              <label className="form-label">Nombre de usuario</label>
              <input
                type="text" className="form-input" placeholder="ElProfetico"
                value={username} onChange={e => setUsername(e.target.value)}
                required minLength={3} maxLength={20}
              />
            </div>

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
                type="password" className="form-input" placeholder="Mínimo 6 caracteres"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading || success}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
