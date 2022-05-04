import { Field, InputType } from '@nestjs/graphql'
import { IsDateString, IsOptional, Length } from 'class-validator'

@InputType()
export class AddBookingInputType {
  @IsDateString()
  @Field()
  date: string

  @Field()
  spaceId: string

  @Field({ nullable: true })
  note?: string

  @Field(() => Boolean, { nullable: true })
  isAnonymous?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 100)
  guestInfo?: string
}

@InputType()
export class UpdateBookingInputType {
  @Field({ nullable: true })
  date?: string

  @Field({ nullable: true })
  spaceId: string

  @Field({ nullable: true })
  note?: string

  @Field(() => Boolean, { nullable: true })
  isAnonymous?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 100)
  guestInfo?: string
}
