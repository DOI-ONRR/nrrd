const currencyFormatter = ({ value }) => (
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', currencySign: 'accounting' })
)

const numberFormatter = ({ value }) => (
  value.toLocaleString('en-US')
)

export { currencyFormatter, numberFormatter }
