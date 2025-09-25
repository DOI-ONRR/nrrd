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
  createData('AG', 'Silver', 'Silver', 'ounces'),
  createData('AP', 'Gold Placer', 'Gold', 'ounces'),
  createData('AV', 'Gold Ore', 'Gold', 'tons'),
  createData('B0', 'Gold', 'Gold', 'ounces'),
  createData('BH', 'Borax – Anhydrous', 'Sodium', 'tons'),
  createData('BJ', 'Borax – Decahydrate', 'Sodium', 'tons'),
  createData('BL', 'Borax – Pentahydrate', 'Sodium', 'tons'),
  createData('BM', 'Boric Acid', 'Sodium', 'tons'),
  createData('BS', 'Borrow Sand and Gravel', 'Sand & Gravel', 'tons'),
  createData('CA', 'Calcium Chloride', 'Calcium Chloride', 'pounds'),
  createData('CC', 'Cinders', 'Cinders', 'tons'),
  createData('CG', 'Clay', 'Clay', 'tons'),
  createData('CH', 'Copper Concentrate', 'Copper', 'tons'),
  createData('CL', 'Cobalt Concentrate', 'Cobalt', 'tons'),
  createData('CO', 'Carbon Dioxide', 'Carbon dioxide', 'tons'),
  createData('CU', 'Copper', 'Copper', 'pounds'),
  createData('ED', 'Coal-Bituminous-Raw', 'Coal', 'tons'),
  createData('EE', 'Coal', 'Coal', 'tons'),
  createData('EF', 'Coal-Lignite-Processed', 'Coal', 'tons'),
  createData('EG', 'Coal-Lignite-Raw', 'Coal', 'tons'),
  createData('EI', 'Coal-Subbituminous-Raw', 'Coal', 'tons'),
  createData('ES', 'Coal-Fines Circuit', 'Coal', 'tons'),
  createData('EW', 'Coal Waste (Sub-Econ)', 'Coal', 'tons'),
  createData('FB', 'Ferro Phosphorous Slag', 'Phosphate', 'tons'),
  createData('GF', 'Gilsonite', 'Gilsonite', 'tons'),
  createData('GH', 'Gypsum', 'Gypsum', 'tons'),
  createData('HU', 'Humate', 'Humate', 'tons'),
  createData('JD', 'Muriate Of Potash-Standard', 'Potassium', 'tons'),
  createData('JL', 'Muriate Of Potash-Granular', 'Potassium', 'tons'),
  createData('JP', 'Potash', 'Potassium', 'tons'),
  createData('LG', 'Langbeinite', 'Potassium', 'tons'),
  createData('LT', 'Leonardite', 'Coal', 'tons'),
  createData('MB', 'Molybdenum Concentrate', 'Molybdenum Concentrate', 'tons'),
  createData('MG', 'Magnesium Chloride Brine', 'Potassium', 'tons'),
  createData('MS', 'Manure Salts', 'Potassium', 'tons'),
  createData('ND', 'Brine Barrels', 'Sodium', 'barrels'),
  createData('PC', 'Lead Concentrate', 'Lead', 'tons'),
  createData('PG', 'Limestone', 'Limestone', 'tons'),
  createData('PK', 'Phosphate Raw Ore', 'Phosphate', 'tons'),
  createData('PN', 'Potassium Sulphate-Standard', 'Phosphate', 'tons'),
  createData('PP', 'Purge Liquor', 'Sodium', 'tons (equivalent)'),
  createData('QB', 'Quartz Crystal', 'Quartz', 'tickets/pounds'),
  createData('SA', 'Salt', 'Sodium', 'tons'),
  createData('SB', 'Sodium Bicarbonate', 'Sodium', 'tons'),
  createData('SF', 'Sand/Gravel', 'Sand & Gravel', 'tons'),
  createData('SG', 'Sand/Gravel-Cubic Yards', 'Sand & Gravel', 'cubic yards'),
  createData('SJ', 'Soda Ash', 'Soda Ash', 'tons'),
  createData('SN', 'Anhydrous Sodium Sulfate', 'Sodium', 'tons'),
  createData('SP', 'Sodium Sesquicarbonate', 'Sodium', 'tons'),
  createData('SR', 'Caustic', 'Sodium', 'tons'),
  createData('SS', 'Sulfur', 'Sulfur', 'long tons'),
  createData('SU', 'Sulfide', 'Sodium', 'tons'),
  createData('SY', 'Sylvite-Raw Ore', 'Potassium', 'tons'),
  createData('TB', 'Sodium Bisulfite', 'Sodium', 'tons'),
  createData('TD', 'Sodium Decahydrate', 'Sodium', 'tons'),
  createData('TJ', 'Trona Ore', 'Sodium', 'tons'),
  createData('TW', 'Mine Water', 'Mine Water', 'tons'),
  createData('WA', 'Wavellite', 'Wavellite', 'specimen'),
  createData('ZB', 'Zinc Concentrate (Mill Equiv)', 'Zinc', 'tons')
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

const HistoricalSales_ONRR4430_ProductCodesTable = () => {
  const classes = tableStyles()
  return (
    <TableContainer>
      <Table className={classes.table} aria-label='Historical Form ONRR-4430 Product Codes'>
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

export default HistoricalSales_ONRR4430_ProductCodesTable
