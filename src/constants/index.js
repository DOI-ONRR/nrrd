import * as DATA_FILTER_CONSTANTS from './data-filter-constants'
import ALL_YEARS from '../../.cache/all-years'

export { ALL_YEARS }

export { DATA_FILTER_CONSTANTS }
export * from './data-filter-constants'

// Defines single or multiple select for inputs properties, also used to resolve values for queries in query manager
export const SINGLE_STR = 'String,'
export const MULTI_STR = '[String!],'
export const SINGLE_INT = 'Int,'
export const MULTI_INT = '[Int!],'

// Defines the available download types
export const EXCEL = 'excel'
export const CSV = 'csv'

// Defines keys for the available downalod data
export const DOWNLOAD_DATA_TABLE = 'data_table'

// Keys for accessing queries defined in the query manager
export const QK_QUERY_TOOL = 'qk_query_tool'
export const QK_DISBURSEMENTS_COMMON = 'qk_disbursements_common'
export const QK_REVENUE_COMMON = 'qk_revenue_common'
export const QK_PRODUCTION_COMMON = 'qk_production_common'
export const QK_SALES_COMMON = 'qk_sales_common'
