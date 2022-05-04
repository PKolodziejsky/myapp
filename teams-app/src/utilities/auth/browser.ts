import { PublicClientApplication } from '@azure/msal-browser'
import { Configuration } from '@azure/msal-browser/dist/config/Configuration'

import { CLIENT_ID, REDIRECT_URI, STRIPPED_REDIRECT_URI } from '../../config/constants'

const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    knownAuthorities: [],
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: `${REDIRECT_URI}/logout`,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const msalInstance = new PublicClientApplication(msalConfig)

const SCOPES = [`api://${STRIPPED_REDIRECT_URI}/${CLIENT_ID}/access_as_user`]

export const getBrowserAccessToken = (): Promise<string> => {
  const [account] = msalInstance.getAllAccounts()

  return msalInstance
    .acquireTokenSilent({
      account,
      scopes: SCOPES,
    })
    .then(tokenResponse => tokenResponse.accessToken)
}

export const browserLogin = () => {
  const [account] = msalInstance.getAllAccounts()

  return msalInstance.loginRedirect({
    account,
    scopes: SCOPES,
  })
}

export const initializeBrowser = (): Promise<boolean> => {
  return msalInstance.handleRedirectPromise().then(authenticationResult => {
    if (authenticationResult) {
      return true
    }

    const [account] = msalInstance.getAllAccounts()

    return account ? true : false
  })
}
