import { Toast } from '@seatti-tech/lithium'
import React from 'react'

export type SuccessToastProps = {
  children: string
}

export const SuccessToast = ({ children }: SuccessToastProps) => {
  return <Toast variant='success' className='w-full md:w-fit' message={children} />
}
