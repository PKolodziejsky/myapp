import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { DateTimeInputType, DateTimeType } from './date-time.type'

@ObjectType('DateTimeRange')
export class DateTimeRangeType {
  @Field(() => DateTimeType)
  start: DateTimeType

  @Field(() => DateTimeType)
  end: DateTimeType
}

@InputType('DateTimeRangeInput')
export class DateTimeRangeInputType {
  @Field(() => DateTimeInputType)
  start: DateTimeInputType

  @Field(() => DateTimeInputType)
  end: DateTimeInputType
}
