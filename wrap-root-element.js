import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { MDXProvider } from '@mdx-js/react'
import * as components from './.cache/components'
import { client } from './src/apollo/client'
import { StoreProvider } from './src/store'

const mdxComponents = {
  pre: props => <div {...props} />,
  ...components
}

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <StoreProvider>
      <MDXProvider components={ mdxComponents }>
        {element}
      </MDXProvider>
    </StoreProvider>
  </ApolloProvider>
)
