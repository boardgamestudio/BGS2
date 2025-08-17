// Clear all localStorage data to start fresh
console.log("[v0] Clearing all localStorage data...")

// Clear all BGS-related localStorage keys
const keysToRemove = [
  "bgs_current_user",
  "bgs_users",
  "bgs_projects",
  "bgs_jobs",
  "bgs_events",
  "bgs_groups",
  "bgs_resources",
]

keysToRemove.forEach((key) => {
  localStorage.removeItem(key)
  console.log(`[v0] Cleared ${key}`)
})

console.log("[v0] All localStorage data cleared. Ready for fresh start!")
