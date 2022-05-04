import { SkeletonEmployeeCard } from '@seatti-tech/lithium'
import React from 'react'

export const MeetupSkeleton = () => (
  <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
    {Array.from(Array(4)).map((_, index) => (
      <li key={index}>
        <SkeletonEmployeeCard />
      </li>
    ))}
  </ul>
)
