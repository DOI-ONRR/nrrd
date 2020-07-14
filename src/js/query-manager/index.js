
import {
  PERIOD,
  QUERY_KEY_DATA_TABLE,
  MULTI
} from '../../constants'

import {
  getQuery as getQueryQueryToolDataTable,
  getVariables as getVariablesQueryToolDataTable
} from './query-tool-data-table-queries'

/**
 * The query manager provides a standard approach for accessing a query and its variables. This allows us to use this
 * query manager in a HOC that can then be added to components. The query manager also provides helper methods to use for creating
 * the syntax needed for executing a query properly. It tries to remove the burden of repetative code and a reusable code base for components.
 * Also by using a query manager it will be easy to find all our queries used in the code and edit as necessary.
 */
const QueryManager = {
  getQuery: (queryKey, state, { ...options }) => {
    const query = QUERIES[queryKey](state, options)
    if (query === undefined) {
      throw new Error(`For query key: '${ queryKey } no query was found.`)
    }
    return query
  },
  getVariables: (queryKey, state, { ...options }) => {
    const vars = VARIABLES[queryKey](state, options)
    if (vars === undefined) {
      throw new Error(`For query key: '${ queryKey } no variables were found.`)
    }
    return vars
  }
}
export default QueryManager

/**
 * All the queries that can be accessed via query key
 */
const QUERIES = {
  [QUERY_KEY_DATA_TABLE]: (state, options) => getQueryQueryToolDataTable(state, options)
}

/**
 * All the variables that can be accessed via query key
 */
const VARIABLES = {
  [QUERY_KEY_DATA_TABLE]: (state, options) => getVariablesQueryToolDataTable(state, options)
}

/**
 * Helper method to set all the values to the variables for queries that use our data filter inputs
 * @param {object} state
 * @param {array} config
 */
export const getDataFilterVariableValues = (state, config) => {
  const results = {}
  config.forEach(prop => {
    results[Object.keys(prop)[0]] = getDataFilterValue(Object.keys(prop)[0], state)
  })
  return ({ variables: results })
}

/**
 * Helper method to get the values for a specific data filter input/property
 * @param {object} state
 * @param {array} config
 */
export const getDataFilterValue = (key, state) => {
  switch (key) {
  case PERIOD:
    return (!state[key]) ? undefined : state[key]
  }
  return (!state[key]) ? undefined : state[key].split(',')
}

/**
 * Helper method to create the variable list for the query
 * @param {object} state
 * @param {array} config
 */
export const getDataFilterVariableList = (state, config) => {
  let result = ''
  config.forEach(prop => {
    const key = Object.keys(prop)[0]
    const type = (prop[key] === MULTI) ? '[String!],' : 'String,'
    result = result.concat(`$${ key }: ${ type }`)
  })
  return result
}
