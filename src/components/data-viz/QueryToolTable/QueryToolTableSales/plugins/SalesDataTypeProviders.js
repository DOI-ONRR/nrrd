import React from 'react'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { currencyFormatter, numberFormatter } from '../helpers/formatters'

const CurrencyTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={currencyFormatter}
    {...props}
  />
)

const NumberTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={numberFormatter}
    {...props}
  />
)

export { CurrencyTypeProvider, NumberTypeProvider }
