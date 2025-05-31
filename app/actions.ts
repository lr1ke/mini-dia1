"use server"

import { addEntry, initializeDatabase } from "@/lib/database"

// Initialize database on first use
let isInitialized = false

async function ensureInitialized() {
  if (!isInitialized) {
    console.log("Server Action - Initializing database...")
    await initializeDatabase()
    isInitialized = true
    console.log("Server Action - Database initialized")
  }
}

export async function submitDiaryEntry(formData: FormData) {
  const content = formData.get("content") as string
  const mood = formData.get("mood") as string
  const location = formData.get("location") as string

  console.log("Server Action - Received data:", { content, mood, location })

  if (!content || content.trim().length === 0) {
    console.log("Server Action - Error: No content")
    return { error: "Please write something in your diary entry" }
  }

  if (content.length > 1000) {
    console.log("Server Action - Error: Content too long")
    return { error: "Diary entry is too long. Please keep it under 1000 characters." }
  }

  try {
    await ensureInitialized()

    console.log("Server Action - Adding entry to database...")
    const newEntry = await addEntry({
      content: content.trim(),
      mood,
      location: location || "Anonymous location",
    })

    console.log("Server Action - Entry added successfully:", newEntry)
    return { success: true, entryId: newEntry.id }
  } catch (error) {
    console.error("Server Action - Error:", error)
    return { error: "Failed to save diary entry. Please try again." }
  }
}
