import { Method } from 'got'

export interface MicrosoftGraphPaginatedResponse<T> {
  '@odata.nextLink': string
  value: T[]
}

export const isMicrosoftGraphPaginatedResponse = <T>(body: unknown): body is MicrosoftGraphPaginatedResponse<T> => {
  return (body as MicrosoftGraphPaginatedResponse<T>)["@odata.nextLink"] != null
}

interface MicrosoftGraphRequestCommonOptions {
  token: string
  resolvePagination?: boolean
  skipCache?: boolean
}

interface MicrosoftGraphRequestCacheOptions {
  ttl?: number
}

interface MicrosoftGraphRequestDataOptions {
  data: Record<string, unknown>
}

export type MicrosoftGraphGetRequestOptions = MicrosoftGraphRequestCommonOptions & MicrosoftGraphRequestCacheOptions

export type MicrosoftGraphPostRequestOptions = MicrosoftGraphRequestCommonOptions & MicrosoftGraphRequestCacheOptions & MicrosoftGraphRequestDataOptions

export type MicrosoftGraphPutRequestOptions = MicrosoftGraphRequestCommonOptions & MicrosoftGraphRequestDataOptions

export type MicrosoftGraphPatchRequestOptions = MicrosoftGraphRequestCommonOptions & MicrosoftGraphRequestDataOptions

export type MicrosoftGraphStreamRequestOptions = {
  token: string
}


export interface MicrosoftGraphRequestOptions extends MicrosoftGraphRequestCommonOptions, Partial<MicrosoftGraphRequestDataOptions> {
  method: Method
  url: string
}

export interface MicrosoftGraphCacheableRequestOptions extends MicrosoftGraphRequestOptions {
  ttl?: number
}
