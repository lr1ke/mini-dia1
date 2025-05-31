"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, ArrowLeft, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { DiaryEntry } from "@/lib/diary-store"

const moodEmojis: Record<string, string> = {
  happy: "😊",
  grateful: "🙏",
  contemplative: "🤔",
  peaceful: "😌",
  excited: "🎉",
  melancholy: "😔",
}

const moodColors: Record<string, string> = {
  happy: "bg-yellow-100 text-yellow-800",
  grateful: "bg-green-100 text-green-800",
  contemplative: "bg-blue-100 text-blue-800",
  peaceful: "bg-purple-100 text-purple-800",
  excited: "bg-orange-100 text-orange-800",
  melancholy: "bg-gray-100 text-gray-800",
}

const allMoods = [
  { value: "all", label: "All Moods", emoji: "🌈", color: "bg-gray-100 text-gray-800" },
  { value: "happy", label: "Happy", emoji: "😊", color: "bg-yellow-100 text-yellow-800" },
  { value: "grateful", label: "Grateful", emoji: "🙏", color: "bg-green-100 text-green-800" },
  { value: "contemplative", label: "Contemplative", emoji: "🤔", color: "bg-blue-100 text-blue-800" },
  { value: "peaceful", label: "Peaceful", emoji: "😌", color: "bg-purple-100 text-purple-800" },
  { value: "excited", label: "Excited", emoji: "🎉", color: "bg-orange-100 text-orange-800" },
  { value: "melancholy", label: "Melancholy", emoji: "😔", color: "bg-gray-100 text-gray-800" },
]

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return new Date(date).toLocaleDateString()
}

export default function PublicPage() {
  const [selectedMood, setSelectedMood] = useState("all")
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/entries")
        if (response.ok) {
          const data = await response.json()
          setEntries(data)
        }
      } catch (error) {
        console.error("Failed to fetch entries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [])

  const filteredEntries = selectedMood === "all" ? entries : entries.filter((entry) => entry.mood === selectedMood)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Write
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Anonymous Diaries</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Shared Stories</h2>
          <p className="text-gray-600 dark:text-gray-400">Real thoughts and feelings from people around the world</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Mood Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {allMoods.map((mood) => {
                  const count =
                    mood.value === "all" ? entries.length : entries.filter((entry) => entry.mood === mood.value).length
                  const isEmpty = count === 0

                  return (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      disabled={isEmpty && mood.value !== "all"}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                        selectedMood === mood.value
                          ? `${mood.color} border-2 border-current`
                          : isEmpty && mood.value !== "all"
                            ? "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                            : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {mood.emoji} {mood.label} ({count})
                    </button>
                  )
                })}
              </div>
              {selectedMood !== "all" && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Showing {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"} with{" "}
                  {allMoods.find((m) => m.value === selectedMood)?.emoji} {selectedMood} mood
                </p>
              )}
            </div>

            <div className="space-y-4">
              {entries.length === 0 && selectedMood === "all" ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No entries yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Be the first to share your thoughts with the world
                    </p>
                    <Link href="/">
                      <Button>Write First Entry</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : filteredEntries.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-4xl mb-4">{allMoods.find((m) => m.value === selectedMood)?.emoji}</div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No {selectedMood} entries yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Be the first to share a {selectedMood} entry
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Link href="/">
                        <Button>Write Entry</Button>
                      </Link>
                      <Button variant="outline" onClick={() => setSelectedMood("all")}>
                        Show All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredEntries.map((entry) => (
                  <Card key={entry.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${moodColors[entry.mood] || "bg-gray-100 text-gray-800"}`}
                          >
                            {moodEmojis[entry.mood]} {entry.mood}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(entry.timestamp)}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>
                      </div>

                      {/* Footer */}
                      {entry.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <MapPin className="w-3 h-3" />
                          {entry.location}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {entries.length > 0 && (
              <div className="text-center mt-8">
                <Link href="/">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Share Your Story</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
