"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PropsWithChildren, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator"
import { Modal } from "./ui/modal"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { cn } from "@/utils"
import { Button } from "./ui/button"
import { client } from "@/lib/client"

const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z
    .string()
    .min(1, "Color is required")
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
  emoji: z.string().emoji("Invalid emoji").optional(),
})

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

const COLOR_OPTIONS = [
  "#FF6B6B", // bg-[#FF6B6B] ring-[#FF6B6B] Bright Red
  "#4ECDC4", // bg-[#4ECDC4] ring-[#4ECDC4] Teal
  "#45B7D1", // bg-[#45B7D1] ring-[#45B7D1] Sky Blue
  "#FFA07A", // bg-[#FFA07A] ring-[#FFA07A] Light Salmon
  "#98D8C8", // bg-[#98D8C8] ring-[#98D8C8] Seafoam Green
  "#FDCB6E", // bg-[#FDCB6E] ring-[#FDCB6E] Mustard Yellow
  "#6C5CE7", // bg-[#6C5CE7] ring-[#6C5CE7] Soft Purple
  "#FF85A2", // bg-[#FF85A2] ring-[#FF85A2] Pink
  "#2ECC71", // bg-[#2ECC71] ring-[#2ECC71] Emerald Green
  "#E17055", // bg-[#E17055] ring-[#E17055] Terracotta
]

const EMOJI_OPTIONS = [
  { emoji: "💰", label: "Money (Sale)" },
  { emoji: "👤", label: "User (Sign-up)" },
  { emoji: "🎉", label: "Celebration" },
  { emoji: "📅", label: "Calendar" },
  { emoji: "🚀", label: "Launch" },
  { emoji: "📢", label: "Announcement" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "🏆", label: "Achievement" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🔔", label: "Notification" },
]

interface CreateEventCategoryModel extends PropsWithChildren {
  containerClassName?: string
}

export const CreateEventCategoryModal = ({
  children,
  containerClassName,
}: CreateEventCategoryModel) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createEventCategory, isPending } = useMutation({
    mutationFn: async (data: EventCategoryForm) => {
      await client.category.createEventCategory.$post(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-categories"] })
      setIsOpen(false)
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
  })

  const color = watch("color")
  const selectedEmoji = watch("emoji")

  const onSubmit = (data: EventCategoryForm) => {
    createEventCategory(data)
  }

  return (
    <>
      <div className={containerClassName} onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Modal
        className="max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden"
        showModal={isOpen}
        setShowModal={setIsOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="relative px-6 py-4 bg-gradient-to-br from-brand-50/80 via-white to-gray-50">
            <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:16px]" />
            <div className="relative">
              <h2 className="text-xl font-semibold text-gray-800">
                New Category
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Create a category to organize your events
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Name Input */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <div className="relative">
                <Input
                  autoFocus
                  id="name"
                  {...register("name")}
                  placeholder="e.g. user-signup"
                  className="w-full px-4 py-2 bg-white border border-gray-200 
                           rounded-lg shadow-sm transition duration-200
                           placeholder:text-gray-400
                           focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {errors.name && (
                  <div className="absolute right-0 top-0 h-full pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="text-sm text-red-500 animate-fadeIn">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_OPTIONS.map((premadeColor) => (
                  <button
                    key={premadeColor}
                    type="button"
                    className={cn(
                      "aspect-square rounded-lg transition-all duration-200",
                      "hover:shadow-lg hover:scale-105",
                      color === premadeColor &&
                        "ring-2 ring-brand-500 ring-offset-2 scale-105"
                    )}
                    style={{ backgroundColor: premadeColor }}
                    onClick={() => setValue("color", premadeColor)}
                  />
                ))}
              </div>
            </div>

            {/* Emoji Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Icon</Label>
              <div className="grid grid-cols-5 gap-2">
                {EMOJI_OPTIONS.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    type="button"
                    title={label}
                    className={cn(
                      "group relative aspect-square flex items-center justify-center",
                      "text-xl rounded-lg transition-all duration-200",
                      "hover:bg-gray-50",
                      selectedEmoji === emoji
                        ? "bg-brand-50 ring-2 ring-brand-500"
                        : "bg-gray-100/50"
                    )}
                    onClick={() => setValue("emoji", emoji)}
                  >
                    <span className="transform transition-transform group-hover:scale-110">
                      {emoji}
                    </span>
                    <span
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                                   px-2 py-1 bg-gray-900 text-white text-xs rounded
                                   opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className={cn(
                "bg-brand-500 text-white",
                "hover:bg-brand-600 active:bg-brand-700",
                "shadow-sm hover:shadow",
                "transition duration-200",
                "disabled:opacity-50"
              )}
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
