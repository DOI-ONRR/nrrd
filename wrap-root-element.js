import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'

import { MDXProvider } from '@mdx-js/react'
import * as CustomComponents from './.cache/components'
import CodeBlock from './src/components/layouts/CodeBlock/CodeBlock.js'

import * as MaterialUI from '@material-ui/core'

import { Link } from 'gatsby'
import { client } from './src/apollo/client'
import { StoreProvider } from './src/store'
import { GlossaryProvider, DataFilterProvider } from './src/stores'
import ErrorBoundary from './src/components/ErrorBoundary'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './src/js/mui/theme'

const mdxComponents = {
  pre: props => <div {...props} />,
  code: CodeBlock,
  a: props => (props.href &&
    (props.href.charAt(0) === '#' || props.href.includes('http') || props.href.includes('mailto'))) ? <a {...props} /> : <Link to={props.href} {...props} />,
  ...CustomComponents,
  ...MaterialUI
}

export const wrapRootElement = ({ element }) => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <DataFilterProvider>
          <GlossaryProvider>
            <StoreProvider>
              <MDXProvider components={ mdxComponents }>
                {element}
              </MDXProvider>
            </StoreProvider>
          </GlossaryProvider>
        </DataFilterProvider>
      </ApolloProvider>
    </ThemeProvider>
  </ErrorBoundary>
)
