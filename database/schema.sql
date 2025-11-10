-- TSO Manager Database Schema
-- Wykonaj ten skrypt w Supabase SQL Editor

-- Tabela graczy
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  realm TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela typów explorerów
CREATE TABLE IF NOT EXISTS explorers_info (
  id SERIAL PRIMARY KEY,
  default_name TEXT NOT NULL,
  explorer_type INTEGER NOT NULL UNIQUE,
  explorer_icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela explorerów przypisanych do graczy
CREATE TABLE IF NOT EXISTS explorer_players (
  id TEXT PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  explorer_type_id INTEGER NOT NULL REFERENCES explorers_info(id) ON DELETE CASCADE,
  explorer_name TEXT NOT NULL,
  explorer_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(player_id, explorer_id)
);

-- Tabela akcji wykonywanych przez explorerów
CREATE TABLE IF NOT EXISTS explorers_actions (
  action_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  explorer_id TEXT NOT NULL,
  task_id INTEGER NOT NULL,
  subtask_id INTEGER NOT NULL,
  task_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  return_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_players_realm ON players(realm);
CREATE INDEX IF NOT EXISTS idx_explorer_players_player_id ON explorer_players(player_id);
CREATE INDEX IF NOT EXISTS idx_explorer_players_explorer_type_id ON explorer_players(explorer_type_id);
CREATE INDEX IF NOT EXISTS idx_explorers_actions_player_id ON explorers_actions(player_id);
CREATE INDEX IF NOT EXISTS idx_explorers_actions_explorer_id ON explorers_actions(explorer_id);
CREATE INDEX IF NOT EXISTS idx_explorers_actions_timestamp ON explorers_actions(timestamp DESC);

-- Polityki Row Level Security (RLS)
-- Uwaga: Dostosuj te polityki do swoich potrzeb bezpieczeństwa

-- Włącz RLS dla wszystkich tabel
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorers_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorer_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorers_actions ENABLE ROW LEVEL SECURITY;

-- Polityki dla players (wszyscy mogą czytać)
CREATE POLICY "Allow public read access on players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Allow service role full access on players"
  ON players FOR ALL
  USING (auth.role() = 'service_role');

-- Polityki dla explorers_info (wszyscy mogą czytać)
CREATE POLICY "Allow public read access on explorers_info"
  ON explorers_info FOR SELECT
  USING (true);

CREATE POLICY "Allow service role full access on explorers_info"
  ON explorers_info FOR ALL
  USING (auth.role() = 'service_role');

-- Polityki dla explorer_players (wszyscy mogą czytać)
CREATE POLICY "Allow public read access on explorer_players"
  ON explorer_players FOR SELECT
  USING (true);

CREATE POLICY "Allow service role full access on explorer_players"
  ON explorer_players FOR ALL
  USING (auth.role() = 'service_role');

-- Polityki dla explorers_actions (wszyscy mogą czytać)
CREATE POLICY "Allow public read access on explorers_actions"
  ON explorers_actions FOR SELECT
  USING (true);

CREATE POLICY "Allow service role full access on explorers_actions"
  ON explorers_actions FOR ALL
  USING (auth.role() = 'service_role');

-- Funkcja do czyszczenia starych akcji (opcjonalnie)
CREATE OR REPLACE FUNCTION cleanup_old_actions()
RETURNS void AS $$
BEGIN
  DELETE FROM explorers_actions
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Przykładowe dane testowe (opcjonalnie - usuń jeśli nie potrzebujesz)
/*
INSERT INTO players (id, name, realm) VALUES
  (1, 'TestPlayer1', 'Realm1'),
  (2, 'TestPlayer2', 'Realm2');

INSERT INTO explorers_info (default_name, explorer_type, explorer_icon) VALUES
  ('Explorer Scout', 1, 'icon_scout.png'),
  ('Explorer Warrior', 2, 'icon_warrior.png');
*/

