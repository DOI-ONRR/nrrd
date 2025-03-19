import { currencyFormatter, numberFormatter } from './formatters'
import tableConfig from '../config/tableConfig'

const formatData = (column, value) => {
  if (tableConfig.currencyColumns.findIndex(col => col === column.name) !== -1) {
    return currencyFormatter({ value })
  }
  else if (tableConfig.numberColumns.findIndex(col => col === column.name) !== -1) {
    return numberFormatter({ value })
  }
  return value
}

export default formatData
