import { PipelineStage } from 'mongoose'

interface BookingStatsAggregationRanges {
  from: string
  to: string
}

export const createBookingStatsAggregation = (user: string, company: string, ranges: BookingStatsAggregationRanges[]): PipelineStage[] => {
  const aggregation: PipelineStage[] = [
    {
      $match: {
        company,
        ...(user ? { user } : {}),
      },
    },
  ]

  const facets: Record<string, PipelineStage.FacetPipelineStage[]> = {}
  const indices: unknown[] = []

  ranges.forEach(({ from, to }, index) => {
    facets[`facet_${index}`] = [
      {
        $match: {
          date: {
            $gte: from,
            $lt: to,
          },
        },
      },
      {
        $project: {
          start: from,
          end: to,
        },
      },
      {
        $group: {
          _id: `${index}`,
          from: {
            $first: '$start',
          },
          to: {
            $first: '$end',
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]

    indices.push({
      $ifNull: [
        {
          $first: `$facet_${index}`,
        },
        null,
      ],
    })
  })

  aggregation.push({
    $facet: facets,
  })

  aggregation.push({
    $project: {
      ranges: indices,
    },
  })

  return aggregation
}
