import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const requestFromExecutionContext = (executionContext: ExecutionContext) => {
  const type = executionContext.getType<'http' | 'graphql'>()

  switch (type) {
    case 'http':
      return executionContext.switchToHttp().getRequest()
    case 'graphql':
      return GqlExecutionContext.create(executionContext).getContext().request
  }
}
