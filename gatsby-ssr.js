import React from 'react'
import fetch from 'isomorphic-fetch'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import 'typeface-lato'

import { MDXProvider } from '@mdx-js/react'
import * as CustomComponents from './.cache/components'
import CodeBlock from './src/components/pattern-library/CodeBlock/CodeBlock.js'

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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.GATSBY_HASURA_URI,
    headers: {},
    fetch,
    resolvers: {}
  }),
  connectToDevTools: true,
});

console.log("🚀 Apollo Client initializing in gatsby-ssr.js");

export const wrapRootElement = ({ element }) => {
  console.log("✅ Apollo Provider wrapping the root element in gatsby-ssr.js");
  return (
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
)}
