// Script to analyze BGS Project Fields CSV
async function analyzeProjectFields() {
  try {
    console.log("[v0] Fetching BGS Project Fields CSV...")
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BGS%20Fields%20Master%20-%20Project%20Fields-MLshULh9JhAMnuJ52eYrxG9A74wPbj.csv",
    )
    const csvText = await response.text()

    console.log("[v0] Parsing CSV data...")
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const fields = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const field = {}
        headers.forEach((header, index) => {
          field[header] = values[index] || ""
        })
        fields.push(field)
      }
    }

    console.log("[v0] Project Fields Analysis:")
    console.log(`Total fields: ${fields.length}`)

    // Group by field types
    const fieldTypes = {}
    const userTypeFields = {}

    fields.forEach((field) => {
      const type = field["Field Type"] || "Unknown"
      const userTypes = field["Available to Usertypes"] || "All"

      if (!fieldTypes[type]) fieldTypes[type] = []
      fieldTypes[type].push(field["Field Name"])

      if (!userTypeFields[userTypes]) userTypeFields[userTypes] = []
      userTypeFields[userTypes].push(field["Field Name"])
    })

    console.log("[v0] Field Types:")
    Object.entries(fieldTypes).forEach(([type, fieldNames]) => {
      console.log(`  ${type}: ${fieldNames.length} fields`)
      console.log(`    ${fieldNames.slice(0, 3).join(", ")}${fieldNames.length > 3 ? "..." : ""}`)
    })

    console.log("[v0] User Type Availability:")
    Object.entries(userTypeFields).forEach(([userType, fieldNames]) => {
      console.log(`  ${userType}: ${fieldNames.length} fields`)
    })

    // Key fields for project structure
    const requiredFields = fields.filter((f) => f.Required === "Yes")
    console.log(`[v0] Required fields: ${requiredFields.length}`)
    requiredFields.forEach((f) => console.log(`  - ${f["Field Name"]} (${f["Field Type"]})`))

    return fields
  } catch (error) {
    console.error("[v0] Error analyzing project fields:", error)
    return []
  }
}

analyzeProjectFields()
