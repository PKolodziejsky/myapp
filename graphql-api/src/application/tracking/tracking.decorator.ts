import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Context } from '../../interfaces'

export const TrackingData = createParamDecorator((data: unknown, ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext<Context>().tracking)
