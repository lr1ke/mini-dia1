export interface DiaryEntry {
  id: string
  content: string
  mood: string
  timestamp: Date
  location?: string
}

// In-memory storage (resets on server restart)
const entries: DiaryEntry[] = [
  {
    id: "1",
    content:
      "Today was a beautiful day. I went for a walk in the park and felt grateful for the simple moments in life.",
    mood: "grateful",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location: "Somewhere in the world",
  },
  {
    id: "2",
    content:
      "Feeling a bit overwhelmed with work lately, but trying to stay positive. Sometimes it's okay to not be okay.",
    mood: "contemplative",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    location: "A quiet corner",
  },
]

export function getAllEntries(): DiaryEntry[] {
  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function addEntry(entry: Omit<DiaryEntry, "id" | "timestamp">): DiaryEntry {
  const newEntry: DiaryEntry = {
    ...entry,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
  }
  entries.unshift(newEntry)
  return newEntry
}

export function getUserEntries(): DiaryEntry[] {
  return entries
    .filter((entry) => entry.location !== "Anonymous location")
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
