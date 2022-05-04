import { AuthRequest } from './request.interface'
import { TrackingUserData } from '../application/tracking/tracking.interface'

export interface Context {
  request: AuthRequest
  tracking: TrackingUserData
}
