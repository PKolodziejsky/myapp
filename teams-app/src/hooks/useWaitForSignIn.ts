import { useEffect, useRef, useState } from 'react'

const WAIT_TIMEOUT = 1000

export const useWaitForSignIn = (signedIn: boolean, loading: boolean) => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [waitsForSignIn, setWaitsForSignIn] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!signedIn) {
        timeoutRef.current = setTimeout(() => {
          setWaitsForSignIn(false)
        }, WAIT_TIMEOUT)
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        setWaitsForSignIn(false)
      }
    }
  }, [signedIn, loading])

  return waitsForSignIn
}
