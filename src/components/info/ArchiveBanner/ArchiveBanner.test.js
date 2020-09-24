/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import theme from '../../../js/mui/theme'
import { ThemeProvider } from '@material-ui/core/styles'

import ArchiveBanner from './ArchiveBanner'

describe('Archive Banner:', () => {
  function MockedTheme ({ children }) {
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    )
  }

  test('Found the text content', async () => {
    render(<MockedTheme><ArchiveBanner /></MockedTheme>)
    expect(screen.getByText('This content was created', { exact: false })).toBeInTheDocument()
  })

  test('Found the USEITI glossary term', async () => {
    render(<MockedTheme><ArchiveBanner /></MockedTheme>)
    expect(screen.getByTitle('Extractive Industries', { exact: false })).toBeInTheDocument()
  })
})
