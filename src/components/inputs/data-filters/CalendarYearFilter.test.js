/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, act } from 'test-utils'

import CalendarYearFilter from './CalendarYearFilter'

import {
  QK_QUERY_TOOL
} from '../../../constants'

// Mocks the initial state of the AppStatusContext
jest.mock('../../../stores/data-filter-store/reducers', () => {
  const dataFilterState = require('../../../../__mock_queries__/data-filter-states')
  return ({
    get initialState () {
      return dataFilterState.REVENUE_DATA_TYPE_ONLY
    },
    get types () {
      return {}
    },
    reducer () {
      return {}
    }
  })
})

describe('Calendar Year Filter:', () => {
  test('Calendar Year rendered successfully', async () => {
    render(<CalendarYearFilter queryKey={QK_QUERY_TOOL} selectType='Multi' defaultSelectAll={true}/>)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    expect(screen.queryAllByText('2018')).toBeTruthy()
    expect(screen.queryByText('2020')).toBeTruthy()
  })
})
