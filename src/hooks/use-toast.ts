"use client"

import * as React from "react"
import { z } from "zod"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Configurable constants
const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000
const TOAST_MIN_DELAY = 1000

// Toast schema for runtime validation
const toastSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  variant: z.enum(["default", "destructive", "success", "warning"]).optional(),
  duration: z.number().min(TOAST_MIN_DELAY).optional(),
  action: z.any().optional(),
})

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number
  createdAt: number
  pausedAt?: number
  variant?: "default" | "destructive" | "success" | "warning"
}

type ToastOptions = Partial<Pick<ToasterToast, "duration" | "variant">>

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
  PAUSE_TOAST: "PAUSE_TOAST",
  RESUME_TOAST: "RESUME_TOAST",
} as const

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["PAUSE_TOAST"]
      toastId: ToasterToast["id"]
      pausedAt: number
    }
  | {
      type: ActionType["RESUME_TOAST"]
      toastId: ToasterToast["id"]
      resumedAt: number
    }

interface State {
  toasts: ToasterToast[]
}

// Use WeakMap to allow garbage collection of timeouts
const toastTimeouts = new WeakMap<ToasterToast, ReturnType<typeof setTimeout>>()

let count = 0

function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return `toast-${count}-${Date.now()}`
}

function clearToastTimeout(toast: ToasterToast) {
  const timeout = toastTimeouts.get(toast)
  if (timeout) {
    clearTimeout(timeout)
    toastTimeouts.delete(toast)
  }
}

function addToRemoveQueue(toast: ToasterToast) {
  if (toastTimeouts.has(toast)) {
    return
  }

  const duration = toast.duration || TOAST_REMOVE_DELAY
  const remainingTime = toast.pausedAt
    ? Math.max(0, duration - (toast.pausedAt - toast.createdAt))
    : duration

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toast)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toast.id,
    })
  }, remainingTime)

  toastTimeouts.set(toast, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action
      const toastsToRemove = toastId
        ? state.toasts.filter((t) => t.id === toastId)
        : state.toasts

      toastsToRemove.forEach(addToRemoveQueue)

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        state.toasts.forEach(clearToastTimeout)
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => {
          if (t.id === action.toastId) {
            clearToastTimeout(t)
            return false
          }
          return true
        }),
      }

    case "PAUSE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => {
          if (t.id === action.toastId) {
            clearToastTimeout(t)
            return { ...t, pausedAt: action.pausedAt }
          }
          return t
        }),
      }

    case "RESUME_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => {
          if (t.id === action.toastId) {
            const toast = { ...t, pausedAt: undefined }
            addToRemoveQueue(toast)
            return toast
          }
          return t
        }),
      }
  }
}

const listeners = new Set<(state: State) => void>()
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id" | "createdAt" | "pausedAt">

function toast(props: Toast, options?: ToastOptions) {
  try {
    // Validate toast props at runtime
    toastSchema.parse(props)

    const id = genId()
    const createdAt = Date.now()
    const duration = options?.duration || props.duration || TOAST_REMOVE_DELAY

    const update = (props: Partial<Toast>) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      })

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    const pause = () =>
      dispatch({
        type: "PAUSE_TOAST",
        toastId: id,
        pausedAt: Date.now(),
      })

    const resume = () =>
      dispatch({
        type: "RESUME_TOAST",
        toastId: id,
        resumedAt: Date.now(),
      })

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        ...options,
        id,
        duration,
        createdAt,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss()
        },
        onMouseEnter: pause,
        onMouseLeave: resume,
      },
    })

    return {
      id,
      dismiss,
      update,
      pause,
      resume,
    }
  } catch (error) {
    console.error("Invalid toast props:", error)
    throw error
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  const utils = React.useMemo(
    () => ({
      toast,
      dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
      dismissAll: () => dispatch({ type: "DISMISS_TOAST" }),
    }),
    []
  )

  return {
    ...state,
    ...utils,
  }
}

export { useToast, toast }
