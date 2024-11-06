import * as React from "react"

const MOBILE_BREAKPOINT = 768  // Sets the width threshold for mobile devices.

/**
 * Custom hook to determine if the current viewport width is considered mobile.
 * 
 * @returns {boolean} - True if the viewport width is below the mobile breakpoint, otherwise false.
 */
export function useIsMobile() {
  // State to track whether the device width is mobile-sized. 
  // `undefined` initially, then set to `true` or `false`.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // Effect hook to handle viewport width changes and set the mobile state.
  React.useEffect(() => {
    // MediaQueryList object to monitor screen width changes relative to the mobile breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Updates `isMobile` state based on current window width.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Adds an event listener to detect changes in screen width relative to the breakpoint.
    mql.addEventListener("change", onChange)

    // Cleanup function to remove the event listener when the component unmounts or re-renders.
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures this effect only runs once on mount.

  // Returns a boolean value to indicate mobile state, defaulting to `false` if undefined.
  return Boolean(isMobile)
}
