import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { ThemeProvider } from '@material-ui/core/styles'
import { client } from './client'

import theme from '../js/mui/theme'

import { GlossaryProvider } from '../../src/glossaryContext'

export const wrapRootElement = ({ element }) => (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlossaryProvider>
          {element}
        </GlossaryProvider>
      </ThemeProvider>
    </ApolloProvider>
)
