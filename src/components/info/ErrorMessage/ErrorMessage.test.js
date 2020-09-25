/* eslint-disable no-undef */
import React, { useContext } from 'react'
import ErrorMessage from './ErrorMessage'

import '@testing-library/jest-dom/extend-expect'
import { render, act, screen, fireEvent } from 'test-utils'
import { renderHook } from '@testing-library/react-hooks'

import { AppStatusContext } from '../../../stores/app-status-store'

describe('Error Message:', () => {
  test('Displays when error dispatched to App Status Context', async () => {
    const { result } = renderHook(() => useContext(AppStatusContext))

    act(() => {
      result.current.isError = true
      result.current.message = 'Test error'
    })

    render(<ErrorMessage />)

    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  test('Error dialog closes', async () => {
    const { result } = renderHook(() => useContext(AppStatusContext))

    act(() => {
      result.current.isError = true
      result.current.message = 'Test error'
    })

    render(<ErrorMessage />)

    expect(screen.getByText('Test error')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('Test error')).not.toBeInTheDocument()
  })
})
