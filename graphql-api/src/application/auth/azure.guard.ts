import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext } from '@nestjs/common'
import { requestFromExecutionContext } from '../../utilities/execution-context'

export class AzureGuard extends AuthGuard('azure') {
  getRequest(context: ExecutionContext) {
    const request = requestFromExecutionContext(context)

    if (request.query.access_token || !request.headers.authorization) {
      request.headers.authorization = `Bearer ${request.query.access_token}`
      delete request.query.access_token
    }

    return request
  }
}
