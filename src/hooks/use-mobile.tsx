import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

// Importing React to use its hook.
React.useEffect(() => {
  // Creates a MediaQueryList object to monitor screen width changes against the mobile breakpoint.
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

  // Function to update the mobile state based on the current window width.
  const onChange = () => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  }

  // Adds an event listener to trigger `onChange` whenever the media query changes.
  mql.addEventListener("change", onChange)

  // Cleanup function to remove the event listener when the component unmounts or updates.
  return () => mql.removeEventListener("change", onChange)
}, []) // Empty dependency array to run only on mount.


  return Boolean(isMobile)
}
