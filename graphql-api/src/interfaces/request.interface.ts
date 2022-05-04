import { Request } from 'express'
import { UserDocument } from '../models/user.model'
import { MicrosoftUserProfile } from '../types/profile.interface'

export interface AuthRequest extends Request {
  tenant?: string
  objectId?: string
  user?: UserDocument
  profile?: MicrosoftUserProfile
}
