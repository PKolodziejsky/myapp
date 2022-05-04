import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { requestFromExecutionContext } from '../utilities/execution-context'

export const User = createParamDecorator((data: unknown, context: ExecutionContext) => requestFromExecutionContext(context).user.user)
