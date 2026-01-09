/*
  # Music Streaming Platform Database Schema

  ## Overview
  Complete database schema for a multilingual, ad-free music streaming platform
  with offline support, personalized recommendations, and multiple genres.

  ## New Tables

  ### 1. `artists` - Artist information
  ### 2. `albums` - Album information
  ### 3. `genres` - Music genre categories
  ### 4. `songs` - Song data with audio URLs
  ### 5. `song_genres` - Many-to-many relationship
  ### 6. `playlists` - User-created playlists
  ### 7. `playlist_songs` - Songs in playlists
  ### 8. `user_listening_history` - Track listening
  ### 9. `user_favorites` - Favorite songs
  ### 10. `offline_downloads` - Offline cache tracking
  ### 11. `user_preferences` - User settings
*/

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  bio text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  cover_image_url text,
  release_date date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);

-- Create genres table
CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration integer NOT NULL,
  track_number integer NOT NULL,
  audio_url text NOT NULL,
  low_quality_url text,
  lyrics text,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_language ON songs(language);

-- Create song_genres junction table
CREATE TABLE IF NOT EXISTS song_genres (
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  genre_id uuid NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, genre_id)
);

CREATE INDEX IF NOT EXISTS idx_song_genres_genre_id ON song_genres(genre_id);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own playlists"
  ON playlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create playlists"
  ON playlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists"
  ON playlists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists"
  ON playlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);

-- Create playlist_songs table
CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position integer NOT NULL,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (playlist_id, song_id)
);

CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);

-- Create user_listening_history table
CREATE TABLE IF NOT EXISTS user_listening_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  played_at timestamptz DEFAULT now(),
  duration_played integer
);

ALTER TABLE user_listening_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own listening history"
  ON user_listening_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert listening history"
  ON user_listening_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON user_listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_song_id ON user_listening_history(song_id);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  favorited_at timestamptz DEFAULT now(),
  UNIQUE(user_id, song_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON user_favorites(user_id);

-- Create offline_downloads table
CREATE TABLE IF NOT EXISTS offline_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  UNIQUE(user_id, song_id)
);

ALTER TABLE offline_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
  ON offline_downloads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add downloads"
  ON offline_downloads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove downloads"
  ON offline_downloads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON offline_downloads(user_id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_quality text DEFAULT 'high',
  allow_recommendations boolean DEFAULT true,
  theme text DEFAULT 'light',
  language text DEFAULT 'en',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert genres
INSERT INTO genres (name, description, icon) VALUES
  ('Regional', 'Regional music from various cultures', '🌍'),
  ('Classical', 'Traditional classical and instrumental music', '🎻'),
  ('Devotional', 'Spiritual and devotional music', '🙏'),
  ('Modern', 'Contemporary and modern music genres', '🎵'),
  ('Pop', 'Popular music', '⭐'),
  ('Rock', 'Rock music', '🎸'),
  ('Jazz', 'Jazz and improvisation', '🎷'),
  ('Electronic', 'Electronic and digital music', '🎚️'),
  ('Hip-Hop', 'Hip-hop and rap', '🎤'),
  ('Country', 'Country music', '🤠')
ON CONFLICT (name) DO NOTHING;