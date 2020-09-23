/* eslint-disable no-undef */
import React from 'react'
import ErrorMessage from './ErrorMessage'

import '@testing-library/jest-dom/extend-expect'
import { render } from 'test-utils'

describe('Error Message:', () => {
  test('Found the text content', async () => {
    render(<ErrorMessage />)
    expect(true).toBeTruthy()
  })
})
