import { setConfig } from 'react-hot-loader'
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import React from 'react'
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

const debugLink = new ApolloLink((operation, forward) => {
  console.log("📡 Apollo is executing query:", operation.operationName);
  console.log("🔗 Apollo request:", operation);
  return forward(operation).map(response => {
    console.log("📡 Apollo received response:", response);
    return response;
  });
});

const client = new ApolloClient({
  link: ApolloLink.from([
    debugLink, // Add debugging before sending the request
    new HttpLink({
      uri: 'https://hasura-sandbox.app.cloud.gov/v1/graphql',
      fetchOptions: { mode: 'no-cors' }, // Ensure fetch works
    }),
  ]),
  cache: new InMemoryCache(),
});

console.log("🚀 Apollo Client initialized in gatsby-browser.js");

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    'This application has been updated. ' +
      'Reload to display the latest version?'
  )

  if (answer === true) {
    window.location.reload()
  }
}

export const onClientEntry = async () => {
  if (typeof IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }
}

// Remove hot loader warning in browser
setConfig({
  showReactDomPatchNotification: false
})

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

export const wrapRootElement = ({ element }) => {
  console.log("✅ wrapRootElement is running in gatsby-browser.js");
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
  )
}