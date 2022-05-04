import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MEETING_ROOM_MODEL_NAME, MeetingRoomDocument } from '../../models/meeting-room.schema'
import { Model } from 'mongoose'
import { UserDocument } from '../../models/user.model'
import {
  CreateChildSpacesAggregationType,
  CreateMeetingRoomBookingData,
  FindMeetingRoomsData,
  GetMeetingRoomBookingsData,
  MeetingRoom,
} from './meeting-room.interface'
import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service'
import { createMeetingRoomChildrenAggregation, createMeetingRoomAggregation } from './meeting-room.aggregation'
import { toDocumentId } from '../../utilities/document'
import {MicrosoftGraphEvent, MicrosoftGraphMeetingRoom, Person} from '../microsoft-graph/microsoft-graph.interface'
import { Space } from './space.interface'
import { WORKSPACE_MODEL_NAME, WorkspaceDocument } from '../../models/workspace.schema'
import {GraphQLError} from "../../error/graphql.error";
import * as dayjs from "dayjs";

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectModel(WORKSPACE_MODEL_NAME) private readonly workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(MEETING_ROOM_MODEL_NAME) private readonly meetingRoomModel: Model<MeetingRoomDocument>,
    private readonly microsoftGraphService: MicrosoftGraphService,
  ) {}

  async getById(user: UserDocument, token: string, id: string) {
    let remoteMeetingRooms = await this.microsoftGraphService.meetingRooms(token)

    const meetingRooms = await this.meetingRoomModel.aggregate<CreateChildSpacesAggregationType>(createMeetingRoomAggregation(toDocumentId(user.company), [id]))

    if (meetingRooms) {
      const [room] = this.mergedRooms(user, meetingRooms, remoteMeetingRooms)

      return room
    }

    return null
  }

  async findMeetingRooms(user: UserDocument, token: string, data: FindMeetingRoomsData) {
    let meetingRooms = await this.microsoftGraphService.meetingRooms(token)

    const { minCapacity, filterByDisplayDevice, filterByAudioDevice, filterByVideoDevice, isWheelChairAccessible  } = data

    if (minCapacity) {
      meetingRooms = meetingRooms.filter((meetingRoom) => meetingRoom.capacity >= minCapacity)
    }

    if (filterByDisplayDevice) {
      meetingRooms = meetingRooms.filter((meetingRoom) => meetingRoom.displayDeviceName != null)
    }

    if (filterByAudioDevice) {
      meetingRooms = meetingRooms.filter((meetingRoom) => meetingRoom.audioDeviceName != null)
    }

    if (filterByVideoDevice) {
      meetingRooms = meetingRooms.filter((meetingRoom) => meetingRoom.videoDeviceName != null)
    }

    if (isWheelChairAccessible) {
      meetingRooms = meetingRooms.filter((meetingRoom) => meetingRoom.isWheelChairAccessible)
    }

    const name = data.name

    if (name) {
      meetingRooms = meetingRooms.filter((meetingRoom) => meetingRoom.displayName.toLowerCase().includes(name.toLowerCase()))
    }

    const childSpaces = data.space
      ? await this.workspaceModel.aggregate<CreateChildSpacesAggregationType>(createMeetingRoomChildrenAggregation(data.space, toDocumentId(user.company)))
      : await this.meetingRoomModel.aggregate<CreateChildSpacesAggregationType>(createMeetingRoomAggregation(toDocumentId(user.company)))

    const matchedMeetingRooms = this.mergedRooms(user, childSpaces, meetingRooms)

    if (matchedMeetingRooms.length === 0) {
      return []
    }

    const emailAddresses = matchedMeetingRooms.map((meetingRoom) => meetingRoom.emailAddress)
    const schedules = await this.microsoftGraphService.schedule(token, emailAddresses, data.dateTimeRange)

    matchedMeetingRooms.sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1
      }

      const aCapacity = a.capacity ?? 65_536
      const bCapacity = b.capacity ?? 65_536

      if (aCapacity !== bCapacity) {
        return aCapacity - bCapacity
      }

      return a.name.localeCompare(b.name)
    })

    return matchedMeetingRooms.map((meetingRoom) => {
      const meetingRoomSchedule = schedules.find((schedules) => schedules.scheduleId === meetingRoom.emailAddress)
      let isAvailable = false

      if (meetingRoomSchedule) {
        isAvailable = meetingRoomSchedule.availabilityView.split('').every(item => item === '0')
      }

      return {
        isAvailable,
        room: meetingRoom,
      }
    })
  }

  async createMeetingRoomBooking(user: UserDocument, token: string, data: CreateMeetingRoomBookingData) {
    const meetingRoom = await this.meetingRoomModel.findById(data.room)

    if (!meetingRoom) {
      throw new GraphQLError('Meeting room not found', 'MEETING_ROOM_NOT_FOUND')
    }

    const emailAddress = meetingRoom.emailAddress
    const meetingRoomUser: Person = await this.microsoftGraphService.person(token, emailAddress)

    await this.microsoftGraphService.createEvent(token, data.dateTimeRange, data.subject, {
      displayName: meetingRoomUser.displayName,
      locationUri: emailAddress,
    })

    return true
  }

  async getMeetingRoomBookings(user: UserDocument, token: string, date: GetMeetingRoomBookingsData) {
    const meetingRooms = await this.microsoftGraphService.meetingRooms(token)
    const profile = await this.microsoftGraphService.me(token)

    const from = dayjs(date.date).startOf('day').toDate()
    const to = dayjs(date.date).endOf('day').toDate()

    const roomMails = meetingRooms.map(meetingRoom => meetingRoom.emailAddress)

    const companyMeetingRooms = await this.meetingRoomModel.aggregate<CreateChildSpacesAggregationType>(createMeetingRoomAggregation(toDocumentId(user.company)))

    const merged = this.mergedRooms(user, companyMeetingRooms, meetingRooms)

    const events = await this.microsoftGraphService.getEvents(token, from, to)

    let eventRooms: [MicrosoftGraphEvent, MeetingRoom][] = events
      .filter(event => event.organizer.emailAddress.address === profile.mail)
      .filter(event => event.location.locationType === 'conferenceRoom' && roomMails.includes(event.location.uniqueId))
      .map(event => [event, merged.find(meetingRoom => meetingRoom.emailAddress === event.location.uniqueId) as MeetingRoom])

    eventRooms = eventRooms.filter(([,room]) => room !== null)

    return eventRooms.map(([event, room]) => ({
      dateTimeRange: {
        start: event.start,
        end: event.end,
      },
      room,
    }))
  }

  async getFavoriteMeetingRooms (user: UserDocument, token: string) {
    const meetingRooms = await this.microsoftGraphService.meetingRooms(token)

    if (!user.favoriteMeetingRooms || user.favoriteMeetingRooms.length === 0) {
      return []
    }

    const rooms = await this.meetingRoomModel.aggregate<CreateChildSpacesAggregationType>(createMeetingRoomAggregation(toDocumentId(user.company), user.favoriteMeetingRooms))

    return this.mergedRooms(user, rooms, meetingRooms)
  }

  mergedRooms (user: UserDocument, spaces: CreateChildSpacesAggregationType[], meetingRooms: MicrosoftGraphMeetingRoom[]) {
    return spaces
      .filter((childSpace) => !childSpace.disabled)
      .map<[CreateChildSpacesAggregationType, MicrosoftGraphMeetingRoom | undefined]>((childSpace) => [
        childSpace,
        meetingRooms.find((meetingRoom) => meetingRoom.emailAddress === childSpace.emailAddress),
      ])
      .filter(([, meetingRoom]) => meetingRoom !== undefined)
      .map<MeetingRoom>(([meetingRoomSpace, meetingRoom]) => {
        const rootPath = meetingRoomSpace.rootPath
        rootPath.sort((a, b) => b.order - a.order)
        const path = rootPath.map<Space>((rootPath) => ({
          ...rootPath,
          id: rootPath._id,
        }))

        path.pop()

        return {
          id: meetingRoomSpace._id,
          name: meetingRoom!.displayName,
          capacity: meetingRoom!.capacity,
          emailAddress: meetingRoom!.emailAddress,
          rootPath: path,
          videoDeviceName: meetingRoom!.videoDeviceName,
          audioDeviceName: meetingRoom!.audioDeviceName,
          displayDeviceName: meetingRoom!.displayDeviceName,
          isWheelChairAccessible: meetingRoom!.isWheelChairAccessible,
          isFavorite: user.favoriteMeetingRooms?.includes(meetingRoomSpace._id) ?? false
        }
      })
  }
}
