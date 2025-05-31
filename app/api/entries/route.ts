import { NextResponse } from "next/server"
import { getAllEntries, addEntry } from "@/lib/diary-store"

export async function GET() {
  const entries = getAllEntries()
  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  const data = await request.json()

  if (!data.content || data.content.trim().length === 0) {
    return NextResponse.json({ error: "Please write something in the diary" }, { status: 400 })
  }

  if (data.content.length > 1000) {
    return NextResponse.json(
      { error: "Diary entry is too long. Please keep it under 1000 characters." },
      { status: 400 },
    )
  }

  try {
    const newEntry = addEntry({
      content: data.content.trim(),
      mood: data.mood,
      location: data.location || "Anonymous location",
    })

    return NextResponse.json({ success: true, entry: newEntry })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save diary entry. Please try again." }, { status: 500 })
  }
}
