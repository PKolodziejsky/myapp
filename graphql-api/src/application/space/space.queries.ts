import { PipelineStage } from 'mongoose'

export const createSpaceRootAggregation = (id: string, company: string): PipelineStage[] => [
  {
    $match: {
      _id: id,
      company,
    },
  },
  {
    $graphLookup: {
      from: 'spaces',
      startWith: '$_id',
      connectFromField: 'parent',
      connectToField: '_id',
      as: 'hierarchy',
      depthField: 'order',
    },
  },
  {
    $unwind: '$hierarchy',
  },
  {
    $replaceRoot: {
      newRoot: '$hierarchy',
    },
  },
  {
    $set: {
      id: '$_id',
    },
  },
  {
    $lookup: {
      from: 'media',
      localField: 'floorPlans',
      foreignField: '_id',
      as: 'floorPlans',
      pipeline: [
        {
          $set: {
            id: '$_id',
          },
        },
      ],
    },
  },
  {
    $sort: {
      order: -1,
    },
  },
]

export const createChildSpacesWithMeetingRoomAggregation = (companyId: string, parent: string | null) => [
  {
    $match: {
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
    $match: {
      parent,
      'childSpaces.kind': 'meetingRoom',
    },
  },
  {
    $group: {
      _id: '$_id',
      space: {
        $first: '$$ROOT',
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: '$space',
    },
  },
  {
    $set: {
      id: '$_id',
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
  {
    $lookup: {
      from: 'media',
      localField: 'floorPlans',
      foreignField: '_id',
      as: 'floorPlans',
      pipeline: [
        {
          $set: {
            id: '$_id',
          },
        },
      ],
    },
  },
]