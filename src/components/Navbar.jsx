import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { signOut } from '../lib/supabase'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          MUNDIAL<span>ITO</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/predictions" className={isActive('/predictions')}>
                Predicciones
              </Link>
              <Link to="/ranking" className={`${isActive('/ranking')} hide-mobile`}>
                Ranking
              </Link>
              <Link to="/groups" className={`${isActive('/groups')} hide-mobile`}>
                Grupos
              </Link>
              <button className="nav-btn" onClick={handleSignOut}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/ranking" className={`${isActive('/ranking')} hide-mobile`}>
                Ranking
              </Link>
              <Link to="/login" className={isActive('/login')}>
                Entrar
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
