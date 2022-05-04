import { Button } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'

export type ButtonAlignment = 'vertical' | 'horizontal'

export type MessageType = 'info' | 'error' | 'success'

export type MessageProps = {
  animation: React.ReactNode
  header: string
  subheader?: string
  cancelButtonLabel?: string
  submitButtonLabel?: string
  onCancel?: () => void
  onSubmit?: () => void
  buttonAlignment?: ButtonAlignment
  messageType?: MessageType
  className?: string
}

export const Message = ({
  onCancel,
  onSubmit,
  animation,
  header,
  subheader,
  cancelButtonLabel,
  submitButtonLabel,
  buttonAlignment = 'horizontal',
  messageType = 'info',
  className,
}: MessageProps) => (
  <div
    className={classNames(
      'flex flex-col justify-center items-center break-words text-center p-8 w-full h-full md:w-[588px] md:h-[430px] space-y-8',
      className,
    )}
  >
    {animation}
    <div className='flex flex-col space-y-2 items-center text-center'>
      <p
        className={classNames({
          'text-h5 text-success-400 dark:text-success-200': messageType === 'success',
          'text-h3': messageType !== 'success',
        })}
      >
        {header}
      </p>
      {subheader && <p className='text-md text-grey-600 dark:text-grey-500'>{subheader}</p>}
    </div>
    {(cancelButtonLabel || submitButtonLabel) && (
      <div
        className={classNames('flex space-y-2 items-center', {
          'flex-col': buttonAlignment === 'vertical',
          'justify-center flex-row-reverse w-[300px] px-7 gap-x-4': buttonAlignment === 'horizontal',
        })}
      >
        {submitButtonLabel && <Button onClick={onSubmit}>{submitButtonLabel}</Button>}
        {cancelButtonLabel &&
          (messageType === 'error' ? (
            <button className='text-purple-600 text-[13px] font-semibold mt-4' onClick={onCancel}>
              {cancelButtonLabel}
            </button>
          ) : (
            <Button variant='secondary' onClick={onCancel}>
              {cancelButtonLabel}
            </Button>
          ))}
      </div>
    )}
  </div>
)
