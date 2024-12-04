export interface Event {
  fields: Record<string, any>
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  userId: string
  categoryId: string
  status: string
  responseTime?: number | null
  duration?: number | null
  error?: string | null
}

export interface EventCategory {
  id: string
  name: string
  userId: string
  createdAt: Date
  updatedAt: Date
}
