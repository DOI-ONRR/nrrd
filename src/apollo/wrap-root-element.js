import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { client } from './client'
import { StoreProvider } from '../store'

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <StoreProvider>
      {element}
    </StoreProvider>
  </ApolloProvider>
)
