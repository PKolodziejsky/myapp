import { OpenBookingDataChanges, OpenMeetingRoomBookingData, OpenWorkspaceBookingData } from '../../../store'
import { Space } from '../../../types'

export interface SubmissionScreenProps<T extends OpenWorkspaceBookingData | OpenMeetingRoomBookingData> {
  date: Date
  bookingData: T
  rootSpace?: Space
  onChange: (changes: OpenBookingDataChanges) => void
  setSubmit: (fn: () => void) => void
  onCancel: () => void
  onSuccess?: () => void
  onFailure?: () => void
  className?: string
  setCanBook: (value: boolean) => void
  isGuestBooking?: boolean
}
