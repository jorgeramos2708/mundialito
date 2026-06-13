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
      <style>{`
        @keyframes slideText {
          0%   { transform: translateX(-18px); opacity: 0; }
          12%  { transform: translateX(0);     opacity: 1; }
          88%  { transform: translateX(0);     opacity: 1; }
          100% { transform: translateX(18px);  opacity: 0; }
        }
        @keyframes kickLeg {
          0%,100% { transform: rotate(0deg); }
          40%     { transform: rotate(-28deg); }
          60%     { transform: rotate(12deg); }
        }
        @keyframes ballFly {
          0%   { transform: translate(0,0) scale(1); opacity:1; }
          50%  { transform: translate(48px,-30px) scale(.85); opacity:.9; }
          100% { transform: translate(0,0) scale(1); opacity:1; }
        }
        @keyframes bodyBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-3px); }
        }
        .hero-slide-text {
          display: inline-block;
          animation: slideText 4s ease-in-out infinite;
        }
        .hero-slide-text-2 {
          display: inline-block;
          animation: slideText 4s ease-in-out infinite;
          animation-delay: 0.15s;
        }
      `}</style>

      <section className="hero" style={{ background: 'transparent', borderBottom: '1px solid var(--border)', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="hero-badge">⚽ Mundial 2026 · 48 Selecciones · USA · México · Canadá</div>

        {/* Logo row: footballer SVG + title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>

          {/* Footballer SVG */}
          <svg width="90" height="110" viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            {/* Body group — bobs up/down */}
            <g style={{ animation: 'bodyBob 2s ease-in-out infinite', transformOrigin: '45px 55px' }}>
              {/* Head */}
              <circle cx="45" cy="14" r="11" fill="#F5C89A"/>
              {/* Hair */}
              <path d="M34 10 Q45 2 56 10 Q52 5 45 4 Q38 5 34 10Z" fill="#3D2B1A"/>
              {/* Body / jersey — amber */}
              <rect x="32" y="26" width="26" height="32" rx="5" fill="#F5A623"/>
              {/* Number on jersey */}
              <text x="45" y="46" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">10</text>
              {/* Left arm */}
              <rect x="20" y="27" width="12" height="7" rx="3.5" fill="#F5A623" transform="rotate(-20 26 30)"/>
              {/* Right arm — raised */}
              <rect x="58" y="22" width="12" height="7" rx="3.5" fill="#F5A623" transform="rotate(30 64 25)"/>
              {/* Shorts */}
              <rect x="33" y="56" width="24" height="14" rx="3" fill="#1A3A6B"/>
              {/* Left leg */}
              <rect x="33" y="70" width="10" height="22" rx="4" fill="#F5C89A"/>
              {/* Left shoe */}
              <ellipse cx="38" cy="93" rx="8" ry="4" fill="#222"/>
              {/* Right leg — kick! */}
              <g style={{ animation: 'kickLeg 2s ease-in-out infinite', transformOrigin: '52px 70px' }}>
                <rect x="47" y="70" width="10" height="22" rx="4" fill="#F5C89A"/>
                <ellipse cx="52" cy="93" rx="8" ry="4" fill="#222"/>
              </g>
            </g>
            {/* Ball — flies when kicked */}
            <g style={{ animation: 'ballFly 2s ease-in-out infinite', transformOrigin: '68px 88px' }}>
              <circle cx="68" cy="88" r="9" fill="white" stroke="#333" strokeWidth="1.2"/>
              <path d="M68 79 L72 84 L68 90 L64 84Z" fill="#333"/>
              <path d="M59 88 L64 84 L64 92Z" fill="#333" opacity=".5"/>
              <path d="M77 88 L72 84 L72 92Z" fill="#333" opacity=".5"/>
            </g>
          </svg>

          {/* Title */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '-0.2rem' }}>
              <span className="hero-slide-text">LA QUINIELA DEL</span>
            </div>
            <h1 className="hero-title" style={{ margin: 0, fontSize: 'clamp(3.5rem, 10vw, 7rem)', lineHeight: 1 }}>
              <span className="hero-slide-text-2">MUNDIAL<em style={{ color: 'var(--accent)' }}>ITO</em></span>
            </h1>
          </div>
        </div>

        <p className="hero-sub" style={{ fontSize: '1.1rem', marginBottom: '1.75rem' }}>
          Predice los 104 partidos, compite con amigos y sube en el ranking global.
          Gratis, sin descargas.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/predictions" className="btn btn-primary">Mis predicciones →</Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary">Jugar gratis →</Link>
              <Link to="/ranking" className="btn btn-outline">Ver ranking</Link>
            </>
          )}
        </div>

        <div className="hero-stats" style={{ marginTop: '2.5rem' }}>
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
