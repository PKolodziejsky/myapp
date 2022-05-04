import { DemoExternal, DemoInternal, Development, Local, MyProduction, Preview, Staging } from './configs'

const env = process.env.REACT_APP_ENV
let config = MyProduction

if (env === 'LOCAL') config = Local
if (env === 'DEVELOPMENT') config = Development
if (env === 'DEMO_INTERNAL') config = DemoInternal
if (env === 'DEMO_EXTERNAL') config = DemoExternal
if (env === 'STAGING') config = Staging
if (env === 'PREVIEW') config = Preview
if (env === 'MYPRODUCTION') config = MyProduction

export const USER = '46269d11-c6f4-4d71-97af-8695ce4595f5'

export const BASE_ENDPOINT = config.BASE_ENDPOINT || ''
export const REDIRECT_URI = config.REDIRECT_URI || ''
export const STRIPPED_REDIRECT_URI = config.STRIPPED_REDIRECT_URI || ''
export const API_ENDPOINT = config.BASE_ENDPOINT + config.API_ENDPOINT || ''
export const MEDIA_ENDPOINT = config.BASE_ENDPOINT + config.MEDIA_ENDPOINT || ''
export const CLIENT_ID = config.APP_ID || ''

export const API_PATH = config.API_ENDPOINT

export const GRAPH_SCOPES = [
  'User.Read',
  'User.ReadBasic.All',
  'People.Read',
  'User.Read.All',
  'TeamMember.Read.All',
  'Calendars.ReadWrite',
  'Chat.ReadWrite',
  'Directory.Read.All',
  'Place.ReadWrite.All',
  'RoleManagement.Read.All',
  'UserNotification.ReadWrite.CreatedByApp',
  'offline_access',
  'openid',
  'profile',
  'User.ReadBasic.All',
]

export const DEBUG = false
