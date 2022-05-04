import React from 'react'
import { Step } from 'react-joyride'

import { AddBookingTourContent } from './AddBookingTourContent'
import { CopyBookingsTourContent } from './CopyBookingsTourContent'
import { DatesNavigationAllocationsTourContent } from './DatesNavigationAllocationsTourContent'
import { DatesViewTourContent } from './DatesViewTourContent'
import { IntroTourContent } from './IntroTourContent'
import { MenuTourContent } from './MenuTourContent'

export const steps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    content: <IntroTourContent />,
    hideFooter: true,
  },
  {
    target: '[data-tour="change-view"]',
    title: 'product-tour.new-daily-view',
    content: <DatesViewTourContent />,
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="menu"]',
    title: 'product-tour.your-settings',
    content: <MenuTourContent />,
    spotlightPadding: 0,
  },
  {
    target: '[data-tour="allocations-0"]',
    title: 'product-tour.your-bookings',
    content: <DatesNavigationAllocationsTourContent />,
    spotlightPadding: 4,
  },
  {
    target: '[data-tour="copy-last-week"]',
    title: 'product-tour.save-time',
    content: <CopyBookingsTourContent />,
    spotlightPadding: 0,
  },
  {
    target: '[data-tour="add-booking"]:first-child',
    title: 'product-tour.add-bookings',
    content: <AddBookingTourContent />,
    spotlightPadding: 8,
  },
]
