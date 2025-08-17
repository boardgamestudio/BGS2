const projects = JSON.parse(localStorage.getItem("bgs_projects") || "[]")
const users = JSON.parse(localStorage.getItem("bgs_users") || "[]")

console.log("[v0] Current projects:", projects.length)
console.log("[v0] Current users:", users.length)

let fixedCount = 0

// Fix projects with missing or invalid creator associations
projects.forEach((project, index) => {
  let needsUpdate = false

  // Check if project has a valid creator
  if (!project.creatorId || !users.find((user) => user.id === project.creatorId)) {
    console.log(`[v0] Project "${project.title}" has invalid creator ID: ${project.creatorId}`)

    // Try to find a user to assign it to (first available user)
    const firstUser = users[0]
    if (firstUser) {
      project.creatorId = firstUser.id
      project.creatorName = firstUser.displayName
      project.creatorUsername = firstUser.username || firstUser.id
      needsUpdate = true
      fixedCount++
      console.log(`[v0] Assigned project "${project.title}" to user "${firstUser.displayName}"`)
    } else {
      console.log(`[v0] No users available to assign project "${project.title}" to`)
    }
  }

  // Ensure creator name and username are consistent with the user data
  if (project.creatorId) {
    const creator = users.find((user) => user.id === project.creatorId)
    if (creator) {
      if (project.creatorName !== creator.displayName) {
        project.creatorName = creator.displayName
        needsUpdate = true
      }
      if (project.creatorUsername !== (creator.username || creator.id)) {
        project.creatorUsername = creator.username || creator.id
        needsUpdate = true
      }
    }
  }
})

if (fixedCount > 0) {
  localStorage.setItem("bgs_projects", JSON.stringify(projects))
  console.log(`[v0] Fixed ${fixedCount} project(s) and saved to localStorage`)
} else {
  console.log("[v0] No project data issues found")
}
