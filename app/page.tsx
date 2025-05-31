"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Heart, Globe, MapPin, User } from "lucide-react"
import { submitDiaryEntry } from "./actions"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js'


const moods = [
  { value: "happy", label: "😊 Happy", color: "bg-yellow-100 text-yellow-800" },
  { value: "grateful", label: "🙏 Grateful", color: "bg-green-100 text-green-800" },
  { value: "contemplative", label: "🤔 Contemplative", color: "bg-blue-100 text-blue-800" },
  { value: "peaceful", label: "😌 Peaceful", color: "bg-purple-100 text-purple-800" },
  { value: "excited", label: "🎉 Excited", color: "bg-orange-100 text-orange-800" },
  { value: "melancholy", label: "😔 Melancholy", color: "bg-gray-100 text-gray-800" },
]

export default function DiaryPage() {
  const [selectedMood, setSelectedMood] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)



const verifyPayload: VerifyCommandInput = {
	action: 'chat', // This is your action ID from the Developer Portal
	verification_level: VerificationLevel.Device, // Orb | Device
}

const handleVerify = async () => {
	if (!MiniKit.isInstalled()) {
		return
	}
	// World App will open a drawer prompting the user to confirm the operation, promise is resolved once user confirms or cancels
	const {finalPayload} = await MiniKit.commandsAsync.verify(verifyPayload)
		if (finalPayload.status === 'error') {
			return console.log('Error payload', finalPayload)
		}

		// Verify the proof in the backend
		const verifyResponse = await fetch('/api/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			payload: finalPayload as ISuccessResult, // Parses only the fields we need to verify
			action: 'chat',
		}),
	})

	// TODO: Handle Success!
	const verifyResponseJson = await verifyResponse.json()
	if (verifyResponseJson.status === 200) {
		console.log('Verification success!')
    setIsVerified(true)
	}
}


  // const handleSubmit = async (formData: FormData) => {
  //   if (!isVerified) {
  //     console.log("User is not verified, initiating verification process")
  //     handleVerify();
  //     return
  //   }
  //   setIsSubmitting(true)
  //   await submitDiaryEntry(formData)
  //   setIsSubmitting(false)
  //   router.push("/public")
  // }

  const handleSubmit = async (formData: FormData) => {
    // if (!isVerified) {
    //   console.log("User is not verified, initiating verification process")
    //   handleVerify()
    //   return
    // }

    setIsSubmitting(true)

    try {
      const result = await submitDiaryEntry(formData)

      if (result?.success) {
        // Clear form
        setContent("")
        setSelectedMood("")
        setLocation("")

        // Redirect to public page
        router.push("/public")
      }
    } catch (error) {
      console.error("Failed to submit entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }


  const characterCount = content.length
  const maxCharacters = 1000

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">World Log</h1>
            </div>
            <div className="flex gap-2">
              {/* <Link href="/me">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Me
                </Button>
              </Link> */}
              <Link href="/public">
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  Public
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Heart className="w-5 h-5" />
              Write Your Heart Out
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Share your thoughts anonymously with the world</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form action={handleSubmit} className="space-y-6">
              {/* Mood Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">How are you feeling?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {moods.map((mood) => (
                    <label key={mood.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="mood"
                        value={mood.value}
                        checked={selectedMood === mood.value}
                        onChange={(e) => setSelectedMood(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                          selectedMood === mood.value
                            ? `${mood.color} border-current`
                            : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        {mood.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Where are you? (optional)
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="A cozy café, my bedroom, the park..."
                  className="w-full"
                />
              </div>

              {/* Diary Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  What's on your mind?
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear diary... Today I felt..."
                  className="min-h-[200px] resize-none"
                  maxLength={maxCharacters}
                  required
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Share your thoughts, feelings, or experiences</span>
                  <span className={characterCount > maxCharacters * 0.9 ? "text-orange-500" : ""}>
                    {characterCount}/{maxCharacters}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                disabled={isSubmitting || !content.trim() || !selectedMood}
              >
              {isSubmitting ? "Sharing anonymously..." : !isVerified ? 
              "Verify & Share" : "Share Anonymously"}
                {/* {isSubmitting ? "Sharing anonymously..." : "Share Anonymously"} */}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-indigo-900 dark:text-indigo-100 mb-1">Anonymous & Safe</p>
                <p className="text-indigo-700 dark:text-indigo-300">
                  Your entries are shared without any personal information. You can view your own entries on the "Me"
                  page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
