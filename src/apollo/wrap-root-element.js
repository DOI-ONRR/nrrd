import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { client } from './client'

import { GlossaryProvider } from '../../src/glossaryContext'
import { StoreProvider } from '../store'

// const initState = {
//   counter: 0
// }

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <StoreProvider>
      {element}
    </StoreProvider>
  </ApolloProvider>
)
