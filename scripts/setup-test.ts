import { db } from "./src/db"

async function setupTestUser() {
  // Create a test user
  const user = await db.user.create({
    data: {
      email: "test@example.com",
      quotaLimit: 1000,
      plan: "PRO",
      role: "USER",
    },
  })

  // Create a test category
  const category = await db.eventCategory.create({
    data: {
      name: "sale",
      color: 0x00ff00, // Green
      emoji: "💰",
      userId: user.id,
    },
  })

  console.log("Test user created with API key:", user.apiKey)
  console.log("Test category created:", category.name)
}

setupTestUser().catch(console.error)
