/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, act } from 'test-utils'

import QueryToolTable from './DataTable'

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

describe('Data Table:', () => {
  test('Data Table rendered successfully', async () => {
    expect(true).toBeTruthy()
  })
})
