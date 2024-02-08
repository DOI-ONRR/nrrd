import { currencyFormatter, numberFormatter } from './formatters'
import tableConfig from '../config/tableConfig'

const formatData = (column, value) => {
  if (tableConfig.currencyColumns.findIndex(col => col === column.name) !== -1) {
    return currencyFormatter({ value: value })
  }
  else if (tableConfig.numberColumns.findIndex(col => col === column.name) !== -1) {
    return numberFormatter({ value: value })
  }
  return value
}

export default formatData
