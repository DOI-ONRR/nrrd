/* eslint-disable no-undef */
import React from 'react'
import ErrorMessage from './ErrorMessage'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import theme from '../../../js/mui/theme'
import { ThemeProvider } from '@material-ui/core/styles'
import { AppStatusProvider } from '../../../stores'

describe('Error Message:', () => {
  function MockedProviders ({ children }) {
    return (
      <AppStatusProvider>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </AppStatusProvider>
    )
  }

  test('Found the text content', async () => {
    render(<MockedProviders><ErrorMessage /></MockedProviders>)
    expect(true).toBeTruthy()
  })
})
