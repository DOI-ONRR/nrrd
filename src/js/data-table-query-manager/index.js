
import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENTS,
  LAND_CLASS,
  LAND_CATEGORY,
  OFFSHORE_REGION,
  US_STATE,
  COUNTY,
  COMMODITY,
  REVENUE_TYPE,
  PERIOD,
  DATA_TYPE,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  FISCAL_YEAR,
  CALENDAR_YEAR
} from '../../constants'
import gql from 'graphql-tag'

const allRevenueYears = `
y2020
y2019
y2018
y2017
y2016
y2015
y2014
y2013
y2012
y2011
y2010
y2009
y2008
y2007
y2006
y2005
y2004
y2003`

/**
 * This object provides various methods for quering the data filters
 */
const DataTableQueryManager = {
  getQuery: state => {
    const query = QUERIES[state.dataType]
    if (query === undefined) {
      throw new Error(`For data type: '${ state.dataType }' and option key '${ optionKey }', no query was found.`)
    }
    return query
  },
  getVariables: state => {
    const vars = VARIABLES[state.dataType](state)
    if (vars === undefined) {
      throw new Error(`For data type: '${ state.dataType }' no variables were found.`)
    }
    return vars
  }
}

export default DataTableQueryManager

/**
 * Set the variable filters for the query based on the state.
 * The state comes from the DataFilterProvider
 */
const VARIABLES = {
  [REVENUE]: state => ({
    variables: {
      [LAND_CLASS]: state[LAND_CLASS],
      [LAND_CATEGORY]: state[LAND_CATEGORY],
      [OFFSHORE_REGION]: state[OFFSHORE_REGION] && state[OFFSHORE_REGION].split(','),
      [US_STATE]: state[US_STATE] && state[US_STATE].split(','),
      [COUNTY]: state[COUNTY] && state[COUNTY].split(','),
      [COMMODITY]: state[COMMODITY] && state[COMMODITY].split(','),
      [REVENUE_TYPE]: state[REVENUE_TYPE] && state[REVENUE_TYPE].split(','),
      [PERIOD]: state[PERIOD],
    }
  }),
  [PRODUCTION]: state => ({
    variables: {
      [LAND_CLASS]: state[LAND_CLASS],
      [LAND_CATEGORY]: state[LAND_CATEGORY],
      [OFFSHORE_REGION]: state[OFFSHORE_REGION] && state[OFFSHORE_REGION].split(','),
      [US_STATE]: state[US_STATE] && state[US_STATE].split(','),
      [COUNTY]: state[COUNTY] && state[COUNTY].split(','),
      [COMMODITY]: state[COMMODITY] && state[COMMODITY].split(','),
      [PERIOD]: state[PERIOD],
      [CALENDAR_YEAR]: (state[PERIOD] === PERIOD_CALENDAR_YEAR && state[CALENDAR_YEAR]) && state[CALENDAR_YEAR].split(',').map(year => parseInt(year)),
      [FISCAL_YEAR]: (state[PERIOD] === PERIOD_FISCAL_YEAR && state[FISCAL_YEAR]) && state[FISCAL_YEAR].split(',').map(year => parseInt(year)),
    }
  })
}

const VARIABLE_LIST = ''.concat(
  '$landClass: String,',
  '$landCategory: String,',
  '$offshoreRegion: [String!],',
  '$usState: [String!],',
  '$county: [String!],',
  '$commodity: [String!],',
  '$revenueType: [String!],',
  '$period: String,'
)

const REVENUE_QUERY = `
  results:query_tool_data(
    limit: 50,
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
    }) {
    land_class  
    ${ LAND_CATEGORY }: land_category
    offshore_region
    state
    county
    ${ REVENUE_TYPE }: revenue_type
    commodity
    ${ allRevenueYears }
  }`

/**
 * Get the queries based on data type and the data filter option
 */
const QUERIES = {
  [REVENUE]: gql`query GetLandCategoryOptionsRevenue(${ VARIABLE_LIST }){${ REVENUE_QUERY }}`,
}
