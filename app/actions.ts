"use server"

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
    // Send the data to our API endpoint
    const response = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""}/api/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content.trim(),
        mood,
        location: location || "Anonymous location",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || "Failed to save diary entry" }
    }

    return { success: true, entryId: data.entry.id }
  } catch (error) {
    return { error: "Failed to save diary entry. Please try again." }
  }
}
