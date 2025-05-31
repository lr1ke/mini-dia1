import { NextResponse } from "next/server"
import { getAllEntries, initializeDatabase } from "@/lib/database"

// Initialize database on first request
let isInitialized = false

async function ensureInitialized() {
  if (!isInitialized) {
    console.log("API - Initializing database...")
    await initializeDatabase()
    isInitialized = true
    console.log("API - Database initialized")
  }
}

export async function GET() {
  try {
    console.log("API GET - Starting...")
    await ensureInitialized()

    console.log("API GET - Fetching entries...")
    const entries = await getAllEntries()
    console.log("API GET - Found entries:", entries.length)

    return NextResponse.json(entries)
  } catch (error) {
    console.error("API GET - Error:", error)
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  }
}

// We can remove the POST handler since we're using server actions directly
