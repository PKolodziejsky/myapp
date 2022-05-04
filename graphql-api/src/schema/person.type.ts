import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CompanyType } from './company.type'
import GraphQLJSON from 'graphql-type-json'

@ObjectType('Person')
export class PersonType {
  @Field()
  id: string

  @Field()
  displayName: string

  @Field({ nullable: true })
  department?: string

  @Field({ nullable: true })
  jobTitle?: string

  @Field()
  profileImage: string
}
