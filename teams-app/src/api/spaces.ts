import { gql } from 'graphql-request'

import { graphClient } from '../request'
import { Space } from '../types'

interface GetSpacesRequestResult {
  [key: string]: Space[]
}

export const GET_SPACE_CHILDREN_WITH_STATUS_QUERY = gql`
  query spaceChildren($id: String, $onlyWithMeetingRoomsAsChildren: Boolean, $date: String!) {
    spaceChildren(id: $id, onlyWithMeetingRoomsAsChildren: $onlyWithMeetingRoomsAsChildren) {
      id
      name
      parent
      capacity
      hasChildren
      labels
      canHaveNote
      isAccessible
      floorPlans {
        id
      }
      disabled
      status(date: $date) {
        date
        occupation
        users {
          id
          person {
            displayName
            profileImage
          }
        }
      }
    }
  }
`

interface GetSpaceChildrenRequestParameters {
  id?: string | null
  date?: string
  onlyWithMeetingRoomsAsChildren?: boolean
}

export const getSpaceChildrenWithStatusRequest = (parameters: GetSpaceChildrenRequestParameters): Promise<GetSpacesRequestResult> => {
  return graphClient.request(GET_SPACE_CHILDREN_WITH_STATUS_QUERY, parameters)
}

export const GET_ROOT_PATH_QUERY = gql`
  query getRootPath($id: String!) {
    spaceRootPath(id: $id) {
      id
      name
      parent
      floorPlans {
        id
      }
      disabled
      isAccessible
      hasChildren
      canHaveNote
      labels
    }
  }
`

interface GetSpaceRootPathParamters {
  id: string
}

interface GetSpaceRootPathResult {
  [spaceRootPath: string]: Space[]
}

export const getSpaceRootPathRequest = (parameters: GetSpaceRootPathParamters): Promise<GetSpaceRootPathResult> => {
  return graphClient.request(GET_ROOT_PATH_QUERY, parameters)
}

export const TOGGLE_DISABLE_SPACE_QUERY = gql`
  mutation toggleDisableSpace($id: String!) {
    toggleDisableSpace(id: $id) {
      name
      id
    }
  }
`

interface ToggleDisableSpaceRequestParameters {
  id: string
}

export const toggleDisableSpaceRequest = (parameters: ToggleDisableSpaceRequestParameters) => {
  return graphClient.request(TOGGLE_DISABLE_SPACE_QUERY, parameters)
}

export const UPDATE_SPACE_QUERY = gql`
  mutation updateSpace($id: String!, $name: String!) {
    updateSpace(id: $id, name: $name)
  }
`

interface UpdateSpaceRequestParameters {
  id: string
  name: string
}

export const updateSpaceRequest = (parameters: UpdateSpaceRequestParameters) => {
  return graphClient.request(UPDATE_SPACE_QUERY, parameters)
}

export const REMOVE_DESK_LABEL_QUERY = gql`
  mutation removeDeskLabel($id: String!, $index: Float!) {
    removeDeskLabel(id: $id, index: $index)
  }
`

interface RemoveDeskLabelRequestParameters {
  id: string
  index: number
}

export const removeDeskLabelRequest = (parameters: RemoveDeskLabelRequestParameters) => {
  return graphClient.request(REMOVE_DESK_LABEL_QUERY, parameters)
}

export const ADD_DESK_LABEL_QUERY = gql`
  mutation addDeskLabel($id: String!, $label: String!) {
    addDeskLabel(id: $id, label: $label)
  }
`

interface AddDeskLabelRequestParameters {
  id: string
  label: string
}

export const addDeskLabelRequest = (parameters: AddDeskLabelRequestParameters) => {
  return graphClient.request(ADD_DESK_LABEL_QUERY, parameters)
}

export const GET_SPACE_CHILDREN_QUERY = gql`
  query spaceChildren($id: String, $onlyWithMeetingRoomsAsChildren: Boolean) {
    spaceChildren(id: $id, onlyWithMeetingRoomsAsChildren: $onlyWithMeetingRoomsAsChildren) {
      id
      name
      parent
      capacity
      hasChildren
      labels
      canHaveNote
      isAccessible
      floorPlans {
        id
      }
      disabled
    }
  }
`

export const getSpaceChildrenRequest = (parameters: GetSpaceChildrenRequestParameters): Promise<GetSpacesRequestResult> => {
  return graphClient.request(GET_SPACE_CHILDREN_QUERY, parameters)
}
