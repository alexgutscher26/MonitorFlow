"use client"

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HTTPException } from "hono/http-exception"
import { PropsWithChildren, useState } from "react"

/**
 * Wrapper component that provides a React Query client with error handling.
 * 
 * - Initializes a `QueryClient` with a custom `QueryCache` to handle errors globally.
 * - Catches and logs errors from queries, distinguishing between `HTTPException` and generic errors.
 *
 * @param {PropsWithChildren} props - Component props containing children.
 * @returns A provider wrapping `children` with `QueryClientProvider`.
 */
export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          /**
           * Global error handler for React Query.
           *
           * @param err - The error object caught by the query.
           */
          onError: (err) => {
            let errorMessage: string

            if (err instanceof HTTPException) {
              errorMessage = `HTTP Error: ${err.message}`
            } else if (err instanceof Error) {
              errorMessage = `Error: ${err.message}`
            } else {
              errorMessage = "An unknown error occurred."
            }

            // Log error or replace with toast notification as needed
            console.log(errorMessage)
          },
        }),
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
