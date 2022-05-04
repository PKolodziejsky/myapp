import { AuthRequest } from '../../interfaces'
import { CompanyDocument } from '../../models/company.model'
import { TrackingUserData } from './tracking.interface'

export const trackingDataFromRequest = (request: AuthRequest): TrackingUserData => ({
  userId: request.user?._id,
  objectId: request.objectId!,
  tenantId: request.tenant!,
  companyId: (request.user?.company as CompanyDocument)?._id,
})
