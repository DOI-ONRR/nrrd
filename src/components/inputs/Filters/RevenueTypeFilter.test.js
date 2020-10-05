/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, act, REVENUE_ONLY } from 'test-utils'

import RevenueTypeFilter from './RevenueTypeFilter'
import {
  QK_QUERY_TOOL
} from '../../../constants'

// import { REVENUE_ONLY } from '../../../../__test_utils__/data-filter-states'

// Mocks the initial state of the AppStatusContext
jest.mock('../../../stores/data-filter-store/reducers', () => {
  const dataFilterState = require('../../../../__mock_queries__/data-filter-states')
  return ({
    get initialState () {
      return dataFilterState.REVENUE_ONLY
    },
    get types () {
      return {}
    },
    reducer () {
      return {}
    }
  })
})

describe('Revenue Type Filter:', () => {
  test('Revenue Type rendered successfully', async () => {
    render(<RevenueTypeFilter queryKey={QK_QUERY_TOOL} selectType='Multi' defaultSelectAll={true}/>)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    expect(screen.getByDisplayValue('Revenue,Production,Disbursements')).toBeInTheDocument()
  })
})
