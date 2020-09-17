/* eslint-disable no-undef */
import React from 'react'
import GlossaryTerm from './GlossaryTerm'
import { create } from 'react-test-renderer'
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

  test('Match snapshot', () => expect(create(<MockedTheme><GlossaryTerm>EITI Standard</GlossaryTerm></MockedTheme>).toJSON()).toMatchSnapshot())
})
