import { setConfig } from 'react-hot-loader'
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

import { QueryParamProvider } from 'use-query-params'
import { WindowAdapter } from './src/js/utils/WindowAdapter'

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
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <AppStatusProvider>
          <DownloadProvider>
            <QueryParamProvider adapter={WindowAdapter}>
              <MDXProvider components={ mdxComponents }>
                {element}
              </MDXProvider>
            </QueryParamProvider>
          </DownloadProvider>
        </AppStatusProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}