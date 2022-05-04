import './i18n'

import React, { Fragment } from 'react'
import ReactBreakpoints from 'react-breakpoints'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { useAuthentication, useAuthorization, useUserPreferredLocale } from './hooks'
import { ApplicationEnvironmentProvider, LocaleProvider, ThemeProvider, UserProvider } from './providers'
import { queryClient } from './request'
import {
  AdminScreen,
  AdminSpacesScreen,
  AdminUsersScreen,
  AuthenticationErrorScreen,
  AuthorizationErrorScreen,
  BadRequestScreen,
  ConfigScreen,
  LoadingScreen,
  LoginScreen,
  PlanningProductTourScreen,
  PlanningScreen,
  PrivacyScreen,
  TermsOfUseScreen,
} from './screens'
import { MeetupScreen } from './screens/Meetup'

export const Application = () => {
  const { isLoading: isAuthenticatedLoading, isAuthenticated, environment, error: authenticationError } = useAuthentication()
  const { isLoading: isAuthorizedLoading, isAuthorized, error: authorizationError } = useAuthorization(isAuthenticated)

  const { userPreferredLocale, setUserPreferredLocale } = useUserPreferredLocale({
    environment,
    useUserSettingsLocale: isAuthorized,
  })

  const initialState = authenticationError
    ? 'authentication-failed'
    : authorizationError === 'INVALID_COMPANY'
    ? 'authorization-failed'
    : 'login'

  if ((isAuthenticatedLoading && !isAuthenticated) || (isAuthorizedLoading && isAuthenticated)) {
    return <LoadingScreen />
  }

  return (
    <RecoilRoot>
      <ApplicationEnvironmentProvider environment={environment}>
        <QueryClientProvider client={queryClient}>
          <LocaleProvider locale={userPreferredLocale} onChangeLocale={setUserPreferredLocale}>
            <UserProvider signedIn={isAuthorized}>
              <ThemeProvider>
                {/* TODO Get from tailwind config */}
                <ReactBreakpoints breakpoints={{ sm: 480, md: 768, lg: 1024, xl: 1280 }}>
                  <BrowserRouter>
                    {isAuthorized ? (
                      <Routes>
                        <Route path='tour' element={<PlanningProductTourScreen />} />
                        <Route path='planning' element={<PlanningScreen />} />
                        <Route path='meetup' element={<MeetupScreen />} />
                        <Route path='oops' element={<BadRequestScreen />} />
                        <Route path='admin' element={<AdminScreen />}>
                          <Route index element={<Navigate replace to='/admin/spaces' />} />
                          <Route path='spaces' element={<AdminSpacesScreen />}>
                            <Route path=':spaceId' element={<AdminSpacesScreen />} />
                          </Route>
                          <Route path='users' element={<AdminUsersScreen />} />
                        </Route>
                        <Route path='privacy' element={<PrivacyScreen />} />
                        <Route path='termsofuse' element={<TermsOfUseScreen />} />
                        <Route path='config' element={<ConfigScreen />} />
                        <Route path='*' element={<Navigate replace to='/planning' />} />
                      </Routes>
                    ) : (
                      <Fragment>
                        {initialState === 'authentication-failed' && <AuthenticationErrorScreen error={authenticationError} />}
                        {initialState === 'authorization-failed' && <AuthorizationErrorScreen error={authorizationError} />}
                        {initialState === 'login' && <LoginScreen />}
                      </Fragment>
                    )}
                  </BrowserRouter>
                  <Toaster
                    position='bottom-right'
                    toastOptions={{
                      duration: 4000,
                      error: {
                        duration: 10000,
                      },
                    }}
                  />
                </ReactBreakpoints>
              </ThemeProvider>
            </UserProvider>
          </LocaleProvider>
        </QueryClientProvider>
      </ApplicationEnvironmentProvider>
    </RecoilRoot>
  )
}
