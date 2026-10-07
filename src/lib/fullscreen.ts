import { useCallback, useEffect, useState } from 'react'

// The exam views want the whole screen: the browser's own chrome is a
// distraction while a student is answering. `toggle` expands the document and
// the browser handles leaving again on Esc, so there is no key listener here.
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', sync)
    sync()
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen?.()?.catch(() => {})
    }
  }, [])

  return { isFullscreen, toggle }
}
