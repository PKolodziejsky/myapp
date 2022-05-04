import React, { useState } from 'react'

import { Booking, Space } from '../../../types'
import { Dropdown } from './Dropdown'
import { Note } from './Note'

interface FormProps {
  rootPath: Space[]
  date: Date
  onNoteUpdate?: (note: string | null) => void
  defaultNote?: string
  onSelectSpace?: (space: Space) => void
  onCancel: () => void
  setSpaceError?: (err: string | null) => void
  spaceError: string | null
  lastBooking?: Booking
}
export const Form = ({ rootPath, onNoteUpdate, defaultNote, onSelectSpace, ...props }: FormProps) => {
  const [openFloorplanSpaceId, setOpenFloorplanSpaceId] = useState<string | null>(null)

  return (
    <ul className='w-full md:w-[572px] flex flex-col space-y-1 md:space-y-6 p-4'>
      {rootPath.map(
        (space, index) =>
          (space.canHaveNote || space.hasChildren) && (
            <li className='w-full flex flex-col space-y-3' key={space.id}>
              {(space.canHaveNote && <Note onNoteUpdate={onNoteUpdate} defaultValue={defaultNote} />) ||
                (space.hasChildren && (
                  <Dropdown
                    space={space}
                    openFloorplanSpaceId={openFloorplanSpaceId}
                    setOpenFloorplanSpaceId={setOpenFloorplanSpaceId}
                    defaultSelection={rootPath[index + 1]}
                    onSelect={onSelectSpace}
                    isLeaf={index + 1 === rootPath.length - 1}
                    {...props}
                  />
                ))}
            </li>
          ),
      )}
    </ul>
  )
}
