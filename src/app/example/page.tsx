"use client"

import { PercentageRollout } from "@/components/feature-flags/PercentageRollout"

export default function ExamplePage() {
  return (
    <div>
      <h1>Example Page</h1>

      <PercentageRollout
        flagKey="new-ui-redesign"
        environment="production"
        fallback={<OldDesign />}
      >
        <NewDesign />
      </PercentageRollout>
    </div>
  )
}

function NewDesign() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white">New Modern Design 🎉</h2>
      <p className="text-white mt-2">
        You're seeing the new design because you're part of the rollout group!
      </p>
    </div>
  )
}

function OldDesign() {
  return (
    <div className="border p-6 rounded">
      <h2 className="text-xl font-semibold">Current Design</h2>
      <p className="text-gray-600 mt-2">
        You'll get access to the new design soon!
      </p>
    </div>
  )
}
