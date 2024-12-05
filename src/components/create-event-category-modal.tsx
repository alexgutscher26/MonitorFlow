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
    .regex(/^#[0-9A-F]{6}$/i, "Please select a valid color."),
  emoji: z.string().emoji("Please select a valid emoji.").optional(),
})

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

const COLOR_OPTIONS = [
  { color: "#FF6B6B", label: "Bright Red" },
  { color: "#4ECDC4", label: "Teal" },
  { color: "#45B7D1", label: "Sky Blue" },
  { color: "#FFA07A", label: "Light Salmon" },
  { color: "#98D8C8", label: "Seafoam Green" },
  { color: "#FDCB6E", label: "Mustard Yellow" },
  { color: "#6C5CE7", label: "Soft Purple" },
  { color: "#FF85A2", label: "Pink" },
  { color: "#2ECC71", label: "Emerald Green" },
  { color: "#E17055", label: "Terracotta" },
] as const

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

interface CreateEventCategoryModalProps {
  containerClassName?: string
  children: React.ReactNode
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const CreateEventCategoryModal = ({
  children,
  containerClassName,
  onSuccess,
  onError,
}: CreateEventCategoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createEventCategory, isPending } = useMutation({
    mutationFn: async (data: EventCategoryForm) => {
      await client.category.createEventCategory.$post(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-categories"] })
      setIsOpen(false)
      onSuccess?.()
    },
    onError: (error: Error) => {
      onError?.(error)
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
    defaultValues: {
      name: "",
      color: COLOR_OPTIONS[0].color,
      emoji: EMOJI_OPTIONS[0].emoji,
    },
  })

  const color = watch("color")
  const selectedEmoji = watch("emoji")

  const onSubmit = (data: EventCategoryForm) => {
    createEventCategory(data)
  }

  const handleClose = () => {
    setIsOpen(false)
    reset()
  }

  return (
    <>
      <div
        className={cn("cursor-pointer", containerClassName)}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
      >
        {children}
      </div>

      <Modal
        className="max-w-xl p-8"
        showModal={isOpen}
        setShowModal={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              New Event Category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Create a new category to organize your events.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                autoFocus
                id="name"
                {...register("name")}
                placeholder="e.g. user-signup"
                className={cn(
                  "w-full",
                  errors.name && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Color *</Label>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map(({ color: premadeColor, label }) => (
                  <button
                    key={premadeColor}
                    type="button"
                    className={cn(
                      "size-10 rounded-full ring-2 ring-offset-2 transition-all",
                      "hover:scale-105 focus-visible:outline-none focus-visible:ring-brand-700",
                      color === premadeColor
                        ? "ring-brand-700 scale-110"
                        : "ring-transparent"
                    )}
                    style={{ backgroundColor: premadeColor }}
                    onClick={() =>
                      setValue("color", premadeColor, { shouldDirty: true })
                    }
                    title={label}
                    aria-label={`Select ${label} color`}
                    aria-pressed={color === premadeColor}
                  />
                ))}
              </div>
              {errors.color && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.color.message}
                </p>
              )}
            </div>

            <div>
              <Label>Emoji (Optional)</Label>
              <div className="flex flex-wrap gap-3">
                {EMOJI_OPTIONS.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    type="button"
                    className={cn(
                      "size-10 flex items-center justify-center text-xl rounded-md transition-all",
                      "hover:bg-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700",
                      selectedEmoji === emoji
                        ? "bg-brand-100 ring-2 ring-brand-700 scale-110"
                        : "bg-brand-100"
                    )}
                    onClick={() =>
                      setValue("emoji", emoji, { shouldDirty: true })
                    }
                    title={label}
                    aria-label={`Select ${label} emoji`}
                    aria-pressed={selectedEmoji === emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {errors.emoji && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emoji.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending || !isDirty}
              type="submit"
              aria-busy={isPending}
            >
              {isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
