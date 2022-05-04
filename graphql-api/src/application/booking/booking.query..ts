import { PipelineStage } from 'mongoose'

export const createLastBookingAggregation = (space: string, user: string, isGuestBooking: boolean): PipelineStage[] => [
  {
    $match: {
      _id: `${space}`,
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
    $addFields: {
      childSpaces: {
        $concatArrays: ['$childSpaces', ['$$ROOT']],
      },
    },
  },
  {
    $lookup: {
      from: 'bookings',
      let: {
        childSpaces: '$childSpaces._id',
      },
      pipeline: [
        {
          $match: {
            $and: [
              {
                $expr: {
                  $in: ['$space', '$$childSpaces'],
                },
              },
              {
                $expr: {
                  $eq: ['$user', `${user}`],
                },
              },
            ],
          },
        },
        {
          $match: {
            guestInfo: {
              [isGuestBooking ? '$ne' : '$eq']: null,
            },
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $limit: 1,
        },
      ],
      as: 'bookings',
    },
  },
  {
    $project: {
      lastBooking: {
        $first: '$bookings',
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $ifNull: ['$lastBooking', {}],
      },
    },
  },
  {
    $addFields: {
      id: '$_id',
    },
  },
]
