"use server"

import { addEntry } from "@/lib/diary-store"

export async function submitDiaryEntry(formData: FormData) {
  const content = formData.get("content") as string
  const mood = formData.get("mood") as string
  const location = formData.get("location") as string

  if (!content || content.trim().length === 0) {
    return { error: "Please write something in your diary entry" }
  }

  if (content.length > 1000) {
    return { error: "Diary entry is too long. Please keep it under 1000 characters." }
  }

  try {
    const newEntry = addEntry({
      content: content.trim(),
      mood,
      location: location || "Anonymous location",
    })

    // Return the entry ID so the client can track it
    return { success: true, entryId: newEntry.id }
  } catch (error) {
    return { error: "Failed to save diary entry. Please try again." }
  }
}
