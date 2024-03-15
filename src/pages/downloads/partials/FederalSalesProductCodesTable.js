import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

function createData (code, description, commodity, unit) {
  return { code, description, commodity, unit }
}

const rows = [
  createData('01', 'Oil', 'Oil', 'bbl'),
  createData('02', 'Condensate', 'Oil', 'bbl'),
  createData('03', 'Processed (Residue) Gas', 'Gas', 'mcf'),
  createData('04', 'Unprocessed Gas', 'Gas', 'mcf'),
  createData('05', 'Drip or Scrubber Condensate', 'Oil', 'bbl'),
  createData('06', 'Inlet Scrubber', 'Oil', 'bbl'),
  createData('07', 'Gas Plant Products', 'NGL', 'gal'),
  createData('08', 'Gas Hydrate', 'Gas', 'mcf'),
  createData('12', 'Flash Gas', 'Gas', 'mcf'),
  createData('13', 'Fuel Oil', 'Oil', 'bbl'),
  createData('14', 'Oil Lost', 'Oil', 'bbl'),
  createData('15', 'Pipeline Fuel/Loss', 'Gas', 'mcf'),
  createData('16', 'Gas Lost - Flared or Vented', 'Gas', 'mcf'),
  createData('20', 'Other Liquid Hydrocarbons', 'Oil', 'bbl'),
  createData('39', 'Coal Bed Methane', 'Gas', 'mcf'),
  createData('61', 'Sweet Crude', 'Oil', 'bbl'),
  createData('62', 'Sour Crude', 'Oil', 'bbl'),
  createData('63', 'Asphaltic Crude', 'Oil', 'bbl'),
  createData('64', 'Black Wax Crude', 'Oil', 'bbl'),
  createData('65', 'Yellow Wax Crude', 'Oil', 'bbl'),
  createData('66', 'Flared Oil Well Gas', 'Gas', 'mcf'),
  createData('67', 'Flared Gas Well Gas', 'Gas', 'mcf'),
  createData('68', 'Vented Oil Well Gas', 'Gas', 'mcf'),
  createData('69', 'Vented Gas Well Gas', 'Gas', 'mcf'),
  createData('70', 'Gas Lost Prior to Royalty Measurement Point', 'Gas', 'mcf')
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

const FederalSalesProductCodesTable = () => {
  const classes = tableStyles()
  return (
    <TableContainer>
      <Table className={classes.table} >
        <TableHead>
          <TableRow>
            <HeaderTableCell>Product Code</HeaderTableCell>
            <HeaderTableCell>Description</HeaderTableCell>
            <HeaderTableCell>Commodity</HeaderTableCell>
            <HeaderTableCell>Unit of Measure</HeaderTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.code}>
              <DataTableCell component={'th'} scope='row'>{row.code}</DataTableCell>
              <DataTableCell>{row.description}</DataTableCell>
              <DataTableCell>{row.commodity}</DataTableCell>
              <DataTableCell>{row.unit}</DataTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default FederalSalesProductCodesTable
