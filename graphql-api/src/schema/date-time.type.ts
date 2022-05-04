import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsISO8601 } from 'class-validator'

@ObjectType('DateTime')
export class DateTimeType {
  @Field()
  dateTime: string

  @Field()
  timeZone: string
}

@InputType('DateTimeInput')
export class DateTimeInputType {
  @Field()
  @IsISO8601()
  dateTime: string

  @Field()
  timeZone: string
}
