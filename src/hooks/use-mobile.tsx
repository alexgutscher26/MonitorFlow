import * as React from "react"

const MOBILE_BREAKPOINT = 768  // Width threshold to identify mobile screens

/**
 * Custom hook to determine if the current viewport width is considered mobile.
 * Sets up an event listener on mount to track screen width changes relative to the defined breakpoint.
 *
 * @returns {boolean} - Returns `true` if the viewport width is below the mobile breakpoint, otherwise `false`.
 */
export function useIsMobile() {
  /**
   * State to track whether the current device width is considered mobile.
   * Initially set to `undefined`, then updates to `true` or `false`.
   */
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    /**
     * MediaQueryList object that monitors screen width changes relative to the mobile breakpoint.
     */
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    /**
     * Event handler function that updates the `isMobile` state based on the current window width.
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Adds an event listener to the MediaQueryList to monitor changes in screen width.
    mql.addEventListener("change", onChange)

    // Cleanup function to remove the event listener when the component unmounts or re-renders.
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures this effect only runs once on mount.

  /**
   * Returns a boolean value to indicate the mobile state.
   * Defaults to `false` if the state is `undefined`.
   */
  return Boolean(isMobile)
}
