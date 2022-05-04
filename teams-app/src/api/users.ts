import { gql } from 'graphql-request'

import { graphClient } from '../request'
import { User } from '../types/User'

export type GetUserResult = {
  [key: string]: User
}

const GET_USER_SETTINGS_QUERY = gql`
  query GetCustomUserSettings {
    user {
      id
      settings {
        custom
      }
    }
  }
`

export const getCustomUserSettingsRequest = (): Promise<GetUserResult> => {
  return graphClient.request(GET_USER_SETTINGS_QUERY)
}

const GET_USERS_QUERY = gql`
  query GetUsers($name: String) {
    users(name: $name) {
      id
      objectId
      person {
        displayName
        department
        jobTitle
        profileImage
      }
      isAdmin
      settings {
        custom
      }
    }
  }
`

interface GetUsersParameters {
  name?: string
}

interface GetUsersResult {
  [key: string]: User[]
}

export const getUsersRequest = (parameters: GetUsersParameters): Promise<GetUsersResult> => {
  return graphClient.request(GET_USERS_QUERY, parameters)
}

const GET_ADMINS_QUERY = gql`
  query GetAdmins {
    admins {
      id
      objectId
      person {
        displayName
        department
        jobTitle
        profileImage
      }
    }
  }
`

export const getAdminsRequest = (): Promise<GetUsersResult> => {
  return graphClient.request(GET_ADMINS_QUERY)
}

const SET_CUSTOM_USER_SETTING_QUERY = gql`
  mutation setCustomUserSetting($objectId: String, $key: String!, $value: JSON!) {
    setCustomUserSetting(key: $key, value: $value, objectId: $objectId)
  }
`

interface SetCustomUserSettingRequestParameters {
  key: string
  value: JSONObject
  objectId?: string
}

export const setCustomUserSettingRequest = (parameters: SetCustomUserSettingRequestParameters) => {
  return graphClient.request(SET_CUSTOM_USER_SETTING_QUERY, parameters)
}

const ADD_FAVORITE_MUTATION = gql`
  mutation AddFavorite($user: String!) {
    addFavorite(user: $user) {
      id
      person {
        displayName
      }
    }
  }
`
interface AddFavoriteRequestParameters {
  user: string
}

export const addFavoriteRequest = (parameters: AddFavoriteRequestParameters) => {
  return graphClient.request(ADD_FAVORITE_MUTATION, parameters)
}

const REMOVE_FAVORITE_MUTATION = gql`
  mutation RemoveFavorite($user: String!) {
    removeFavorite(user: $user) {
      id
      person {
        displayName
      }
    }
  }
`
interface RemoveFavoriteRequestParameters {
  user: string
}

export const removeFavoriteRequest = (parameters: RemoveFavoriteRequestParameters) => {
  return graphClient.request(REMOVE_FAVORITE_MUTATION, parameters)
}

const GET_USER_QUERY = gql`
  query GetUser {
    user {
      id
      person {
        displayName
      }
      isAdmin
      settings {
        custom
      }
    }
  }
`

export const getUserRequest = (): Promise<GetUserResult> => {
  return graphClient.request(GET_USER_QUERY)
}
