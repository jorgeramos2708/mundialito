// World Cup 2026 — 48 teams, 12 groups, 104 matches
// Phase: 'groups' | 'r32' | 'r16' | 'qf' | 'sf' | 'final'

export const GROUPS = {
  A: ['Mexico', 'USA', 'Uruguay', 'Panama'],
  B: ['Argentina', 'Ecuador', 'Poland', 'Morocco'],
  C: ['France', 'Australia', 'Senegal', 'Honduras'],
  D: ['Brazil', 'Japan', 'Colombia', 'Qatar'],
  E: ['England', 'Serbia', 'Cameroon', 'New Zealand'],
  F: ['Germany', 'Portugal', 'Turkey', 'Malaysia'],
  G: ['Spain', 'South Korea', 'Peru', 'Kenya'],
  H: ['Netherlands', 'Chile', 'Ukraine', 'Iraq'],
  I: ['Italy', 'Ivory Coast', 'Bolivia', 'Saudi Arabia'],
  J: ['Belgium', 'Nigeria', 'Canada', 'IR Iran'],
  K: ['Croatia', 'Algeria', 'Guatemala', 'Togo'],
  L: ['Switzerland', 'Egypt', 'Venezuela', 'Tanzania'],
}

export const FLAGS = {
  'Mexico': '🇲🇽', 'USA': '🇺🇸', 'Uruguay': '🇺🇾', 'Panama': '🇵🇦',
  'Argentina': '🇦🇷', 'Ecuador': '🇪🇨', 'Poland': '🇵🇱', 'Morocco': '🇲🇦',
  'France': '🇫🇷', 'Australia': '🇦🇺', 'Senegal': '🇸🇳', 'Honduras': '🇭🇳',
  'Brazil': '🇧🇷', 'Japan': '🇯🇵', 'Colombia': '🇨🇴', 'Qatar': '🇶🇦',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Serbia': '🇷🇸', 'Cameroon': '🇨🇲', 'New Zealand': '🇳🇿',
  'Germany': '🇩🇪', 'Portugal': '🇵🇹', 'Turkey': '🇹🇷', 'Malaysia': '🇲🇾',
  'Spain': '🇪🇸', 'South Korea': '🇰🇷', 'Peru': '🇵🇪', 'Kenya': '🇰🇪',
  'Netherlands': '🇳🇱', 'Chile': '🇨🇱', 'Ukraine': '🇺🇦', 'Iraq': '🇮🇶',
  'Italy': '🇮🇹', 'Ivory Coast': '🇨🇮', 'Bolivia': '🇧🇴', 'Saudi Arabia': '🇸🇦',
  'Belgium': '🇧🇪', 'Nigeria': '🇳🇬', 'Canada': '🇨🇦', 'IR Iran': '🇮🇷',
  'Croatia': '🇭🇷', 'Algeria': '🇩🇿', 'Guatemala': '🇬🇹', 'Togo': '🇹🇬',
  'Switzerland': '🇨🇭', 'Egypt': '🇪🇬', 'Venezuela': '🇻🇪', 'Tanzania': '🇹🇿',
  'TBD': '❓',
}

// Generate group stage matches
const generateGroupMatches = () => {
  const matches = []
  let id = 1
  const groupDates = {
    A: ['2026-06-11', '2026-06-15', '2026-06-19'],
    B: ['2026-06-12', '2026-06-16', '2026-06-20'],
    C: ['2026-06-12', '2026-06-16', '2026-06-20'],
    D: ['2026-06-13', '2026-06-17', '2026-06-21'],
    E: ['2026-06-13', '2026-06-17', '2026-06-21'],
    F: ['2026-06-14', '2026-06-18', '2026-06-22'],
    G: ['2026-06-14', '2026-06-18', '2026-06-22'],
    H: ['2026-06-15', '2026-06-19', '2026-06-23'],
    I: ['2026-06-15', '2026-06-19', '2026-06-23'],
    J: ['2026-06-16', '2026-06-20', '2026-06-24'],
    K: ['2026-06-16', '2026-06-20', '2026-06-24'],
    L: ['2026-06-17', '2026-06-21', '2026-06-25'],
  }

  Object.entries(GROUPS).forEach(([group, teams]) => {
    const pairs = [
      [teams[0], teams[1]],
      [teams[2], teams[3]],
      [teams[0], teams[2]],
      [teams[1], teams[3]],
      [teams[0], teams[3]],
      [teams[1], teams[2]],
    ]
    const dates = groupDates[group]
    pairs.forEach(([home, away], i) => {
      matches.push({
        id: `G${id++}`,
        phase: 'groups',
        group,
        home,
        away,
        date: dates[Math.floor(i / 2)],
        homeScore: null,
        awayScore: null,
      })
    })
  })
  return matches
}

// Knockout stage stubs
const knockoutMatches = [
  // Round of 32 (16 matches)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `R32-${i + 1}`,
    phase: 'r32',
    group: null,
    home: 'TBD', away: 'TBD',
    date: i < 8 ? '2026-06-28' : '2026-06-29',
    homeScore: null, awayScore: null,
  })),
  // Round of 16
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `R16-${i + 1}`,
    phase: 'r16',
    group: null,
    home: 'TBD', away: 'TBD',
    date: '2026-07-04',
    homeScore: null, awayScore: null,
  })),
  // Quarterfinals
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `QF-${i + 1}`,
    phase: 'qf',
    group: null,
    home: 'TBD', away: 'TBD',
    date: '2026-07-10',
    homeScore: null, awayScore: null,
  })),
  // Semifinals
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `SF-${i + 1}`,
    phase: 'sf',
    group: null,
    home: 'TBD', away: 'TBD',
    date: '2026-07-14',
    homeScore: null, awayScore: null,
  })),
  // Third place
  {
    id: 'TP-1', phase: '3rd',
    group: null,
    home: 'TBD', away: 'TBD',
    date: '2026-07-18',
    homeScore: null, awayScore: null,
  },
  // Final
  {
    id: 'F-1', phase: 'final',
    group: null,
    home: 'TBD', away: 'TBD',
    date: '2026-07-19',
    homeScore: null, awayScore: null,
  },
]

export const ALL_MATCHES = [...generateGroupMatches(), ...knockoutMatches]

export const PHASE_LABELS = {
  groups: 'Fase de Grupos',
  r32: 'Ronda de 32',
  r16: 'Octavos de Final',
  qf: 'Cuartos de Final',
  sf: 'Semifinales',
  '3rd': 'Tercer Lugar',
  final: 'Final',
}

// Scoring rules
export const calcPoints = (pred, actual) => {
  if (!pred || actual.homeScore === null) return 0
  const ph = pred.home_goals, pa = pred.away_goals
  const ah = actual.homeScore, aa = actual.awayScore
  if (ph === ah && pa === aa) return 6 // exact
  const predWinner = ph > pa ? 'H' : ph < pa ? 'A' : 'D'
  const actualWinner = ah > aa ? 'H' : ah < aa ? 'A' : 'D'
  if (predWinner === actualWinner) return 3 // correct result
  return 0
}
