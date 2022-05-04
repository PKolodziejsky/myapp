import { useEffect } from 'react'

export const useScrollLock = (open: boolean, className: string) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add(className)

      return () => {
        document.body.classList.remove(className)
      }
    }
  }, [open, className])
}
