/* eslint-disable no-undef */
import React from 'react'
import ErrorMessage from './ErrorMessage'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from 'test-utils'

// Mocks the initial state of the AppStatusContext
jest.mock('../../../stores/app-status-store/reducers', () => ({
  get initialState () {
    return {
      isError: true,
      message: 'Test error'
    }
  },
  get types () {
    return {}
  },
  reducer () {
    return {}
  }
}))

describe('Error Message:', () => {
  test('Displays when error dispatched to App Status Context', async () => {
    render(<ErrorMessage />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })
  test('Error dialog closes', async () => {
    render(<ErrorMessage />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.queryByText('Test error')).not.toBeInTheDocument()
  })
})
