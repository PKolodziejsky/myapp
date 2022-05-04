import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { requestFromExecutionContext } from '../utilities/execution-context'
import { Roles } from '../types/roles.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler())
    if (!roles) {
      return true
    }
    const request = requestFromExecutionContext(context)

    const user = request.user

    for (let role of roles) {
      if (user.roles.includes(role)) {
        return true
      }
    }

    return false
  }
}
