import { FailAnimation } from '@seatti-tech/lithium'
import React, { ReactNode } from 'react'

interface ErrorLayoutProps {
  title: string
  description?: string
  children?: ReactNode
}

export const ErrorLayout = ({ title, description, children }: ErrorLayoutProps) => (
  <main className='w-full md:w-[780px] md:mx-auto min-h-screen px-4 md:px-0 py-2 md:py-10 mx-auto md:space-y-10 flex flex-col space-y-8 items-center justify-center'>
    <FailAnimation />
    <div className='flex flex-col space-y-2 items-center text-center'>
      <h1 className='font-semibold text-h3'>{title}</h1>
      {description && <p className='text-base text-grey-600'>{description}</p>}
    </div>
    {children && <div className='flex flex-col space-y-2 items-center'>{children}</div>}
  </main>
)
