import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from '../src/js/mui/theme'
import { ApolloProvider } from '@apollo/react-hooks'

import { client } from '../src/apollo/client'
import {
  AppStatusProvider,
  DownloadProvider
} from '../src/stores'

import ErrorBoundary from '../src/components/ErrorBoundary'

const AllTheProviders = ({ children }) => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <AppStatusProvider>
          <DownloadProvider>
            {children}
          </DownloadProvider>
        </AppStatusProvider>
      </ApolloProvider>
    </ThemeProvider>
  </ErrorBoundary>
)
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
