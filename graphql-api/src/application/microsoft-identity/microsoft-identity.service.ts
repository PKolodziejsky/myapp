import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { AuthenticationResult, ConfidentialClientApplication } from '@azure/msal-node'
import { CacheDataLoader } from '../../utilities'

@Injectable()
export class MicrosoftIdentityService implements OnModuleInit {
  private tokenLoader: CacheDataLoader<string, AuthenticationResult | null>

  constructor(@Inject('MSAL_CONFIDENTIAL_CLIENT') private readonly confidentialClient: ConfidentialClientApplication) {}

  acquireToken(token: string, skipCache: boolean = false) {
    if (skipCache) {
      return this.acquireTokenOnBehalfOf(token, skipCache)
    } else {
      return this.tokenLoader.load(token)
    }
  }

  private acquireTokenOnBehalfOf(token: string, skipCache: boolean = false) {
    return this.confidentialClient.acquireTokenOnBehalfOf({
      oboAssertion: token,
      scopes: ['https://graph.microsoft.com/.default'],
      skipCache,
    })
  }

  onModuleInit() {
    this.tokenLoader = new CacheDataLoader((token: string) => {
      return this.acquireTokenOnBehalfOf(token)
    })
  }
}
