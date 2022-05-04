import { Field, ObjectType } from '@nestjs/graphql'
import { CompanyType } from './company.type'
import GraphQLJSON from 'graphql-type-json'
import { PersonType } from './person.type'
import {MeetingRoomType} from "./meeting-room";

@ObjectType('UserSettings')
export class UserSettingsType {
  @Field(() => GraphQLJSON, { nullable: true })
  custom?: JSON
}

@ObjectType('User')
export class UserType {
  @Field()
  id: string

  @Field()
  objectId: string

  @Field(() => CompanyType)
  company: CompanyType

  @Field(() => UserSettingsType, { nullable: true })
  settings?: UserSettingsType

  @Field(() => PersonType)
  person: PersonType

  @Field(() => [UserType])
  favorites: UserType[]

  @Field(() => [MeetingRoomType])
  favoriteMeetingRooms: MeetingRoomType[]

  @Field(() => Boolean)
  isFavorite: boolean

  @Field(() => Boolean)
  isAdmin: boolean
}
