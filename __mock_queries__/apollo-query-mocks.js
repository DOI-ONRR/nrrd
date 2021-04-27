import QueryManager from '../src/js/query-manager'
import * as DFS from './data-filter-states'
import {
  QK_QUERY_TOOL,
  DATA_FILTER_KEY,
  REVENUE_TYPE,
  PERIOD,
  COMMODITY,
  EXCLUDE_PROPS,
  CALENDAR_YEAR,
  FISCAL_YEAR,
  COMPANY_NAME
} from '../src/constants'

import QUERY_TOOL_REVENUE_TYPE_RESULTS from './__apollo_mock_results__/RevenueTypes_results'
import QUERY_TOOL_PERIOD_RESULTS from './__apollo_mock_results__/Period_results'
import QUERY_TOOL_COMMODITY_RESULTS from './__apollo_mock_results__/Commodity_results'
import QUERY_TOOL_CALENDAR_YEAR_RESULTS from './__apollo_mock_results__/CalendarYear_results'
import QUERY_TOOL_FISCAL_YEAR_RESULTS from './__apollo_mock_results__/FiscalYear_results'
import QUERY_TOOL_COMPANY_NAME_RESULTS from './__apollo_mock_results__/CompanyName_results'
import QUERY_TOOL_REVENUE_RESULTS from './__apollo_mock_results__/QueryToolRevenue_results'

const QUERY_TOOL_REVENUE_TYPE = {
  request: {
    query: QueryManager.getQuery(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: REVENUE_TYPE }),
    ...QueryManager.getVariables(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: REVENUE_TYPE })
  },
  result: {
    data: QUERY_TOOL_REVENUE_TYPE_RESULTS
  }
}

const QUERY_TOOL_PERIOD = {
  request: {
    query: QueryManager.getQuery(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: PERIOD }),
    ...QueryManager.getVariables(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK],
      { [DATA_FILTER_KEY]: PERIOD, [EXCLUDE_PROPS]: [PERIOD, CALENDAR_YEAR, FISCAL_YEAR] })
  },
  result: {
    data: QUERY_TOOL_PERIOD_RESULTS
  }
}

const QUERY_TOOL_COMMODITY = {
  request: {
    query: QueryManager.getQuery(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: COMMODITY }),
    ...QueryManager.getVariables(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: COMMODITY })
  },
  result: {
    data: QUERY_TOOL_COMMODITY_RESULTS
  }
}

const QUERY_TOOL_CALENDAR_YEAR = {
  request: {
    query: QueryManager.getQuery(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: CALENDAR_YEAR }),
    ...QueryManager.getVariables(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: CALENDAR_YEAR })
  },
  result: {
    data: QUERY_TOOL_CALENDAR_YEAR_RESULTS
  }
}

const QUERY_TOOL_FISCAL_YEAR = {
  request: {
    query: QueryManager.getQuery(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: FISCAL_YEAR }),
    ...QueryManager.getVariables(QK_QUERY_TOOL, DFS.REVENUE_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: FISCAL_YEAR })
  },
  result: {
    data: QUERY_TOOL_FISCAL_YEAR_RESULTS
  }
}

const QUERY_TOOL_COMPANY_NAME = {
  request: {
    query: QueryManager.getQuery(QK_QUERY_TOOL, DFS.REVENUE_BY_COMPANY_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: COMPANY_NAME }),
    ...QueryManager.getVariables(QK_QUERY_TOOL, DFS.REVENUE_BY_COMPANY_DATA_TYPE_ONLY[DFS.DATA_FILTER_DEFAULTS_MOCK], { [DATA_FILTER_KEY]: COMPANY_NAME })
  },
  result: {
    data: QUERY_TOOL_COMPANY_NAME_RESULTS
  }
}

const QUERY_TOOL_TABLE_REVENUE = {
  request: {
    query: QueryManager.getQuery(QK_QUERY_TOOL, DFS.QUERY_TOOL_TABLE_REVENUE[DFS.DATA_FILTER_DEFAULTS_MOCK]),
    ...QueryManager.getVariables(QK_QUERY_TOOL, DFS.QUERY_TOOL_TABLE_REVENUE[DFS.DATA_FILTER_DEFAULTS_MOCK])
  },
  result: {
    data: QUERY_TOOL_REVENUE_RESULTS
  }
}
const mocks = [
  QUERY_TOOL_REVENUE_TYPE,
  QUERY_TOOL_PERIOD,
  QUERY_TOOL_COMMODITY,
  QUERY_TOOL_CALENDAR_YEAR,
  QUERY_TOOL_FISCAL_YEAR,
  QUERY_TOOL_COMPANY_NAME,
  QUERY_TOOL_TABLE_REVENUE
]

export default mocks
