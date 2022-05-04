import { Field, Int, ObjectType } from '@nestjs/graphql'
import { MediaType } from './media.type'
import { SpaceData } from '../interfaces'
import { SpaceStatusType } from './space-status'

@ObjectType('Workspace')
export class WorkspaceType implements SpaceData {
  @Field()
  id: string

  @Field({ nullable: true })
  parent?: string

  @Field({ nullable: true })
  company?: string

  @Field()
  name: string

  @Field(() => Int, { nullable: true })
  capacity?: number

  @Field(() => [String], { nullable: true })
  labels?: string[]

  @Field(() => Int, { nullable: true })
  hasChildren?: number

  @Field(() => Boolean)
  canHaveNote: boolean

  @Field(() => [MediaType], { nullable: true })
  floorPlans?: MediaType[]

  @Field(() => Boolean, { nullable: true })
  disabled?: boolean

  @Field(() => Boolean)
  isAccessible: boolean

  @Field(() => SpaceStatusType, { nullable: true })
  status: SpaceStatusType

  @Field(() => [WorkspaceType], { nullable: true })
  rootPath: WorkspaceType[]
}
