-- ============================================================
-- MUNDIALITO — Supabase Schema
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username   TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Usuario' || substr(NEW.id::text, 1, 6))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id   TEXT NOT NULL,
  home_goals INT NOT NULL CHECK (home_goals >= 0),
  away_goals INT NOT NULL CHECK (away_goals >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, match_id)
);

-- 3. Match results (admin fills this)
CREATE TABLE IF NOT EXISTS match_results (
  match_id    TEXT PRIMARY KEY,
  home_goals  INT NOT NULL,
  away_goals  INT NOT NULL,
  played_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Groups
CREATE TABLE IF NOT EXISTS groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  code        TEXT UNIQUE NOT NULL,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Group members
CREATE TABLE IF NOT EXISTS group_members (
  group_id   UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- ============================================================
-- VIEWS for rankings
-- ============================================================

-- Global ranking view
CREATE OR REPLACE VIEW ranking_view AS
SELECT
  p.user_id,
  pr.username,
  SUM(
    CASE
      WHEN r.home_goals IS NULL THEN 0
      WHEN p.home_goals = r.home_goals AND p.away_goals = r.away_goals THEN 6
      WHEN
        (p.home_goals > p.away_goals AND r.home_goals > r.away_goals) OR
        (p.home_goals < p.away_goals AND r.home_goals < r.away_goals) OR
        (p.home_goals = p.away_goals AND r.home_goals = r.away_goals)
        THEN 3
      ELSE 0
    END
  ) AS points,
  SUM(
    CASE WHEN r.home_goals IS NOT NULL AND p.home_goals = r.home_goals AND p.away_goals = r.away_goals THEN 1 ELSE 0 END
  ) AS exact,
  SUM(
    CASE WHEN r.home_goals IS NOT NULL AND (
      (p.home_goals > p.away_goals AND r.home_goals > r.away_goals) OR
      (p.home_goals < p.away_goals AND r.home_goals < r.away_goals) OR
      (p.home_goals = p.away_goals AND r.home_goals = r.away_goals)
    ) AND NOT (p.home_goals = r.home_goals AND p.away_goals = r.away_goals) THEN 1 ELSE 0 END
  ) AS correct,
  COUNT(p.id) AS predictions
FROM predictions p
JOIN profiles pr ON pr.id = p.user_id
LEFT JOIN match_results r ON r.match_id = p.match_id
GROUP BY p.user_id, pr.username;

-- Group ranking view
CREATE OR REPLACE VIEW group_ranking_view AS
SELECT
  gm.group_id,
  rv.*
FROM group_members gm
JOIN ranking_view rv ON rv.user_id = gm.user_id;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Predictions: own read+write, public read of others
CREATE POLICY "predictions_own_all" ON predictions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "predictions_public_read" ON predictions FOR SELECT USING (true);

-- Match results: public read, admin write
CREATE POLICY "results_public_read" ON match_results FOR SELECT USING (true);

-- Groups: public read, auth insert
CREATE POLICY "groups_public_read" ON groups FOR SELECT USING (true);
CREATE POLICY "groups_auth_insert" ON groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Group members: members read own, auth insert
CREATE POLICY "group_members_read" ON group_members FOR SELECT USING (true);
CREATE POLICY "group_members_insert" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
