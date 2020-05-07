import gql from 'graphql-tag'
import {
  DATA_TYPE
} from '../../constants'

const DATA_TYPE_OPTIONS_QUERY = `
  options:data_types{
    option:name
  }`

const DATA_TYPE_QUERIES = {
  [DATA_TYPE]: gql`query GetDataTypeOptionsRevenue{${ DATA_TYPE_OPTIONS_QUERY }}`,
}

export default DATA_TYPE_QUERIES
