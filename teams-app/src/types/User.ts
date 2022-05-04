import { DatesView } from './DatesView'
import { MeetingRoom } from './MeetingRoom'

export type Person = {
  id?: string
  displayName?: string
  profileImage?: string
  jobTitle?: string
  department?: string
}

export enum CustomUserSetting {
  TeamFilter = 'teamsFilter',
  SpaceFilter = 'spaceFilter',
  FavoriteFilter = 'favoriteFilter',
  NotesBySpaces = 'notesBySpaces',
  Language = 'language',
  ProductTourShown = 'productTourShown',
  PlanningView = 'planningView',
  MeetupView = 'meetupView',
}

export type CustomUserSettings = {
  [CustomUserSetting.TeamFilter]?: string[]
  [CustomUserSetting.SpaceFilter]?: string[]
  [CustomUserSetting.FavoriteFilter]?: boolean | null
  [CustomUserSetting.NotesBySpaces]?: unknown
  [CustomUserSetting.Language]?: string
  [CustomUserSetting.ProductTourShown]?: boolean
  [CustomUserSetting.PlanningView]?: DatesView
  [CustomUserSetting.MeetupView]?: DatesView
}

export type UserSettings = {
  custom: CustomUserSettings
}

export type User = {
  id: string
  objectId?: string
  isFavorite?: boolean
  person?: Person
  isAdmin?: boolean
  settings?: UserSettings
  favoriteMeetingRooms?: MeetingRoom[]
  favorites?: User[]
}
