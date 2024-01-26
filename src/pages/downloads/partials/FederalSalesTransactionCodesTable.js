import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

function createData (code, description) {
  return { code, description }
}

const rows = [
  createData('01', 'Royalty Due'),
  createData('08', 'Royalty-in-Kind (Other)'),
  createData('10', 'Compensatory Royalty Payment'),
  createData('11', 'Transportation Allowance'),
  createData('13', 'Quality Bank and Gravity Bank Adjustment'),
  createData('15', 'Processing Allowance'),
  createData('39', 'Net Profit Share - Unprofitable'),
  createData('40', 'Net Profit Share - Profitable'),
  createData('41', 'Offshore Deep Water Royalty Relief'),
  createData('44', 'DWRRA - EPA Sec 344 - Shallow Water Deep Gas Roy Relief (SV)'),
  createData('55', 'DWRRA - EPA Sec 345 - Deep Water Royalty Relief (SV)'),
  createData('RR', 'Royalty Relief')
]

const tableStyles = makeStyles({
  table: {
    marginTop: '1rem'
  }
})

const HeaderTableCell = withStyles(() => ({
  head: {
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: '0.5rem'
  }
}))(TableCell)

const DataTableCell = withStyles(() => ({
  body: {
    padding: '0.5rem'
  },
}))(TableCell)

const FederalSalesTransactionCodesTable = () => {
  const classes = tableStyles()
  return (
    <TableContainer>
      <Table className={classes.table} >
        <TableHead>
          <TableRow>
            <HeaderTableCell>Transaction Code</HeaderTableCell>
            <HeaderTableCell>Description</HeaderTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.code}>
              <DataTableCell component={'th'} scope='row'>{row.code}</DataTableCell>
              <DataTableCell>{row.description}</DataTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default FederalSalesTransactionCodesTable
