/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, act } from 'test-utils'

import RevenueTypeFilter from './RevenueTypeFilter'
import {
  QK_QUERY_TOOL
} from '../../../constants'

import { REVENUE_ONLY } from '../../../../__mock_queries__/data-filter-states'

// Mocks the initial state of the AppStatusContext
jest.mock('../../../stores/data-filter-store/reducers', () => ({
  get initialState () {
    return REVENUE_ONLY
  },
  get types () {
    return {}
  },
  reducer () {
    return {}
  }
}))

describe('Revenue Type Filter:', () => {
  test('Revenue Type rendered successfully', async () => {
    render(<RevenueTypeFilter queryKey={QK_QUERY_TOOL} selectType='Multi' defaultSelectAll={true}/>)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    expect(screen.getByTitle('The 8(g) zone', { exact: false })).toBeInTheDocument()
  })
})
