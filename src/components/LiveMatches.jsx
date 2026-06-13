import { useState, useEffect, useCallback } from 'react'

// Banderas via twemoji CDN — no depende de emoji unicode
const FLAG_URL = (code) =>
  `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`

const T = {
  'Mexico':           FLAG_URL('1f1f2-1f1fd'),
  'Sudafrica':        FLAG_URL('1f1ff-1f1e6'),
  'Corea del Sur':    FLAG_URL('1f1f0-1f1f7'),
  'Chequia':          FLAG_URL('1f1e8-1f1ff'),
  'Canada':           FLAG_URL('1f1e8-1f1e6'),
  'Suiza':            FLAG_URL('1f1e8-1f1ed'),
  'Qatar':            FLAG_URL('1f1f6-1f1e6'),
  'Bosnia':           FLAG_URL('1f1e7-1f1e6'),
  'Brasil':           FLAG_URL('1f1e7-1f1f7'),
  'Marruecos':        FLAG_URL('1f1f2-1f1e6'),
  'Haiti':            FLAG_URL('1f1ed-1f1f9'),
  'Escocia':          FLAG_URL('1f3f4'),
  'Estados Unidos':   FLAG_URL('1f1fa-1f1f8'),
  'Paraguay':         FLAG_URL('1f1f5-1f1fe'),
  'Australia':        FLAG_URL('1f1e6-1f1fa'),
  'Turquia':          FLAG_URL('1f1f9-1f1f7'),
  'Alemania':         FLAG_URL('1f1e9-1f1ea'),
  'Curazao':          FLAG_URL('1f1e8-1f1fc'),
  'Costa de Marfil':  FLAG_URL('1f1e8-1f1ee'),
  'Ecuador':          FLAG_URL('1f1ea-1f1e8'),
  'Paises Bajos':     FLAG_URL('1f1f3-1f1f1'),
  'Japon':            FLAG_URL('1f1ef-1f1f5'),
  'Tunez':            FLAG_URL('1f1f9-1f1f3'),
  'Suecia':           FLAG_URL('1f1f8-1f1ea'),
  'Belgica':          FLAG_URL('1f1e7-1f1ea'),
  'Egipto':           FLAG_URL('1f1ea-1f1ec'),
  'Iran':             FLAG_URL('1f1ee-1f1f7'),
  'Nueva Zelanda':    FLAG_URL('1f1f3-1f1ff'),
  'Espana':           FLAG_URL('1f1ea-1f1f8'),
  'Cabo Verde':       FLAG_URL('1f1e8-1f1fb'),
  'Arabia Saudita':   FLAG_URL('1f1f8-1f1e6'),
  'Uruguay':          FLAG_URL('1f1fa-1f1fe'),
  'Francia':          FLAG_URL('1f1eb-1f1f7'),
  'Senegal':          FLAG_URL('1f1f8-1f1f3'),
  'Noruega':          FLAG_URL('1f1f3-1f1f4'),
  'Iraq':             FLAG_URL('1f1ee-1f1f6'),
  'Argentina':        FLAG_URL('1f1e6-1f1f7'),
  'Argelia':          FLAG_URL('1f1e9-1f1ff'),
  'Austria':          FLAG_URL('1f1e6-1f1f9'),
  'Jordania':         FLAG_URL('1f1ef-1f1f4'),
  'Portugal':         FLAG_URL('1f1f5-1f1f9'),
  'Colombia':         FLAG_URL('1f1e8-1f1f4'),
  'Uzbekistan':       FLAG_URL('1f1fa-1f1ff'),
  'DR Congo':         FLAG_URL('1f1e8-1f1e9'),
  'Inglaterra':       FLAG_URL('1f3f4'),
  'Croacia':          FLAG_URL('1f1ed-1f1f7'),
  'Ghana':            FLAG_URL('1f1ec-1f1ed'),
  'Panama':           FLAG_URL('1f1f5-1f1e6'),
}

// Normaliza nombre (quita tildes) para buscar en T
const normalize = (s) => s
  .replace(/é/g,'e').replace(/á/g,'a').replace(/í/g,'i')
  .replace(/ó/g,'o').replace(/ú/g,'u').replace(/ñ/g,'n')
  .replace(/ü/g,'u')

const flagUrl = (name) => T[normalize(name)] || T[name] || null

function FlagImg({ name, size = 28 }) {
  const url = flagUrl(name)
  if (!url) return <span style={{fontSize:'1.4rem'}}>🏳️</span>
  return (
    <img
      src={url}
      alt={name}
      width={size}
      height={size}
      style={{ objectFit: 'contain', flexShrink: 0, borderRadius: 2 }}
      onError={e => { e.target.style.display='none' }}
    />
  )
}

// Calendario completo
const SCHEDULE = [
  {id:'g01',home:'México',        away:'Sudáfrica',           utc:'2026-06-11T23:00'},
  {id:'g02',home:'Corea del Sur', away:'Chequia',             utc:'2026-06-12T02:00'},
  {id:'g03',home:'Canadá',        away:'Bosnia y Herzegovina',utc:'2026-06-12T23:00'},
  {id:'g04',home:'Qatar',         away:'Suiza',               utc:'2026-06-13T19:00'},
  {id:'g05',home:'Brasil',        away:'Marruecos',           utc:'2026-06-14T00:00'},
  {id:'g06',home:'Haití',         away:'Escocia',             utc:'2026-06-14T22:00'},
  {id:'g07',home:'Estados Unidos',away:'Paraguay',            utc:'2026-06-13T02:00'},
  {id:'g08',home:'Australia',     away:'Turquía',             utc:'2026-06-15T00:00'},
  {id:'g09',home:'Alemania',      away:'Curazao',             utc:'2026-06-15T23:00'},
  {id:'g10',home:'Costa de Marfil',away:'Ecuador',            utc:'2026-06-16T02:00'},
  {id:'g11',home:'Países Bajos',  away:'Japón',               utc:'2026-06-16T23:00'},
  {id:'g12',home:'Túnez',         away:'Suecia',              utc:'2026-06-17T02:00'},
  {id:'g13',home:'Bélgica',       away:'Egipto',              utc:'2026-06-17T23:00'},
  {id:'g14',home:'Irán',          away:'Nueva Zelanda',       utc:'2026-06-18T02:00'},
  {id:'g15',home:'España',        away:'Cabo Verde',          utc:'2026-06-18T23:00'},
  {id:'g16',home:'Arabia Saudita',away:'Uruguay',             utc:'2026-06-19T02:00'},
  {id:'g17',home:'Francia',       away:'Senegal',             utc:'2026-06-19T23:00'},
  {id:'g18',home:'Noruega',       away:'Iraq',                utc:'2026-06-20T02:00'},
  {id:'g19',home:'Argentina',     away:'Argelia',             utc:'2026-06-20T23:00'},
  {id:'g20',home:'Austria',       away:'Jordania',            utc:'2026-06-21T02:00'},
  {id:'g21',home:'Portugal',      away:'Colombia',            utc:'2026-06-21T23:00'},
  {id:'g22',home:'Uzbekistán',    away:'DR Congo',            utc:'2026-06-22T02:00'},
  {id:'g23',home:'Inglaterra',    away:'Croacia',             utc:'2026-06-22T23:00'},
  {id:'g24',home:'Ghana',         away:'Panamá',              utc:'2026-06-23T02:00'},
  {id:'g25',home:'Chequia',       away:'Sudáfrica',           utc:'2026-06-18T20:00'},
  {id:'g26',home:'México',        away:'Corea del Sur',       utc:'2026-06-19T20:00'},
  {id:'g27',home:'Suiza',         away:'Qatar',               utc:'2026-06-19T23:00'},
  {id:'g28',home:'Bosnia y Herzegovina',away:'Canadá',        utc:'2026-06-20T20:00'},
  {id:'g29',home:'Marruecos',     away:'Haití',               utc:'2026-06-20T23:00'},
  {id:'g30',home:'Escocia',       away:'Brasil',              utc:'2026-06-21T20:00'},
  {id:'g31',home:'Turquía',       away:'Estados Unidos',      utc:'2026-06-21T23:00'},
  {id:'g32',home:'Paraguay',      away:'Australia',           utc:'2026-06-22T20:00'},
  {id:'g33',home:'Ecuador',       away:'Alemania',            utc:'2026-06-22T23:00'},
  {id:'g34',home:'Curazao',       away:'Costa de Marfil',     utc:'2026-06-23T20:00'},
  {id:'g35',home:'Japón',         away:'Túnez',               utc:'2026-06-23T23:00'},
  {id:'g36',home:'Suecia',        away:'Países Bajos',        utc:'2026-06-24T20:00'},
  {id:'g37',home:'Egipto',        away:'Irán',                utc:'2026-06-24T23:00'},
  {id:'g38',home:'Nueva Zelanda', away:'Bélgica',             utc:'2026-06-25T20:00'},
  {id:'g39',home:'Uruguay',       away:'España',              utc:'2026-06-25T23:00'},
  {id:'g40',home:'Cabo Verde',    away:'Arabia Saudita',      utc:'2026-06-26T20:00'},
  {id:'g41',home:'Senegal',       away:'Noruega',             utc:'2026-06-26T23:00'},
  {id:'g42',home:'Iraq',          away:'Francia',             utc:'2026-06-27T20:00'},
  {id:'g43',home:'Argelia',       away:'Austria',             utc:'2026-06-27T23:00'},
  {id:'g44',home:'Jordania',      away:'Argentina',           utc:'2026-06-28T20:00'},
  {id:'g45',home:'Colombia',      away:'Uzbekistán',          utc:'2026-06-28T23:00'},
  {id:'g46',home:'DR Congo',      away:'Portugal',            utc:'2026-06-29T20:00'},
  {id:'g47',home:'Croacia',       away:'Ghana',               utc:'2026-06-29T23:00'},
  {id:'g48',home:'Panamá',        away:'Inglaterra',          utc:'2026-06-30T20:00'},
  {id:'g49',home:'Sudáfrica',     away:'México',              utc:'2026-06-25T02:00'},
  {id:'g50',home:'Chequia',       away:'Corea del Sur',       utc:'2026-06-25T02:00'},
  {id:'g51',home:'Canadá',        away:'Qatar',               utc:'2026-06-26T02:00'},
  {id:'g52',home:'Suiza',         away:'Bosnia y Herzegovina',utc:'2026-06-26T02:00'},
  {id:'g53',home:'Brasil',        away:'Haití',               utc:'2026-06-27T02:00'},
  {id:'g54',home:'Marruecos',     away:'Escocia',             utc:'2026-06-27T02:00'},
  {id:'g55',home:'Estados Unidos',away:'Australia',           utc:'2026-06-28T02:00'},
  {id:'g56',home:'Turquía',       away:'Paraguay',            utc:'2026-06-28T02:00'},
  {id:'g57',home:'Alemania',      away:'Costa de Marfil',     utc:'2026-06-29T02:00'},
  {id:'g58',home:'Ecuador',       away:'Curazao',             utc:'2026-06-29T02:00'},
  {id:'g59',home:'Países Bajos',  away:'Suecia',              utc:'2026-06-30T02:00'},
  {id:'g60',home:'Japón',         away:'Túnez',               utc:'2026-06-30T02:00'},
  {id:'g61',home:'Bélgica',       away:'Irán',                utc:'2026-07-01T02:00'},
  {id:'g62',home:'Egipto',        away:'Nueva Zelanda',       utc:'2026-07-01T02:00'},
  {id:'g63',home:'España',        away:'Arabia Saudita',      utc:'2026-07-02T02:00'},
  {id:'g64',home:'Uruguay',       away:'Cabo Verde',          utc:'2026-07-02T02:00'},
  {id:'g65',home:'Francia',       away:'Noruega',             utc:'2026-07-03T02:00'},
  {id:'g66',home:'Senegal',       away:'Iraq',                utc:'2026-07-03T02:00'},
  {id:'g67',home:'Argentina',     away:'Austria',             utc:'2026-07-04T02:00'},
  {id:'g68',home:'Argelia',       away:'Jordania',            utc:'2026-07-04T02:00'},
  {id:'g69',home:'Portugal',      away:'Uzbekistán',          utc:'2026-07-05T02:00'},
  {id:'g70',home:'Colombia',      away:'DR Congo',            utc:'2026-07-05T02:00'},
  {id:'g71',home:'Inglaterra',    away:'Ghana',               utc:'2026-07-06T02:00'},
  {id:'g72',home:'Croacia',       away:'Panamá',              utc:'2026-07-06T02:00'},
].map(m => ({ ...m, date: new Date(m.utc + ':00Z'), homeScore: null, awayScore: null }))

const RESULTS = {
  'g01': { homeScore: 2, awayScore: 0 },
  'g02': { homeScore: 2, awayScore: 1 },
  'g03': { homeScore: 1, awayScore: 1 },
  'g07': { homeScore: 4, awayScore: 1 },
}
const SCHEDULE_FINAL = SCHEDULE.map(m => RESULTS[m.id] ? { ...m, ...RESULTS[m.id] } : m)

function Countdown({ target }) {
  const [diff, setDiff] = useState(null)
  useEffect(() => {
    const tick = () => {
      const ms = target - Date.now()
      if (ms <= 0) { setDiff(null); return }
      setDiff({ h: Math.floor(ms/3600000), m: Math.floor((ms%3600000)/60000), s: Math.floor((ms%60000)/1000) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [target])
  if (!diff) return <span style={{color:'var(--green)',fontWeight:700}}>En curso</span>
  return (
    <div style={{display:'flex',gap:'0.4rem',alignItems:'center'}}>
      {[{val:diff.h,lbl:'h'},{val:diff.m,lbl:'m'},{val:diff.s,lbl:'s'}].map(({val,lbl})=>(
        <div key={lbl} style={{textAlign:'center'}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',color:'var(--accent)',lineHeight:1,background:'var(--bg-surface)',padding:'0.15rem 0.45rem',borderRadius:'var(--radius-sm)',minWidth:'2.2rem'}}>
            {String(val).padStart(2,'0')}
          </div>
          <div style={{fontSize:'0.6rem',color:'var(--text-muted)',marginTop:'0.15rem'}}>{lbl}</div>
        </div>
      ))}
    </div>
  )
}

function MatchRow({ m, showScore, isLive }) {
  const dateStr = m.date.toLocaleDateString('es-MX',{weekday:'short',month:'short',day:'numeric'})
  const timeStr = m.date.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:'0.5rem',padding:'0.8rem 1.25rem',borderBottom:'1px solid var(--border)',background:isLive?'rgba(46,204,113,0.06)':'transparent'}}>
      <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
        <FlagImg name={m.home} />
        <span style={{fontSize:'0.875rem',fontWeight:600}}>{m.home}</span>
      </div>
      <div style={{textAlign:'center',minWidth:'5.5rem'}}>
        {showScore ? (
          <div style={{display:'flex',alignItems:'center',gap:'0.25rem',justifyContent:'center'}}>
            {isLive && <span style={{width:7,height:7,borderRadius:'50%',background:'var(--green)',display:'inline-block',animation:'pulse 1.2s infinite',marginRight:'0.2rem'}}/>}
            <span style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',color:isLive?'var(--green)':'var(--accent)'}}>{m.homeScore??0}</span>
            <span style={{color:'var(--text-muted)',fontFamily:'var(--font-display)',fontSize:'1.2rem'}}>-</span>
            <span style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',color:isLive?'var(--green)':'var(--accent)'}}>{m.awayScore??0}</span>
          </div>
        ):(
          <div style={{fontSize:'0.8rem',color:'var(--text-muted)',lineHeight:1.3}}>
            <div>{dateStr}</div>
            <div style={{fontWeight:700,color:'var(--text)',marginTop:'0.1rem'}}>{timeStr}</div>
          </div>
        )}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'0.6rem',justifyContent:'flex-end'}}>
        <span style={{fontSize:'0.875rem',fontWeight:600,textAlign:'right'}}>{m.away}</span>
        <FlagImg name={m.away} />
      </div>
    </div>
  )
}

export default function LiveMatches() {
  const [tab, setTab] = useState('finished')
  const [matches, setMatches] = useState(SCHEDULE_FINAL)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json',{ cache:'no-store' })
      if (!res.ok) return
      const json = await res.json()
      const results = {}
      ;(json.rounds||[]).forEach(round => {
        ;(round.matches||[]).forEach(m => {
          if (m.score1 == null) return
          const EN_ES = {
            'Mexico':'México','South Africa':'Sudáfrica','Korea Republic':'Corea del Sur',
            'Czechia':'Chequia','Canada':'Canadá','Switzerland':'Suiza',
            'Bosnia and Herzegovina':'Bosnia y Herzegovina','Brazil':'Brasil',
            'Morocco':'Marruecos','Haiti':'Haití','Scotland':'Escocia',
            'United States':'Estados Unidos','Paraguay':'Paraguay','Australia':'Australia',
            'Turkey':'Turquía','Germany':'Alemania','Curazao':'Curazao',
            "Cote d'Ivoire":'Costa de Marfil','Ecuador':'Ecuador',
            'Netherlands':'Países Bajos','Japan':'Japón','Tunisia':'Túnez',
            'Sweden':'Suecia','Belgium':'Bélgica','Egypt':'Egipto','Iran':'Irán',
            'New Zealand':'Nueva Zelanda','Spain':'España','Cape Verde':'Cabo Verde',
            'Saudi Arabia':'Arabia Saudita','Uruguay':'Uruguay','France':'Francia',
            'Senegal':'Senegal','Norway':'Noruega','Iraq':'Iraq','Argentina':'Argentina',
            'Algeria':'Argelia','Austria':'Austria','Jordan':'Jordania','Portugal':'Portugal',
            'Colombia':'Colombia','Uzbekistan':'Uzbekistán','DR Congo':'DR Congo',
            'England':'Inglaterra','Croatia':'Croacia','Ghana':'Ghana','Panama':'Panamá',
          }
          const h = EN_ES[m.team1?.name||m.team1] || m.team1?.name || m.team1
          const a = EN_ES[m.team2?.name||m.team2] || m.team2?.name || m.team2
          results[`${h}|${a}`] = { homeScore: m.score1, awayScore: m.score2 }
        })
      })
      setMatches(SCHEDULE_FINAL.map(m => {
        const r = results[`${m.home}|${m.away}`]
        return r ? { ...m, ...r } : m
      }))
      setLastUpdated(new Date())
    } catch (_) {}
  }, [])

  useEffect(() => {
    fetchResults()
    const id = setInterval(fetchResults, 120000)
    return () => clearInterval(id)
  }, [fetchResults])

  const [tick, setTick] = useState(Date.now())
  useEffect(() => { const id = setInterval(()=>setTick(Date.now()), 30000); return ()=>clearInterval(id) }, [])

  const LIVE_WINDOW = 115 * 60 * 1000
  const live     = matches.filter(m => m.homeScore === null && m.date.getTime() <= tick && tick <= m.date.getTime() + LIVE_WINDOW)
  const finished = matches.filter(m => m.homeScore !== null).slice().reverse()
  const upcoming = matches.filter(m => m.homeScore === null && m.date.getTime() > tick)
  const nextMatch = upcoming[0] || null

  useEffect(() => {
    if (live.length > 0) setTab('live')
    else if (finished.length > 0) setTab('finished')
    else setTab('upcoming')
  }, [live.length, finished.length])

  const tabs = [
    {key:'live',     label:'En vivo',     count:live.length,     dot:'🔴'},
    {key:'finished', label:'Finalizados', count:finished.length, dot:'✅'},
    {key:'upcoming', label:'Proximos',    count:upcoming.length, dot:'📅'},
  ]
  const list = tab==='live' ? live : tab==='finished' ? finished : upcoming

  return (
    <section style={{background:'var(--bg-card)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'2rem 0'}}>
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem',marginBottom:'1.5rem'}}>
          <div>
            <h2 style={{fontSize:'1.4rem'}}>Partidos del Mundial</h2>
            <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:'0.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
              {lastUpdated.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}
              <button onClick={fetchResults} style={{background:'none',border:'none',color:'var(--accent)',cursor:'pointer',fontSize:'0.8rem',padding:0}}>
                actualizando cada 2 min
              </button>
            </div>
          </div>
          {nextMatch && (
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.7rem',color:'var(--text-muted)',marginBottom:'0.35rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Proximo partido</div>
              <div style={{fontSize:'0.82rem',fontWeight:600,marginBottom:'0.4rem',display:'flex',alignItems:'center',gap:'0.4rem',justifyContent:'flex-end'}}>
                <FlagImg name={nextMatch.home} size={20}/> {nextMatch.home} vs {nextMatch.away} <FlagImg name={nextMatch.away} size={20}/>
              </div>
              <Countdown target={nextMatch.date.getTime()} />
            </div>
          )}
        </div>

        <div style={{display:'flex',gap:'0.25rem',borderBottom:'1px solid var(--border)'}}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{padding:'0.6rem 1rem',fontSize:'0.85rem',fontWeight:600,color:tab===t.key?'var(--accent)':'var(--text-muted)',background:'none',border:'none',borderBottom:`2px solid ${tab===t.key?'var(--accent)':'transparent'}`,marginBottom:'-1px',cursor:'pointer',transition:'all 0.15s',display:'flex',alignItems:'center',gap:'0.4rem'}}>
              {t.dot} {t.label}
              {t.count>0&&<span style={{background:t.key==='live'?'var(--green)':'var(--bg-surface)',color:t.key==='live'?'#000':'var(--text-muted)',fontSize:'0.7rem',fontWeight:700,padding:'0.1rem 0.4rem',borderRadius:'999px'}}>{t.count}</span>}
            </button>
          ))}
        </div>

        <div style={{background:'var(--bg-deep)',borderRadius:'0 0 var(--radius) var(--radius)',border:'1px solid var(--border)',borderTop:'none',maxHeight:'440px',overflowY:'auto'}}>
          {list.length===0?(
            <div style={{padding:'2.5rem',textAlign:'center',color:'var(--text-muted)',fontSize:'0.9rem'}}>
              {tab==='live'?'No hay partidos en vivo ahora mismo.':tab==='finished'?'Aun no hay partidos finalizados.':'No hay proximos partidos.'}
            </div>
          ):(
            list.map(m=><MatchRow key={m.id} m={m} showScore={tab!=='upcoming'} isLive={tab==='live'}/>)
          )}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </section>
  )
}
