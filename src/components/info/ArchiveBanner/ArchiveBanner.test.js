/* eslint-disable no-undef */
import React from 'react'
import ArchiveBanner from './ArchiveBanner'
import renderer from 'react-test-renderer'
import theme from '../../../js/mui/theme'
import { ThemeProvider } from '@material-ui/core/styles'
import { withPrefix } from 'gatsby'

describe('Archive Banner component:', () => {
  function MockedTheme ({ children }) {
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    )
  }

  it('Render success', () => {
    const tree = renderer
      .create(<MockedTheme><ArchiveBanner /></MockedTheme>)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
