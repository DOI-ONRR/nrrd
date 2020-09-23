import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
// Import font
import 'typeface-lato'

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
import {
  AppStatusProvider,
  DownloadProvider
} from './src/stores'

import ErrorBoundary from './src/components/ErrorBoundary'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './src/js/mui/theme'

/**
 * Custom components comes from the cache file we create when gatsby runs its build process
 */
const mdxComponents = {
  pre: props => <div {...props} />,
  p: props => <div {...props} />,
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
        <AppStatusProvider>
          <DownloadProvider>
            <MDXProvider components={ mdxComponents }>
              {element}
            </MDXProvider>
          </DownloadProvider>
        </AppStatusProvider>
      </ApolloProvider>
    </ThemeProvider>
  </ErrorBoundary>
)
