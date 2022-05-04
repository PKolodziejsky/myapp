import { PipelineStage } from 'mongoose'
import { SpaceType } from '../../types/space'

export const createMeetingRoomChildrenAggregation = (spaceId: string | undefined, companyId: string): PipelineStage[] => [
  {
    $match: {
      _id: spaceId,
      company: companyId,
    },
  },
  {
    $graphLookup: {
      from: 'spaces',
      startWith: '$_id',
      connectFromField: '_id',
      connectToField: 'parent',
      as: 'childSpaces',
    },
  },
  {
    $unwind: {
      path: '$childSpaces',
    },
  },
  {
    $replaceRoot: {
      newRoot: '$childSpaces',
    },
  },
  {
    $match: {
      kind: SpaceType.MeetingRoom,
    },
  },
  {
    $graphLookup: {
      from: 'spaces',
      startWith: '$_id',
      connectFromField: 'parent',
      connectToField: '_id',
      as: 'rootPath',
      depthField: 'order',
    },
  },
]

export const createMeetingRoomAggregation = (companyId: string, ids?: string[]): PipelineStage[] => [
  {
    $match: {
      company: companyId,
      ...(ids ? { _id: { $in: ids } } : {}),
    },
  },
  {
    $graphLookup: {
      from: 'spaces',
      startWith: '$_id',
      connectFromField: 'parent',
      connectToField: '_id',
      as: 'rootPath',
      depthField: 'order',
    },
  },
]
