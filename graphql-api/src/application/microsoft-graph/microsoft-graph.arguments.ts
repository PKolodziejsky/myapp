import { ArgsType, Field } from '@nestjs/graphql'
import { IsUUID, MinLength } from 'class-validator'

@ArgsType()
export class PersonByDisplayNameArgs {
  @Field()
  @MinLength(1)
  name: string
}

@ArgsType()
export class UuidArgs {
  @Field()
  @IsUUID()
  id: string
}
