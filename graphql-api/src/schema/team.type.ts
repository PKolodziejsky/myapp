import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CompanyType } from './company.type'
import GraphQLJSON from 'graphql-type-json'

@ObjectType('Team')
export class TeamType {
  @Field()
  id: string

  @Field()
  displayName: string

  @Field()
  description: string
}
