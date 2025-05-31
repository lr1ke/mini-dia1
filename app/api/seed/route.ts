import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Check if we already have entries
    const { rows } = await sql`SELECT COUNT(*) FROM diary_entries`
    const count = Number.parseInt(rows[0].count)

    if (count > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${count} entries`,
      })
    }

    // Add sample entries
    await sql`
      INSERT INTO diary_entries (content, mood, location, timestamp)
      VALUES 
      (
        'Today was absolutely incredible! I finally got the job offer I''ve been hoping for after three rounds of interviews.',
        'excited',
        'My apartment balcony',
        NOW() - INTERVAL '2 hours'
      ),
      (
        'Spent the morning at the beach watching the sunrise. The colors reflecting off the water were breathtaking.',
        'peaceful',
        'Oceanside Beach',
        NOW() - INTERVAL '1 day'
      ),
      (
        'I''ve been thinking a lot about the conversation I had with my old friend yesterday.',
        'contemplative',
        'A quiet café downtown',
        NOW() - INTERVAL '2 days'
      ),
      (
        'Feeling pretty low today. The project I poured my heart into for weeks wasn''t well-received.',
        'melancholy',
        'Home office',
        NOW() - INTERVAL '3 days'
      ),
      (
        'My sister surprised me with a visit today! She brought homemade cookies and we spent hours catching up.',
        'grateful',
        'Living room couch',
        NOW() - INTERVAL '4 days'
      )
    `

    return NextResponse.json({
      success: true,
      message: "Sample entries added successfully",
    })
  } catch (error) {
    console.error("Error seeding sample entries:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed sample entries",
      },
      { status: 500 },
    )
  }
}
