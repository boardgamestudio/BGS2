// Fetch and analyze the BGS profile fields CSV
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BGS%20Fields%20Master%20Profile-vH1ppyNsgDdR5AZ8M6IS4hpBiNh8Nx.csv"

async function analyzeBGSFields() {
  try {
    console.log("[v0] Fetching BGS profile fields CSV...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("[v0] CSV content received, parsing...")

    // Parse CSV manually (simple approach)
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("[v0] Headers found:", headers)

    const fields = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        // Handle CSV parsing with potential commas in quoted fields
        const values = []
        let current = ""
        let inQuotes = false

        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }
        values.push(current.trim()) // Add the last value

        if (values.length >= headers.length) {
          const field = {}
          headers.forEach((header, index) => {
            field[header] = values[index] || ""
          })
          fields.push(field)
        }
      }
    }

    console.log("[v0] Total fields parsed:", fields.length)

    // Analyze field types
    const fieldTypes = [...new Set(fields.map((f) => f["Field Type"]))]
    console.log("[v0] Field types found:", fieldTypes)

    // Analyze user types
    const userTypes = [
      ...new Set(
        fields.flatMap((f) =>
          f["Available to Usertypes"] ? f["Available to Usertypes"].split(",").map((t) => t.trim()) : [],
        ),
      ),
    ]
    console.log("[v0] User types found:", userTypes)

    // Group fields by user type
    const fieldsByUserType = {}
    userTypes.forEach((userType) => {
      fieldsByUserType[userType] = fields.filter(
        (f) => f["Available to Usertypes"] && f["Available to Usertypes"].includes(userType),
      )
    })

    console.log("[v0] Fields by user type:")
    Object.entries(fieldsByUserType).forEach(([userType, userFields]) => {
      console.log(`[v0] ${userType}: ${userFields.length} fields`)
      userFields.forEach((field) => {
        console.log(`[v0]   - ${field["Field Name"]} (${field["Field Type"]}) - Required: ${field["Required"]}`)
      })
    })

    // Analyze required vs optional fields
    const requiredFields = fields.filter((f) => f["Required"] === "Yes")
    const optionalFields = fields.filter((f) => f["Required"] === "No")

    console.log("[v0] Required fields:", requiredFields.length)
    console.log("[v0] Optional fields:", optionalFields.length)

    // Show some example fields
    console.log("[v0] Sample fields:")
    fields.slice(0, 5).forEach((field) => {
      console.log("[v0] Field:", JSON.stringify(field, null, 2))
    })

    return {
      fields,
      fieldTypes,
      userTypes,
      fieldsByUserType,
      requiredFields,
      optionalFields,
    }
  } catch (error) {
    console.error("[v0] Error analyzing BGS fields:", error)
    return null
  }
}

// Run the analysis
analyzeBGSFields().then((result) => {
  if (result) {
    console.log("[v0] Analysis complete!")
    console.log("[v0] Summary:")
    console.log(`[v0] - Total fields: ${result.fields.length}`)
    console.log(`[v0] - User types: ${result.userTypes.join(", ")}`)
    console.log(`[v0] - Field types: ${result.fieldTypes.join(", ")}`)
  }
})
