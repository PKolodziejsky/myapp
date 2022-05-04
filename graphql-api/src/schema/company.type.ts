import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { UserType } from './user.type'
import { WorkspaceType } from './workspace.type'
import { TimePeriod } from '../types/time.interface'

enum TimePeriodUnit {
  day = 'day',
  week = 'week',
  month = 'month',
}

registerEnumType(TimePeriodUnit, {
  name: 'TimePeriodUnit',
})

@ObjectType('TimePeriod')
export class TimePeriodType {
  @Field(() => Int)
  value: number

  @Field(() => TimePeriodUnit)
  unit: TimePeriodUnit
}

@ObjectType('CompanyBookingRestrictionsDefaultsSettings')
export class CompanyBookingRestrictionsDefaultsSettingsType {
  @Field(() => TimePeriodType, { nullable: true })
  future?: TimePeriodType

  @Field(() => TimePeriodType, { nullable: true })
  past?: TimePeriodType
}

@ObjectType('CompanyBookingRestrictionsSetting')
export class CompanyBookingRestrictionsSettingsType {
  @Field(() => CompanyBookingRestrictionsDefaultsSettingsType, { nullable: true })
  defaults?: CompanyBookingRestrictionsDefaultsSettingsType

  @Field(() => Int, { nullable: true })
  maxGuestBookings?: number
}

@ObjectType('CompanyBookingSettings')
export class CompanyBookingSettingsType {
  @Field(() => CompanyBookingRestrictionsSettingsType, { nullable: true })
  restrictions: CompanyBookingRestrictionsSettingsType
}

@ObjectType('CompanySettings')
export class CompanySettingsType {
  @Field(() => CompanyBookingSettingsType, { nullable: true })
  booking?: CompanyBookingSettingsType

  @Field(() => CompanyBookingSettingsType, { nullable: true })
  visibility?: CompanyBookingSettingsType
}

@ObjectType('Company')
export class CompanyType {
  @Field()
  id: string

  @Field()
  name: string

  @Field(() => [UserType])
  users: UserType[]

  @Field(() => [WorkspaceType])
  spaces: WorkspaceType[]

  @Field(() => CompanySettingsType, { nullable: true })
  settings?: CompanySettingsType
}
