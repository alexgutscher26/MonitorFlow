"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PropsWithChildren, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator"
import { Modal } from "./ui/modal"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { cn } from "@/utils"
import { Button } from "./ui/button"
import { client } from "@/lib/client"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip"
import { AlertCircle } from "lucide-react"

const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z
    .string()
    .min(1, "Color is required")
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
  emoji: z.string().emoji("Invalid emoji").optional(),
  tags: z.array(z.string().min(1)).optional().default([]),
})

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

const COLOR_PALETTES = {
  Modern: [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#FDCB6E",
    "#6C5CE7",
    "#FF85A2",
    "#2ECC71",
    "#E17055",
  ],
  Professional: [
    "#2C3E50",
    "#34495E",
    "#7F8C8D",
    "#95A5A6",
    "#BDC3C7",
    "#3498DB",
    "#2980B9",
    "#1ABC9C",
    "#16A085",
    "#27AE60",
  ],
  Vibrant: [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FF8000",
    "#8000FF",
    "#0080FF",
    "#FF0080",
  ],
}

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
  { emoji: "🔥", label: "Trending" },
  { emoji: "❤️", label: "Favorite" },
  { emoji: "⚙️", label: "Settings" },
  { emoji: "🌟", label: "Featured" },
  { emoji: "🎥", label: "Media" },
]

const TAG_OPTIONS = [
  "Bug",
  "Question",
  "Feature Request",
  "New User",
  "Getting Started",
  "Feedback",
  "Troubleshooting",
  "Documentation",
  "Account Setup",
  "Integration Help",
  "API Issue",
  "Payment Inquiry",
  "Usage Tips",
  "Product Update",
  "Dashboard Help",
  "Onboarding",
  "Event Setup",
]

interface CreateEventCategoryModalProps extends PropsWithChildren {
  containerClassName?: string
}

export const CreateEventCategoryModal = ({
  children,
  containerClassName,
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
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    control,
  } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
    defaultValues: {
      tags: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  })

  const color = watch("color")
  const selectedEmoji = watch("emoji")
  const tags = watch("tags") || []

  const onSubmit = (data: EventCategoryForm) => {
    createEventCategory(data)
  }

  return (
    <>
      <div className={containerClassName} onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Modal
        className="bg-white dark:bg-gray-900 w-[1200px] max-w-[90vw]"
        showModal={isOpen}
        setShowModal={setIsOpen}
      >
        <TooltipProvider>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    New Event Category
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Create a category with color, emoji, and tags to organize
                    your events.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isPending ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-6 grid grid-cols-3 gap-8">
              {/* Left Column - Name & Emoji */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category Name</Label>
                  <div>
                    <Input
                      {...register("name")}
                      placeholder="e.g. user-signup"
                      className={cn(
                        "w-full",
                        errors.name && "border-red-500 focus:ring-red-500"
                      )}
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 mt-2 text-red-500">
                        <AlertCircle size={16} />
                        <p className="text-sm">{errors.name.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Emoji</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {EMOJI_OPTIONS.map(({ emoji, label }) => (
                      <Tooltip key={emoji}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={`Select emoji ${label}`}
                            className={cn(
                              "w-10 h-10 flex items-center justify-center text-lg rounded-lg transition-all",
                              selectedEmoji === emoji
                                ? "bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-600 scale-105"
                                : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={() => setValue("emoji", emoji)}
                          >
                            {emoji}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{label}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column - Color Palettes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Choose Color</Label>
                <div className="space-y-6">
                  {Object.entries(COLOR_PALETTES).map(
                    ([paletteName, colors]) => (
                      <div key={paletteName} className="space-y-2">
                        <p className="text-xs font-medium text-gray-500">
                          {paletteName}
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                          {colors.map((hex) => (
                            <Tooltip key={hex}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-label={`Select color ${hex}`}
                                  style={{ backgroundColor: hex }}
                                  className={cn(
                                    "w-10 h-10 rounded-lg transition-transform",
                                    color === hex
                                      ? "ring-2 ring-blue-600 scale-110"
                                      : "ring-1 ring-gray-200 dark:ring-gray-700 hover:scale-105"
                                  )}
                                  onClick={() => setValue("color", hex)}
                                />
                              </TooltipTrigger>
                              <TooltipContent>{hex}</TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Right Column - Tags */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Tags</Label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm transition-colors",
                          tags?.includes(tag)
                            ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => {
                          setValue(
                            "tags",
                            tags?.includes(tag)
                              ? tags.filter((t) => t !== tag)
                              : [...(tags || []), tag]
                          )
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          {...register(`tags.${index}`)}
                          placeholder="Add custom tag"
                          className="w-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          className="px-3"
                          aria-label="Remove tag"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append("")}
                      className="w-full text-blue-600 dark:text-blue-400"
                    >
                      Add Custom Tag
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </TooltipProvider>
      </Modal>
    </>
  )
}

export default CreateEventCategoryModal
