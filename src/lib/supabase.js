import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Auth helpers ───────────────────────────────────────────
export const signUp = (email, password, username) =>
  supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  })

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

// ─── Predictions ────────────────────────────────────────────
export const getPredictions = async (userId) => {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

export const upsertPrediction = async (userId, matchId, homeGoals, awayGoals) => {
  const { data, error } = await supabase
    .from('predictions')
    .upsert({
      user_id: userId,
      match_id: matchId,
      home_goals: homeGoals,
      away_goals: awayGoals,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,match_id' })
  return { data, error }
}

// ─── Ranking ────────────────────────────────────────────────
export const getGlobalRanking = async () => {
  const { data, error } = await supabase
    .from('ranking_view')
    .select('*')
    .order('points', { ascending: false })
    .limit(50)
  return { data, error }
}

// ─── Groups ─────────────────────────────────────────────────
export const createGroup = async (userId, name) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  const { data, error } = await supabase
    .from('groups')
    .insert({ name, code, created_by: userId })
    .select()
    .single()
  if (error) return { data, error }
  // join creator automatically
  await supabase.from('group_members').insert({ group_id: data.id, user_id: userId })
  return { data, error }
}

export const joinGroup = async (userId, code) => {
  const { data: group, error: gErr } = await supabase
    .from('groups')
    .select('id')
    .eq('code', code)
    .single()
  if (gErr) return { data: null, error: gErr }
  const { data, error } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: userId })
  return { data, error }
}

export const getMyGroups = async (userId) => {
  const { data, error } = await supabase
    .from('group_members')
    .select('groups(id, name, code, created_by)')
    .eq('user_id', userId)
  return { data: data?.map(d => d.groups) || [], error }
}

export const getGroupRanking = async (groupId) => {
  const { data, error } = await supabase
    .from('group_ranking_view')
    .select('*')
    .eq('group_id', groupId)
    .order('points', { ascending: false })
  return { data, error }
}
