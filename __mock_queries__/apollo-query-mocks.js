import QueryManager from '../src/js/query-manager'
import * as DFS from './data-filter-states'
import {
  QK_QUERY_TOOL,
  DATA_FILTER_KEY,
  REVENUE_TYPE,
  DATA_TYPE,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  EXCEL,
  CSV,
  DOWNLOAD_DATA_TABLE,
  PERIOD_TYPES,
  REVENUE_BY_COMPANY
} from '../src/constants'

import QUERY_TOOL_REVENUE_TYPE_RESULTS from './__apollo_mock_results__/RevenueTypes_results'

// QueryManager.getQuery(queryKey, state, options)
// QueryManager.getVariables(queryKey, state, options)

const QUERY_TOOL_REVENUE_TYPE = {
  request: {
    query: QueryManager.getQuery(QK_QUERY_TOOL, DFS.REVENUE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: REVENUE_TYPE }),
    ...QueryManager.getVariables(QK_QUERY_TOOL, DFS.REVENUE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: REVENUE_TYPE })
  },
  result: {
    data: QUERY_TOOL_REVENUE_TYPE_RESULTS
  }
}

const mocks = [
  QUERY_TOOL_REVENUE_TYPE
]

export default mocks
