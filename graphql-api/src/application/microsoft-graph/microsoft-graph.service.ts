import { Injectable } from '@nestjs/common'
import { addProfileImageToPeople, addProfileImageToPerson } from './microsoft-graph.utilities'
import { Roles } from '../../types/roles.enum'
import { GraphQLError } from '../../error/graphql.error'
import {
  MicrosoftGraphCalendarSchedule,
  MicrosoftGraphEvent,
  MicrosoftGraphLocation,
  MicrosoftGraphMeetingRoom,
  Person,
} from './microsoft-graph.interface'
import { DateTimeRangeInputType } from '../../schema/date-range'
import {MicrosoftRequestService} from "../microsoft-request/microsoft-request.service";
import MicrosoftGraph from '@microsoft/microsoft-graph-types'

@Injectable()
export class MicrosoftGraphService {
  constructor(
      private readonly requestService: MicrosoftRequestService
  ) {}

  async me(token: string) {
    return this.requestService.get<MicrosoftGraph.User>(`me`, { token, ttl: 60 * 5 })
  }

  joinedTeam(token: string) {
    return this.requestService
      .get(`me/joinedTeams?$select=id,displayName,description`, { token, ttl: 60 * 5 })
      .then((data: any) => data.value)
      .catch(() => {
        throw new GraphQLError('Invalid Token', 'INVALID_TOKEN')
      })
  }

  groupMembers(token: string, id: string): Promise<Person[]> {
    return this.requestService
      .get(`groups/${id}/members/microsoft.graph.user?$select=id,displayName,department,jobTitle`, { token, ttl: 60 * 5 })
      .then((data: any) => data.value)
      .then(addProfileImageToPeople)
      .catch(() => {
        throw new GraphQLError('Invalid Token', 'INVALID_TOKEN')
      })
  }

  person(token: string, id: string) {
    return this.requestService
        .get<MicrosoftGraph.User>(`users/${id}/?$select=id,displayName,department,jobTitle`, { token, ttl: 60 * 5 })
        .then(addProfileImageToPerson)
  }

  personByDisplayName(token: string, query: string) {
    return this.requestService
        .get<MicrosoftGraph.User>(`users?$filter=startswith(displayName,'${query}')&$select=id,displayName,department,jobTitle`, { token, skipCache: true })
        .then(addProfileImageToPerson)
  }

  favoritePersons(token: string) {
    return this.requestService
      .get(`me/people?$filter=personType/class eq 'Person' and personType/subclass eq 'OrganizationUser'&$select=id,displayName,department,jobTitle`, { token, ttl: 60 })
      .then((data: any) => data.value)
      .then(addProfileImageToPeople)
      .catch(() => {
        throw new GraphQLError('Invalid Token', 'INVALID_TOKEN')
      })
  }

  profileImageStream(token: string, id: string) {
    return this.requestService.stream(`users/${id}/photo/$value`,{ token })
  }

  async getGroupsAndRoles(token: string) {
    const groups: string[] = await this.requestService
      .post(`me/getMemberGroups`, {
        token,
        ttl: 60 * 5,
        data: {
          securityEnabledOnly: false,
        }
      })
      .then((data: any) => {
        if (data['@odata.nextLink'] != null) {
          console.warn('[GROUPS] getMemberGroups has pagination')
        }

        return data.value
      })
      .catch((e) => {
        console.error('[GROUPS] Could not load getMemberGroups')

        return []
      })

    const roleTemplates: string[] = await this.requestService
      .get(`me/transitiveMemberOf/microsoft.graph.directoryRole?$select=id,roleTemplateId`, { token, ttl: 60 * 5 })
      .then((data: any) => {
        if (data['@odata.nextLink'] != null) {
          console.warn('[GROUPS] transitiveMemberOf has pagination')
        }

        return data.value.map((group: any) => group.roleTemplateId)
      })
      .catch((e) => {
        console.error('[GROUPS] Could not load transitiveMemberOf')

        return []
      })

    const roles = [Roles.User]

    // Company Administrator
    if (roleTemplates.includes('62e90394-69f5-4237-9190-012177145e10')) {
      roles.push(Roles.Admin)
    }

    // Teams Service Admin
    if (roleTemplates.includes('69091246-20e8-4a56-aa4d-066075b2a7a8')) {
      roles.push(Roles.Admin)
    }

    return {
      groups,
      roles,
    }
  }

  meetingRooms(token: string): Promise<MicrosoftGraphMeetingRoom[]> {
    return this.requestService
      .get('places/microsoft.graph.room?$select=displayName,id,capacity,emailAddress,videoDeviceName,displayDeviceName,isWheelChairAccessible,audioDeviceName', { token, ttl: 60 * 30 })
      .then((data: any) => data.value)
      .catch(() => {
        throw new GraphQLError('Invalid Token', 'INVALID_TOKEN')
      })
  }

  schedule(token: string, emailAddress: string[], range: DateTimeRangeInputType): Promise<MicrosoftGraphCalendarSchedule[]> {
    return this.requestService
      .post('me/calendar/getSchedule', {
        token,
        ttl: 5,
        data: {
          schedules: emailAddress,
          startTime: range.start,
          endTime: range.end,
        },
      })
      .then((data: any) => data.value)
      .catch((error) => {
        throw new GraphQLError('Invalid Token', 'INVALID_TOKEN')
      })
  }

  createEvent(token: string, range: DateTimeRangeInputType, subject: string, location: MicrosoftGraphLocation) {
    return this.requestService
      .post('me/events', {
        token,
        skipCache: true,
        data: {
          subject,
          location: {
            displayName: location.displayName,
            locationUri: location.locationUri,
            uniqueId: location.locationUri,
            locationType: 'conferenceRoom',
            uniqueIdType: 'directory',
          },
          attendees: [
            {
              emailAddress: {
                address: location.locationUri,
                name: location.displayName
              },
              type: 'resource',
            }
          ],
          start: range.start,
          end: range.end,
        },
      })
      .then((data: any) => data.value)
  }

  getEvents(token: string, from: Date, to: Date): Promise<MicrosoftGraphEvent[]> {
    return this.requestService
      .get(`me/calendarview?startdatetime=${from.toUTCString()}&enddatetime=${to.toISOString()}&$select=organizer,start,end,location`, { token, skipCache: true })
      .then((data: any) => data.value)
  }
}
