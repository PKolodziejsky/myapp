import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import {
  MicrosoftGraphCacheableRequestOptions,
  MicrosoftGraphGetRequestOptions,
  MicrosoftGraphPatchRequestOptions,
  MicrosoftGraphPostRequestOptions,
  MicrosoftGraphPutRequestOptions,
  MicrosoftGraphRequestOptions, MicrosoftGraphStreamRequestOptions,
} from './microsoft-request.interface'
import { createCacheKey } from './microsoft-request.utilities'
import { ConfidentialClientApplication } from '@azure/msal-node'
import { Got } from 'got'
import { isMicrosoftGraphPaginatedResponse } from './microsoft-request.interface'

@Injectable()
export class MicrosoftRequestService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('GOT_CLIENT') private readonly got: Got,
    @Inject('MSAL_CONFIDENTIAL_CLIENT') private readonly confidentialClient: ConfidentialClientApplication,
  ) {}

  async get<T>(url: string, options: MicrosoftGraphGetRequestOptions): Promise<T> {
    return this.cacheableRequest({ url, method: 'get', ...options }) as Promise<T>
  }

  async post<T>(url: string, { token, ...options }: MicrosoftGraphPostRequestOptions): Promise<T> {
    await this.deleteCache(token, url)

    return this.cacheableRequest({ url, method: 'post', token, ...options }) as Promise<T>
  }

  async put<T>(url: string, { token, ...options }: MicrosoftGraphPutRequestOptions): Promise<T> {
    await this.deleteCache(token, url)

    return this.request({ url, method: 'put', token, ...options }) as Promise<T>
  }

  async patch<T>(url: string, { token, ...options }: MicrosoftGraphPatchRequestOptions): Promise<T> {
    await this.deleteCache(token, url)

    return this.request({ url, method: 'patch', token, ...options }) as Promise<T>
  }

  async stream<T>(url: string, { token }: MicrosoftGraphStreamRequestOptions) {
    const accessToken = await this.getAccessToken(token)

    return this.got.stream(url, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  async deleteCache(token: string, url: string) {
    const cacheKey = createCacheKey(token, url, 'get')

    await this.cacheManager.del(cacheKey)
  }

  private async cacheableRequest({ url, method, token, data, ttl, skipCache, ...options }: MicrosoftGraphCacheableRequestOptions) {
    const cacheKey = createCacheKey(token, url, method, data)

    if (!skipCache) {
      const cacheResult = await this.cacheManager.get(cacheKey)
      if (cacheResult) {
        return cacheResult
      }

      return this.cacheManager.wrap(
          cacheKey,
          () => {
            return this.request({ url, method, token, data, ...options })
          },
          { ttl: ttl ?? 2 * 60 },
      )
    }

    return this.request({ url, method, token, data, ...options })
  }

  private async request({ url, method, token, data, resolvePagination }: MicrosoftGraphRequestOptions) {
    const accessToken = await this.getAccessToken(token)

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const body = await this.got(url, {
      ...options,
      json: data,
    }).json()

    if (resolvePagination) {
      if (isMicrosoftGraphPaginatedResponse(body)) {
        let value: unknown[] = []

        do {
          const { body: paginatedBody } = await this.got(body['@odata.nextLink'], options).json()

          value = paginatedBody.body.value

          body.value.push(...value)
        } while (value.length > 0)
      }
    }

    return body
  }

  private async getAccessToken(token: string) {
    const result = await this.confidentialClient.acquireTokenOnBehalfOf({
      oboAssertion: token,
      scopes: ['https://graph.microsoft.com/.default'],
    })

    return result?.accessToken
  }
}
