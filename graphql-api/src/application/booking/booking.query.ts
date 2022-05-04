import { PipelineStage } from 'mongoose'

interface BookingsByDateAggregationOptions {
  from: string
  to: string
  user?: string
  company: string
  teamFilter?: string[]
  spaceFilter?: string[]
  favoriteFilter?: string[] | null
}

export const createBookingsByDateAggregation = ({
  from,
  to,
  company,
  user,
  spaceFilter,
  teamFilter,
  favoriteFilter,
}: BookingsByDateAggregationOptions) => {
  const match: Record<string, unknown> = {}

  const aggregation: PipelineStage[] = [
    {
      $match: {
        date: {
          $gte: from,
          $lte: to,
        },
        ...(favoriteFilter && { user: { $in: favoriteFilter } }),
        company,
        ...(user && { user }),
        ...(!user && {
            guestInfo: null,
            isAnonymous: {
              $ne: true
            }
          }
        ),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'resolved_user',
      },
    }
  ]

  match['resolved_user'] = { $ne: [] }

  if (spaceFilter && spaceFilter.length > 0) {
    aggregation.push({
      $graphLookup: {
        from: 'spaces',
        startWith: '$space',
        connectFromField: 'parent',
        connectToField: '_id',
        as: 'resolved_hierarchy',
      },
    })

    match['resolved_hierarchy._id'] = { $in: spaceFilter }
  }

  if (teamFilter && teamFilter.length > 0) {
    match['resolved_user.objectId'] = { $in: teamFilter }
  }

  aggregation.push({
    $match: match,
  })

  aggregation.push({
    $set: {
      id: '$_id',
    },
  })

  aggregation.push({
    $unset: ['resolved_hierarchy', 'resolved_user'],
  })

  return aggregation
}
