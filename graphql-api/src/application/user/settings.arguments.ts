import { ArgsType, Field } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { MaxStringifiedLength } from '../json-size.validator'

@ArgsType()
export class SetSettingsArguments {
  @Field()
  key: string

  @Field({ nullable: true })
  objectId?: string

  @Field(() => GraphQLJSON)
  @MaxStringifiedLength(2048)
  value: JSONObject
}
