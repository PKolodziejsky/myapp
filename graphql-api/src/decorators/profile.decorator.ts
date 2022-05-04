import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { requestFromExecutionContext } from '../utilities/execution-context'

export const Profile = createParamDecorator((data: unknown, context: ExecutionContext) => requestFromExecutionContext(context).user.profile)
