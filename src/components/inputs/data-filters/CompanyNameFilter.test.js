/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, act } from 'test-utils'

import CompanyNameFilter from './CompanyNameFilter'

import {
  QK_QUERY_TOOL
} from '../../../constants'

// Mocks the initial state of the AppStatusContext
jest.mock('../../../stores/data-filter-store/reducers', () => {
  const dataFilterState = require('../../../../__mock_queries__/data-filter-states')
  return ({
    get initialState () {
      return dataFilterState.REVENUE_BY_COMPANY_DATA_TYPE_ONLY
    },
    get types () {
      return {}
    },
    reducer () {
      return {}
    }
  })
})

describe('Company Name Filter:', () => {
  test('Company Name rendered successfully', async () => {
    render(<CompanyNameFilter queryKey={QK_QUERY_TOOL} />)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    expect(screen.queryAllByText('Company')).toBeTruthy()
  })
})
