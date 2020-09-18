/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react'

import GlossaryTerm from './GlossaryTerm'
import theme from '../../js/mui/theme'
import { ThemeProvider } from '@material-ui/core/styles'

describe('Glossary Term:', () => {
  function MockedTheme ({ children }) {
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    )
  }

  test('Glossary Term rendered successfully', () => {
    render(<MockedTheme><GlossaryTerm>8(g)</GlossaryTerm></MockedTheme>)
    expect(screen.getByTitle('The 8(g) zone', { exact: false })).toBeInTheDocument()
  })

  test('Hovering on glossary term removes title attribute to display the tooltip', async () => {
    render(<MockedTheme><GlossaryTerm>GOMESA</GlossaryTerm></MockedTheme>)
    expect(screen.getByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false })).toBeInTheDocument()
    fireEvent.mouseOver(screen.getByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false }))
    expect(screen.queryByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false })).not.toBeInTheDocument()
  })
})
