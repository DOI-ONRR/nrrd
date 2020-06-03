import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'

import { MDXProvider } from '@mdx-js/react'
import * as CustomComponents from './.cache/components'
import CodeBlock from './src/components/layouts/CodeBlock/CodeBlock.js'

import {
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Hidden
} from '@material-ui/core'

import { client } from './src/apollo/client'
import { StoreProvider } from './src/store'
import {
  AppStatusProvider,
  DataFilterProvider
} from './src/stores'

import ErrorBoundary from './src/components/ErrorBoundary'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './src/js/mui/theme'

const mdxComponents = {
  pre: props => <div {...props} />,
  code: CodeBlock,
  a: CustomComponents.Link,
  ...CustomComponents,
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Hidden
}

export const wrapRootElement = ({ element }) => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <DataFilterProvider>
          <StoreProvider>
            <AppStatusProvider>
              <MDXProvider components={ mdxComponents }>
                {element}
              </MDXProvider>
            </AppStatusProvider>
          </StoreProvider>
        </DataFilterProvider>
      </ApolloProvider>
    </ThemeProvider>
  </ErrorBoundary>
)
