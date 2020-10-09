import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from '../src/js/mui/theme'

import { MockedProvider } from '@apollo/react-testing'

import mocks from '../__mock_queries__/apollo-query-mocks'
import {
  AppStatusProvider,
  DownloadProvider
} from '../src/stores'

import ErrorBoundary from '../src/components/ErrorBoundary'
import { DataFilterProvider } from '../src/stores/data-filter-store'

const AllTheProviders = ({ children }) => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AppStatusProvider>
          <DownloadProvider>
            <DataFilterProvider defaults='dataFilterDefaultsMock'>
              {children}
            </DataFilterProvider>
          </DownloadProvider>
        </AppStatusProvider>
      </MockedProvider>
    </ThemeProvider>
  </ErrorBoundary>
)
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
