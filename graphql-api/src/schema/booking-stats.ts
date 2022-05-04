import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('BookingStatsRange')
export class BookingStatsRangeType {
  @Field()
  from: string

  @Field()
  to: string

  @Field(() => Int)
  count: number
}

@ObjectType('BookingStats')
export class BookingStatsType {
  @Field(() => [BookingStatsRangeType], { nullable: 'items' })
  ranges: BookingStatsRangeType[]
}
