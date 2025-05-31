import { sql } from "@vercel/postgres"

export interface DiaryEntry {
  id: string
  content: string
  mood: string
  timestamp: Date
  location?: string
}

export async function getAllEntries(): Promise<DiaryEntry[]> {
  try {
    const { rows } = await sql`
      SELECT id, content, mood, location, timestamp 
      FROM diary_entries 
      ORDER BY timestamp DESC
    `

    return rows.map((row) => ({
      id: row.id.toString(),
      content: row.content,
      mood: row.mood,
      location: row.location,
      timestamp: new Date(row.timestamp),
    }))
  } catch (error) {
    console.error("Failed to fetch entries:", error)
    return []
  }
}

export async function addEntry(entry: Omit<DiaryEntry, "id" | "timestamp">): Promise<DiaryEntry> {
  try {
    const { rows } = await sql`
      INSERT INTO diary_entries (content, mood, location)
      VALUES (${entry.content}, ${entry.mood}, ${entry.location || null})
      RETURNING id, content, mood, location, timestamp
    `

    const newEntry = rows[0]
    return {
      id: newEntry.id.toString(),
      content: newEntry.content,
      mood: newEntry.mood,
      location: newEntry.location,
      timestamp: new Date(newEntry.timestamp),
    }
  } catch (error) {
    console.error("Failed to add entry:", error)
    throw new Error("Failed to save diary entry")
  }
}

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        mood VARCHAR(50) NOT NULL,
        location VARCHAR(255),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_diary_entries_timestamp 
      ON diary_entries(timestamp DESC)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_diary_entries_mood 
      ON diary_entries(mood)
    `

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}
