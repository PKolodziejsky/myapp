export type AppConfig = {
  BASE_ENDPOINT: string
  REDIRECT_URI: string
  STRIPPED_REDIRECT_URI: string
  API_ENDPOINT: string
  MEDIA_ENDPOINT: string
  APP_ID: string
}

export const Local: AppConfig = {
  BASE_ENDPOINT: 'http://localhost:3030',
  REDIRECT_URI: 'http://localhost:3000',
  STRIPPED_REDIRECT_URI: 'feat-meeting-room-booking.d2e3tx8qb61s2a.amplifyapp.com',
  API_ENDPOINT: '/api',
  MEDIA_ENDPOINT: '/media',
  APP_ID: '0a3b1bb1-b4b2-4bdf-8eea-c41ee08c5dc3',
}

export const Development: AppConfig = {
  BASE_ENDPOINT: 'https://seatti-dev.eu.ngrok.io',
  REDIRECT_URI: 'https://feat-meeting-room-booking.d2e3tx8qb61s2a.amplifyapp.com',
  STRIPPED_REDIRECT_URI: 'feat-meeting-room-booking.d2e3tx8qb61s2a.amplifyapp.com',
  API_ENDPOINT: '/api',
  MEDIA_ENDPOINT: '/media',
  APP_ID: '0a3b1bb1-b4b2-4bdf-8eea-c41ee08c5dc3',
}

export const DemoInternal: AppConfig = {
  BASE_ENDPOINT: 'https://seatti-demo-internal.eu.ngrok.io',

  REDIRECT_URI: 'https://develop.d3lgeh2u9f5y51.amplifyapp.com',
  STRIPPED_REDIRECT_URI: 'develop.d3lgeh2u9f5y51.amplifyapp.com',
  API_ENDPOINT: '/api',
  MEDIA_ENDPOINT: '/media',
  APP_ID: '0a3b1bb1-b4b2-4bdf-8eea-c41ee08c5dc3',
}

export const DemoExternal: AppConfig = {
  BASE_ENDPOINT: 'https://seatti-demo-external.eu.ngrok.io',
  REDIRECT_URI: 'https://develop.d30jqkwys02j6y.amplifyapp.com',
  STRIPPED_REDIRECT_URI: 'develop.d30jqkwys02j6y.amplifyapp.com',
  API_ENDPOINT: '/api',
  MEDIA_ENDPOINT: '/media',
  APP_ID: '0a3b1bb1-b4b2-4bdf-8eea-c41ee08c5dc3',
}

export const Staging: AppConfig = {
  BASE_ENDPOINT: 'https://apistaging.seatti.co',
  REDIRECT_URI: 'https://staging.seatti.co',
  STRIPPED_REDIRECT_URI: 'staging.seatti.co',
  API_ENDPOINT: '/',
  MEDIA_ENDPOINT: '/media',
  APP_ID: '0a3b1bb1-b4b2-4bdf-8eea-c41ee08c5dc3',
}

export const Preview: AppConfig = {
  BASE_ENDPOINT: 'https://apipreview.seatti.co',
  REDIRECT_URI: 'https://preview.seatti.co',
  STRIPPED_REDIRECT_URI: 'preview.seatti.co',
  API_ENDPOINT: '/',
  MEDIA_ENDPOINT: '/media',
  APP_ID: '907ed842-f238-4a27-abf4-ed8d8b24c58c',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Production__DEPRECATED__: AppConfig = {
  BASE_ENDPOINT: 'https://api.seatti.co',
  REDIRECT_URI: 'https://app.seatti.co',
  STRIPPED_REDIRECT_URI: 'app.seatti.co',
  API_ENDPOINT: '/',
  MEDIA_ENDPOINT: '/media',
  APP_ID: '5719dca3-47f8-408c-a57b-bfe9ee8386f9',
}

export const MyProduction: AppConfig = {
  BASE_ENDPOINT: 'https://myapi.seatti.co',
  REDIRECT_URI: 'https://my.seatti.co',
  STRIPPED_REDIRECT_URI: 'my.seatti.co',
  API_ENDPOINT: '/',
  MEDIA_ENDPOINT: '/media',
  APP_ID: '7cd27ae1-336d-49d5-800b-6365d9a4b6b7',
}
