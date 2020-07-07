import * as DATA_FILTER_CONSTANTS from './data-filter-constants'
export { DATA_FILTER_CONSTANTS }
export * from './data-filter-constants'

export const REVENUE = 'Revenue'
export const PRODUCTION = 'Production'
export const DISBURSEMENT = 'Disbursements'
export const DATA_TYPES = [REVENUE, PRODUCTION, DISBURSEMENT]

// Defines single or multiple select for inputs properties, also used to resolve values for queries in query manager
export const SINGLE = 'single'
export const MULTI = 'multi'

// Defines the available download types
export const EXCEL = 'excel'
export const CSV = 'csv'

// Defines keys for the available downalod data
export const DOWNLOAD_DATA_TABLE = 'data_table'

// @TODO find a better way to list all years
export const ALL_REVENUE_YEARS = `
y2003
y2004
y2005
y2006
y2007
y2008
y2009
y2010
y2011
y2012
y2013
y2014
y2015
y2016
y2017
y2018
y2019`

// Keys for accessing queries defined in the query manager
export const QUERY_KEY_DATA_TABLE = 'query_key_data_table'
