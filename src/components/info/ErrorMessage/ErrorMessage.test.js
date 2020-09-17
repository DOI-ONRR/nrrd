/* eslint-disable no-undef */
import React from 'react'
import ErrorMessage from './ErrorMessage'
import { create } from 'react-test-renderer'
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

  test('Match snapshot', () => expect(create(<MockedProviders><ErrorMessage /></MockedProviders>).toJSON()).toMatchSnapshot())
})
