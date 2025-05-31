-- Create the diary_entries table
CREATE TABLE IF NOT EXISTS diary_entries (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  mood VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS idx_diary_entries_timestamp ON diary_entries(timestamp DESC);

-- Create an index on mood for filtering
CREATE INDEX IF NOT EXISTS idx_diary_entries_mood ON diary_entries(mood);
