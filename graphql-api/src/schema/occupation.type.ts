import { Field, Int, ObjectType } from '@nestjs/graphql'
import {WorkspaceType} from "./workspace.type";

@ObjectType('Capacity')
export class OccupationType {
  @Field()
  date: string

  @Field(() => WorkspaceType)
  space: WorkspaceType

  @Field(() => Int)
  occupation: number
}
