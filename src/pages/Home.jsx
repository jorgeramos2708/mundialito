import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import LiveMatches from '../components/LiveMatches'

export default function Home() {
  const { user } = useAuth()

  return (
    <>
      {/* ── Fixed background wallpaper ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, rgba(0,80,40,0.18) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(0,40,100,0.22) 0%, transparent 55%),
          radial-gradient(ellipse at 60% 80%, rgba(80,20,0,0.12) 0%, transparent 50%)
        `,
        backgroundColor: 'var(--bg-deep)',
      }}>
        {/* SVG stadium + football pattern */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.045 }}>
          <defs>
            <pattern id="grass" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="none"/>
              <line x1="0" y1="30" x2="60" y2="30" stroke="#fff" strokeWidth="0.5"/>
              <line x1="30" y1="0" x2="30" y2="60" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
            <pattern id="dots" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="2" fill="#fff"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grass)"/>
          <rect width="100%" height="100%" fill="url(#dots)"/>
          {/* Center circle */}
          <circle cx="50%" cy="45%" r="120" stroke="#fff" strokeWidth="1" fill="none"/>
          <circle cx="50%" cy="45%" r="4"   fill="#fff"/>
          {/* Center line */}
          <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#fff" strokeWidth="1"/>
          {/* Penalty areas */}
          <rect x="calc(50% - 160px)" y="0" width="320" height="90" stroke="#fff" strokeWidth="1" fill="none"/>
          <rect x="calc(50% - 160px)" y="calc(90% - 90px)" width="320" height="90" stroke="#fff" strokeWidth="1" fill="none"/>
          {/* Goal areas */}
          <rect x="calc(50% - 70px)" y="0" width="140" height="35" stroke="#fff" strokeWidth="1" fill="none"/>
          <rect x="calc(50% - 70px)" y="calc(90% - 35px)" width="140" height="35" stroke="#fff" strokeWidth="1" fill="none"/>
        </svg>

        {/* Large faded trophy */}
        <div style={{
          position: 'absolute', bottom: '-4rem', right: '-2rem',
          fontSize: '32rem', opacity: 0.025, lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>🏆</div>

        {/* Floating balls */}
        {[
          { top: '8%',  left: '5%',  size: '3.5rem', op: 0.06 },
          { top: '22%', left: '92%', size: '2.5rem', op: 0.05 },
          { top: '55%', left: '3%',  size: '2rem',   op: 0.04 },
          { top: '70%', left: '88%', size: '4rem',   op: 0.06 },
          { top: '85%', left: '45%', size: '2.5rem', op: 0.04 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', top: b.top, left: b.left,
            fontSize: b.size, opacity: b.op,
            userSelect: 'none', pointerEvents: 'none',
          }}>⚽</div>
        ))}
      </div>

      {/* ── Hero ── */}
      <section className="hero" style={{ background: 'transparent', borderBottom: '1px solid var(--border)' }}>
        <div className="hero-badge">⚽ Mundial 2026 · 48 Selecciones · USA · México · Canadá</div>
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
          {[
            { val: '104', lbl: 'Partidos' },
            { val: '48',  lbl: 'Selecciones' },
            { val: '12',  lbl: 'Grupos' },
            { val: '3',   lbl: 'Países sede' },
          ].map(({ val, lbl }) => (
            <div key={lbl}>
              <div className="hero-stat-val">{val}</div>
              <div className="hero-stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Live matches, results, calendar & countdown ── */}
      <LiveMatches />

      {/* ── How it works ── */}
      <section className="page" style={{ background: 'transparent' }}>
        <div className="container">
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>¿Cómo funciona?</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '📝', title: 'Regístrate', text: 'Crea tu cuenta gratis con email. Sin tarjeta, sin apps.' },
              { icon: '⚽', title: 'Predice', text: 'Ingresa el marcador exacto de los 104 partidos del torneo.' },
              { icon: '👥', title: 'Crea tu grupo', text: 'Invita a amigos con un código único y compitan entre ustedes.' },
              { icon: '🏆', title: 'Sube el ranking', text: '6 pts por marcador exacto, 3 pts por acertar el resultado.' },
            ].map(({ icon, title, text }) => (
              <div className="card" key={title} style={{ backdropFilter: 'blur(8px)', background: 'rgba(13,30,48,0.85)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ marginBottom: '0.4rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Scoring */}
          <div className="card" style={{
            marginTop: '2rem', display: 'flex', gap: '2rem',
            flexWrap: 'wrap', alignItems: 'center',
            backdropFilter: 'blur(8px)', background: 'rgba(13,30,48,0.85)'
          }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Sistema de puntos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tan simple como el fútbol.</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { pts: 6, lbl: 'Marcador exacto',   color: 'var(--green)' },
                { pts: 3, lbl: 'Resultado correcto', color: 'var(--accent)' },
                { pts: 0, lbl: 'Sin puntos',         color: 'var(--text-muted)' },
              ].map(({ pts, lbl, color }) => (
                <div key={lbl} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color }}>{pts}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lbl}</div>
                </div>
              ))}
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
