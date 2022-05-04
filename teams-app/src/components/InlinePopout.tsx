import classNames from 'classnames'
import React from 'react'
import { ReactNode, createRef, useEffect, useState } from 'react'

interface InlinePopoutProps {
  alignment?: 'left' | 'center' | 'right'
  selector: ReactNode
  selectorClassName?: ReactNode
  isOpen?: boolean
  popout: ReactNode
  popoutClassName?: string
  popoutOffset?: number
  className?: string
}

const MARGIN_BETWEEN_SELECTOR_AND_POPOUT = 16

export const InlinePopout = ({
  alignment = 'right',
  selector,
  selectorClassName,
  isOpen,
  popout,
  popoutClassName,
  popoutOffset = 0,
  className,
}: InlinePopoutProps) => {
  const selectorRef = createRef<HTMLElement>()
  const [selectorHeight, setSelectorHeight] = useState<number>(0)

  useEffect(() => {
    if (selectorRef.current) setSelectorHeight(selectorRef.current?.offsetHeight)
  }, [selectorRef])

  const offset = (popoutOffset > 0 ? popoutOffset - selectorHeight : 0) + MARGIN_BETWEEN_SELECTOR_AND_POPOUT

  const popoutRef = createRef<HTMLElement>()
  const [popoutHeight, setPopoutHeight] = useState<number>()

  useEffect(() => {
    if (popoutRef.current) setPopoutHeight(popoutRef.current?.offsetHeight)
  }, [popoutRef])

  const Selector = () => (
    <span className={classNames('h-fit', selectorClassName)} ref={selectorRef}>
      {selector}
    </span>
  )

  const Popout = () => (
    <div
      className='relative'
      style={{
        marginTop: `${isOpen ? offset : 0}px`,
      }}
    >
      <span
        className={classNames(
          'absolute',
          {
            'top-0 left-0': alignment === 'left',
            'inset-0': alignment === 'center',
            'top-0 right-0': alignment === 'right',
          },
          popoutClassName,
        )}
        ref={popoutRef}
      >
        {popout}
      </span>
    </div>
  )

  return (
    <div
      className={classNames(
        'flex flex-col',
        {
          'items-start': alignment === 'left',
          'items-center': alignment === 'center',
          'items-end': alignment === 'right',
        },
        className,
      )}
      style={{
        marginBottom: `${isOpen ? popoutHeight : 0}px`,
      }}
    >
      <Selector />
      {isOpen && <Popout />}
    </div>
  )
}
