import React, { useContext } from 'react'
import { DataFilterContext } from '../../../stores/data-filter-store'
import QueryToolTablePeriod from './QueryToolTablePeriod/QueryToolTablePeriod'
import QueryToolTableSales from './QueryToolTableSales/QueryToolTableSales'
import withQueryManager from '../../withQueryManager'
import { DATA_TYPE, FEDERAL_SALES, QK_QUERY_TOOL } from '../../../constants'

const QueryToolTable = withQueryManager(({ data, loading }) => {
  const { state } = useContext(DataFilterContext)

  if (state[DATA_TYPE] === FEDERAL_SALES) {
    return <QueryToolTableSales />
  }
  return <QueryToolTablePeriod />
}, QK_QUERY_TOOL)

export default QueryToolTable
