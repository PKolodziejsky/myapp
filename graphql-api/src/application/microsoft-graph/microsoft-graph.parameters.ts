import { IsUUID } from 'class-validator'

export class UuidParams {
  @IsUUID()
  id: string
}
