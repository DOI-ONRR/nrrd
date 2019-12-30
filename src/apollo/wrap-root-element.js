import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { MDXProvider } from '@mdx-js/react'
import { client } from './client'
import CodeBlock from '../components/layouts/CodeBlock/CodeBlock.js'
import * as components from '../../.cache/components'
import { GlossaryProvider } from '../../src/glossaryContext'
import { StoreProvider } from '../store'

const mdxComponents = {
  pre: props => <div {...props} />,
  code: CodeBlock,
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
