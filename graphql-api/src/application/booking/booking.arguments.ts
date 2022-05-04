import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsDateString } from 'class-validator'

@InputType()
export class BookingStatsRangeInputType {
  @IsDateString()
  @Field()
  from: string

  @IsDateString()
  @Field()
  to: string
}
