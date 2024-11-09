import { useEffect, useState } from "react"

/**
 * Custom hook to determine the current device type (mobile, tablet, or desktop)
 * and retrieve the window dimensions.
 *
 * @returns An object with `device` type, `width`, `height`, and boolean flags for device types.
 */
export const useMediaQuery = () => {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop" | null>(
    null
  )

  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    /**
     * Determines the current device type based on window width
     * and updates the `device` and `dimensions` state.
     */
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      if (window.matchMedia("(max-width: 640px)").matches) {
        setDevice("mobile")
      } else if (
        window.matchMedia("(min-width: 641px) and (max-width: 1024px)").matches
      ) {
        setDevice("tablet")
      } else {
        setDevice("desktop")
      }

      setDimensions({ width, height })
    }

    checkDevice()

    window.addEventListener("resize", checkDevice)

    return () => {
      window.removeEventListener("resize", checkDevice)
    }
  }, [])

  return {
    /** The current device type: "mobile", "tablet", "desktop", or null if undetermined */
    device,
    /** The current window width */
    width: dimensions?.width,
    /** The current window height */
    height: dimensions?.height,
    /** Boolean flag for mobile device */
    isMobile: device === "mobile",
    /** Boolean flag for tablet device */
    isTablet: device === "tablet",
    /** Boolean flag for desktop device */
    isDesktop: device === "desktop",
  }
}
