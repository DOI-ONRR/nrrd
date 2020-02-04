import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { MDXProvider } from '@mdx-js/react'
import * as components from './.cache/components'
import CodeBlock from './src/components/layouts/CodeBlock/CodeBlock.js'
import { Grid, Typography } from '@material-ui/core'
import { Link } from 'gatsby'
import { client } from './src/apollo/client'
import { StoreProvider } from './src/store'
import ErrorBoundary from './src/components/ErrorBoundary'

const mdxComponents = {
  pre: props => <div {...props} />,
  code: CodeBlock,
  Grid,
  a: props => (props.href &&
    (props.href.charAt(0) === '#' || props.href.includes('http') || props.href.includes('mailto'))) ? <a {...props} /> : <Link to={props.href} {...props} />,
  h1: props => <Typography variant="h1" {...props} />,
  p: props => <Typography variant="body1" paragraph={true} {...props} />,
  ...components
}

export const wrapRootElement = ({ element }) => (
  <React.StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <StoreProvider>
          <MDXProvider components={ mdxComponents }>
            {element}
          </MDXProvider>
        </StoreProvider>
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
