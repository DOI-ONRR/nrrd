/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '../../../__test_utils__/test-utils'

import GlossaryTerm from './GlossaryTerm'
import theme from '../../js/mui/theme'
import { ThemeProvider } from '@material-ui/core/styles'

describe('Glossary Term:', () => {
  test('Glossary Term rendered successfully', () => {
    render(<GlossaryTerm>8(g)</GlossaryTerm>)
    expect(screen.getByTitle('The 8(g) zone', { exact: false })).toBeInTheDocument()
  })

  test('Hovering on glossary term removes title attribute to display the tooltip', async () => {
    render(<GlossaryTerm>GOMESA</GlossaryTerm>)
    expect(screen.getByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false })).toBeInTheDocument()
    fireEvent.mouseOver(screen.getByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false }))
    expect(screen.queryByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false })).not.toBeInTheDocument()
  })
})
