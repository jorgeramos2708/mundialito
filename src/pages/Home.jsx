import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">⚽ Mundial 2026 · 48 Selecciones</div>
        <h1 className="hero-title">
          La quiniela<br />del <em>Mundial</em>
        </h1>
        <p className="hero-sub">
          Predice los 104 partidos, compite con amigos y sube en el ranking global.
          Gratis, sin descargas.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/predictions" className="btn btn-primary">
              Mis predicciones →
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary">
                Jugar gratis →
              </Link>
              <Link to="/ranking" className="btn btn-outline">
                Ver ranking
              </Link>
            </>
          )}
        </div>

        <div className="hero-stats">
          <div>
            <div className="hero-stat-val">104</div>
            <div className="hero-stat-lbl">Partidos</div>
          </div>
          <div>
            <div className="hero-stat-val">48</div>
            <div className="hero-stat-lbl">Selecciones</div>
          </div>
          <div>
            <div className="hero-stat-val">12</div>
            <div className="hero-stat-lbl">Grupos</div>
          </div>
          <div>
            <div className="hero-stat-val">3</div>
            <div className="hero-stat-lbl">Países sede</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="page">
        <div className="container">
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>¿Cómo funciona?</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '📝', title: 'Regístrate', text: 'Crea tu cuenta gratis con email. Sin tarjeta, sin apps.' },
              { icon: '⚽', title: 'Predice', text: 'Ingresa el marcador exacto de los 104 partidos del torneo.' },
              { icon: '👥', title: 'Crea tu grupo', text: 'Invita a amigos con un código único y compitan entre ustedes.' },
              { icon: '🏆', title: 'Sube el ranking', text: '6 pts por marcador exacto, 3 pts por acertar el resultado.' },
            ].map(({ icon, title, text }) => (
              <div className="card" key={title}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ marginBottom: '0.4rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Scoring */}
          <div className="card" style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Sistema de puntos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tan simple como el fútbol.</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--green)' }}>6</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Marcador exacto</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--accent)' }}>3</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resultado correcto</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-muted)' }}>0</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sin puntos</div>
              </div>
            </div>
          </div>

          {!user && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.8rem 2rem' }}>
                Crear cuenta gratis →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
