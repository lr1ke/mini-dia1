export function getUserId(): string {
  if (typeof window === "undefined") return ""

  let userId = localStorage.getItem("diary-user-id")
  if (!userId) {
    // Generate a simple user ID for this session/device
    userId = "user_" + Math.random().toString(36).substr(2, 9)
    localStorage.setItem("diary-user-id", userId)
  }
  return userId
}

export function getUserEntryIds(): string[] {
  if (typeof window === "undefined") return []

  const entryIds = localStorage.getItem("diary-user-entries")
  return entryIds ? JSON.parse(entryIds) : []
}

export function addUserEntryId(entryId: string): void {
  if (typeof window === "undefined") return

  const currentIds = getUserEntryIds()
  if (!currentIds.includes(entryId)) {
    currentIds.push(entryId)
    localStorage.setItem("diary-user-entries", JSON.stringify(currentIds))
  }
}

export function removeUserEntryId(entryId: string): void {
  if (typeof window === "undefined") return

  const currentIds = getUserEntryIds()
  const filteredIds = currentIds.filter((id) => id !== entryId)
  localStorage.setItem("diary-user-entries", JSON.stringify(filteredIds))
}

export function clearUserData(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("diary-user-id")
  localStorage.removeItem("diary-user-entries")
}
