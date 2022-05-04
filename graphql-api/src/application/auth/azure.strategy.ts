import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { BearerStrategy } from 'passport-azure-ad'
import { ConfigService } from '@nestjs/config'
import { GraphQLError } from '../../error/graphql.error'
import { Request } from 'express'
import { AzureAccessTokenPayload } from './auth.interface'
import { getTokenFromHeaders } from '../../utilities/headers'
import { AuthService } from './auth.service'

@Injectable()
export class AzureStrategy extends PassportStrategy(BearerStrategy, 'azure') {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
      clientID: configService.get<string>('APP_ID'),
      validateIssuer: false,
      audience: configService.get<string>('APP_ID'),
      passReqToCallback: true,
    })
  }

  async validate(request: Request, token: AzureAccessTokenPayload) {
    const { tid, oid } = token
    const accessToken = getTokenFromHeaders(request.headers)

    try {
      return await this.authService.userFromToken(tid, oid, accessToken!)
    } catch (error) {
      throw new GraphQLError(error.message)
    }
  }
}
