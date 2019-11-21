import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { client } from './client'

import { GlossaryProvider } from '../../src/glossaryContext'

// https://react-theming.github.io/create-mui-theme/
// https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=5c737f&secondary.color=cde3c3
const theme = createMuiTheme({
  palette: {
    primary: { main: '#5c737f' },
    secondary: { main: '#f0f6fa' }
  },
  typography: {
    h1: {
      fontSize: '2.125rem',
      fontWeight: '400'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: '400'
    }
  }
})

export const wrapRootElement = ({ element }) => (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlossaryProvider>
          {element}
        </GlossaryProvider>
      </ThemeProvider>
    </ApolloProvider>
);
