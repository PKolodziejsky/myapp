import './index.css'

import React from 'react'
import { render } from 'react-dom'

import { Application } from './Application'

const root = document.getElementById('root')

if (root) {
  render(<Application />, root)
}
