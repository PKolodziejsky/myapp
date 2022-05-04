import * as microsoftTeams from '@microsoft/teams-js'
import React, { ReactNode, createContext, useLayoutEffect, useState } from 'react'

import { useApplicationEnvironment } from '../hooks'
import { getTeamsContext } from '../utilities'

export const ThemeContext = createContext<string | undefined>('default')

const switchMode = (darkMode: boolean) => {
  if (darkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const environment = useApplicationEnvironment()
  const [theme, setTheme] = useState<string | undefined>('default')

  useLayoutEffect(() => {
    if (environment === 'teams') {
      getTeamsContext().then(context => {
        setTheme(context.theme)
      })

      microsoftTeams.registerOnThemeChangeHandler(theme => setTheme(theme))
    }

    if (environment === 'browser') {
      const matchMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const mediaQueryListener = (event: MediaQueryListEvent | MediaQueryList) => {
        const isDarkMode = event.matches

        setTheme(isDarkMode ? 'dark' : 'default')
      }

      mediaQueryListener(matchMediaQuery)

      matchMediaQuery.addEventListener('change', mediaQueryListener)

      return () => matchMediaQuery.removeEventListener('change', mediaQueryListener)
    }
  }, [environment])

  useLayoutEffect(() => {
    switchMode(theme === 'dark')
  }, [theme])

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
