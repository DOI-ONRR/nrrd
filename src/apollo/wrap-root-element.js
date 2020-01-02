import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { client } from './client'

import { GlossaryProvider } from '../../src/glossaryContext'

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <GlossaryProvider>
      {element}
    </GlossaryProvider>
  </ApolloProvider>
)
