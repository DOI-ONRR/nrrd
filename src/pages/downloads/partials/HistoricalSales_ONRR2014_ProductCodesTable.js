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
  createData('0', 'Not Tied to a Commodity', 'Other', 'none'),
  createData('00', 'Not Tied to a Commodity', 'Other', 'none'),
  createData('01', 'Oil', 'Oil', 'bbl'),
  createData('02', 'Condensate', 'Oil', 'bbl'),
  createData('03', 'Processed (Residue) Gas', 'Gas', 'mcf'),
  createData('04', 'Unprocessed Gas', 'Gas', 'mcf'),
  createData('05', 'Drip or Scrubber Condensate', 'Oil', 'bbl'),
  createData('06', 'Inlet Scrubber', 'Oil', 'bbl'),
  createData('07', 'Gas Plant Products', 'NGL', 'gal'),
  createData('08', 'Gas Hydrates', 'Gas', 'mcf'),
  createData('09', 'Nitrogen', 'Gas', 'mcf'),
  createData('12', 'Flash Gas', 'Gas', 'mcf'),
  createData('13', 'Fuel Oil', 'Oil', 'bbl'),
  createData('14', 'Oil Lost', 'Oil', 'bbl'),
  createData('15', 'Pipeline Fuel/Loss', 'Gas', 'mcf'),
  createData('16', 'Gas Lost - Flared or Vented', 'Gas', 'mcf'),
  createData('17', 'Carbon Dioxide Gas (CO2)', 'Carbon Dioxide', 'mcf'),
  createData('19', 'Sulfur', 'Sulfur', 'long tons'),
  createData('20', 'Other Liquid Hydrocarbons', 'Oil', 'bbl'),
  createData('22', 'Helium', 'Helium', 'bbl'),
  createData('25', 'Hot Water', 'Hot Water', 'bbl'),
  createData('27', 'Hot Springs', 'Geothermal', 'bbl'),
  createData('30', 'Water', 'Water', 'bbl'),
  createData('31', 'Geothermal - Electrical Generation, Kilowatt Hours', 'Geothermal', 'kWh'),
  createData('32', 'Geothermal - Electrical Generation, Thousands of Pounds', 'Geothermal', 'thousands of pounds'),
  createData('33', 'Geothermal - Electrical Generation, Millions of BTUs', 'Geothermal', 'mmbtu'),
  createData('34', 'Geothermal - Electrical Generation, Other', 'Geothermal', 'other'),
  createData('35', 'Geothermal - Direct Utilization, Millions of BTUs', 'Geothermal', 'mmbtu'),
  createData('36', 'Geothermal - Direct Utilization, Hundreds of Gallons', 'Geothermal', 'hundreds of gallons'),
  createData('37', 'Geothermal - Direct Utilization, Other', 'Geothermal', 'other'),
  createData('38', 'Geothermal - Commercially Demineralized H2O', 'Geothermal', 'hundreds of gallons'),
  createData('39', 'Coal Bed Methane', 'Gas', 'mcf'),
  createData('41', 'Geothermal - Sulfur', 'Geothermal', 'long tons'),
  createData('45', 'Geothermal - Direct Use, Millions of Gallons', 'Geothermal', 'millions of gallons'),
  createData('46', 'Geothermal - Direct Use, Millions of Pounds', 'Geothermal', 'millions of pounds'),
  createData('61', 'Sweet Crude', 'Oil', 'bbl'),
  createData('62', 'Sour Crude', 'Oil', 'bbl'),
  createData('63', 'Asphaltic Crude', 'Oil', 'bbl'),
  createData('64', 'Black Wax Crude', 'Oil', 'bbl'),
  createData('65', 'Yellow Wax Crude', 'Oil', 'bbl'),
  createData('66', 'Flared Oil Well Gas', 'Gas', 'mcf'),
  createData('67', 'Flared Gas Well Gas', 'Gas', 'mcf'),
  createData('68', 'Vented Oil Well Gas', 'Gas', 'mcf'),
  createData('69', 'Vented Gas Well Gas', 'Gas', 'mcf'),
  createData('70', 'Gas Lost Prior to Royalty Measurement Point', 'Gas', 'mcf'),
  createData('AA', 'Amethyst', 'Amethyst', 'grams'),
  createData('AB', 'Asbestos', 'Asbestos', 'pounds'),
  createData('BB', 'Barite', 'Barite', 'tons'),
  createData('BD', 'Bentonite', 'Bentonite', 'tons'),
  createData('BH', 'Borax – Anhydrous', 'Sodium', 'tons'),
  createData('BJ', 'Borax – Decahydrate', 'Sodium', 'tons'),
  createData('BL', 'Borax – Pentahydrate', 'Sodium', 'tons'),
  createData('BM', 'Boric Acid', 'Sodium', 'tons'),
  createData('BN', 'Boric Slag', 'Sodium', 'tons'),
  createData('BO', 'Boric Oxide', 'Sodium', 'tons'),
  createData('BP', 'Burkeite Cake', 'Sodium', 'tons'),
  createData('BR', 'Burkeite Brine', 'Sodium', 'tons'),
  createData('BS', 'Borrow Sand and Gravel', 'Sand & Gravel', 'tons'),
  createData('CB', 'Chat', 'Chat', 'tons'),
  createData('CC', 'Cinders', 'Cinders', 'tons'),
  createData('CG', 'Clay', 'Clay', 'tons'),
  createData('CH', 'Copper Concentrate', 'Copper', 'tons'),
  createData('CI', 'Copper Concentrate (Mill-Equiv)', 'Copper', 'tons'),
  createData('CJ', 'Copper Ore', 'Copper', 'tons'),
  createData('CL', 'Cobalt Concentrate', 'Cobalt', 'tons'),
  createData('CO', 'Carbon Dioxide', 'Carbon Dioxide', 'tons'),
  createData('CU', 'Copper', 'Copper', 'pounds'),
  createData('EC', 'Coal-Bituminous-Processed', 'Coal', 'tons'),
  createData('ED', 'Coal-Bituminous-Raw', 'Coal', 'tons'),
  createData('EE', 'Coal', 'Coal', 'tons'),
  createData('EG', 'Coal-Lignite-Raw', 'Coal', 'tons'),
  createData('EH', 'Coal-Subbituminous-Processed', 'Coal', 'tons'),
  createData('EI', 'Coal-Subbituminous-Raw', 'Coal', 'tons'),
  createData('ER', 'Coal-Resin', 'Coal', 'tons'),
  createData('ES', 'Coal-Fines Circuit', 'Coal', 'tons'),
  createData('FB', 'Ferro Phosphorous Slag', 'Phosphate', 'tons'),
  createData('FD', 'Fluorspar Concentrate-Chemical', 'Fluorspar Concentrate', 'tons'),
  createData('FE', 'Iron Ore', 'Iron', 'tons'),
  createData('GA', 'Garnet-Gem', 'Garnet', 'kilos'),
  createData('GB', 'Garnet Sands', 'Garnet', 'tons'),
  createData('GC', 'Garnet Concession Sale', 'Garnet', 'tickets'),
  createData('GF', 'Gilsonite', 'Gilsonite', 'tons'),
  createData('GG', 'Granite', 'Granite', 'tons'),
  createData('GH', 'Gypsum', 'Gypsum', 'tons'),
  createData('GL', 'Glaserite', 'Glaserite', 'tons'),
  createData('JA', 'Muriate of Potash-Coarse', 'Potassium', 'tons'),
  createData('JB', 'Muriate of Potash-Fine', 'Potassium', 'tons'),
  createData('JC', 'Muriate of Potash-Chemical', 'Potassium', 'tons'),
  createData('JD', 'Muriate of Potash-Standard', 'Potassium', 'tons'),
  createData('JI', 'Muriate of Potash-Industrial', 'Potassium', 'tons'),
  createData('JL', 'Muriate of Potash-Granular', 'Potassium', 'tons'),
  createData('JP', 'Potash', 'Potassium', 'tons'),
  createData('JS', 'Muriate of Potash-Soluble', 'Potassium', 'tons'),
  createData('LB', 'Langbeinite-Coarse', 'Potassium', 'tons'),
  createData('LC', 'Langbeinite-Granular', 'Potassium', 'tons'),
  createData('LD', 'Langbeinite-Standard', 'Potassium', 'tons'),
  createData('LE', 'Granulated Langbeinite', 'Potassium', 'tons'),
  createData('LS', 'Langbeinite-Special Std', 'Potassium', 'tons'),
  createData('LT', 'Leonardite', 'Coal', 'tons'),
  createData('MB', 'Molybdenum Concentrate', 'Molybdenum Concentrate', 'tons'),
  createData('MG', 'Magnesium Chloride Brine', 'Potassium', 'tons'),
  createData('MO', 'Molybdenum', 'Molybdenum', 'pounds'),
  createData('MS', 'Manure Salts', 'Potassium', 'tons'),
  createData('NB', 'Sodium Brine (NaCl)', 'Sodium', 'tons'),
  createData('NC', 'Nahcolite', 'Nahcolite', 'pounds'),
  createData('ND', 'Brine Barrels', 'Sodium', 'barrels'),
  createData('PA', 'Low Alpha Lead', 'Lead', 'tons'),
  createData('PC', 'Lead Concentrate', 'Lead', 'tons'),
  createData('PE', 'Lead Concentrate (Mill Equiv)', 'Lead', 'tons'),
  createData('PG', 'Limestone', 'Limestone', 'tons'),
  createData('PH', 'Phosphate Pebble', 'Phosphate', 'tons'),
  createData('PJ', 'Phosphate Concentrate', 'Phosphate', 'tons'),
  createData('PK', 'Phosphate Raw Ore', 'Phosphate', 'tons'),
  createData('PM', 'Phosphatic Clay', 'Phosphate', 'tons'),
  createData('PN', 'Potassium Sulphate-Standard', 'Phosphate', 'tons'),
  createData('PP', 'Purge Liquor', 'Sodium', 'tons (equivalent)'),
  createData('PQ', 'Phosphate Precipitator Dust', 'Phosphate', 'tons'),
  createData('PS', 'Potassium Sulphate Special Std', 'Potassium', 'tons'),
  createData('PT', 'Potassium Sulphate-Granular', 'Potassium', 'tons'),
  createData('QA', 'Quartz', 'Quartz', 'pounds'),
  createData('QB', 'Quartz Crystal', 'Quartz', 'tickets/pounds'),
  createData('SA', 'Salt', 'Sodium', 'tons'),
  createData('SB', 'Sodium Bicarbonate', 'Sodium', 'tons'),
  createData('SC', 'Scoria', 'Scoria', 'cubic yards'),
  createData('SE', 'Silica Sand', 'Silica Sand', 'tons'),
  createData('SF', 'Sand/Gravel', 'Sand & Gravel', 'tons'),
  createData('SG', 'Sand/Gravel-Cubic Yards', 'Sand & Gravel', 'cubic yards'),
  createData('SI', 'Sodium Bicarbonate-Industrial', 'Sodium', 'tons'),
  createData('SJ', 'Soda Ash', 'Soda Ash', 'tons'),
  createData('SK', 'Soda Ash-Coarse', 'Soda Ash', 'tons'),
  createData('SL', 'Soda Ash-Granular', 'Soda Ash', 'tons'),
  createData('SM', 'Sodium Bicarbonate Animal Feed', 'Sodium', 'tons'),
  createData('SN', 'Anhydrous Sodium Sulfate', 'Sodium', 'tons'),
  createData('SP', 'Sodium Sesquicarbonate', 'Sodium', 'tons'),
  createData('SQ', 'Sodium Tripolyphosphate', 'Sodium', 'tons'),
  createData('SR', 'Caustic', 'Sodium', 'tons'),
  createData('SS', 'Sulfur', 'Sulfur', 'long tons'),
  createData('ST', 'Tetrasodium Pyrophosphate', 'Sodium', 'tons'),
  createData('SU', 'Sulfide', 'Sodium', 'tons'),
  createData('SW', 'Salt-Waste', 'Sodium', 'tons'),
  createData('SY', 'Sylvite-Raw Ore', 'Potassium', 'tons'),
  createData('TB', 'Sodium Bisulfite', 'Sodium', 'tons'),
  createData('TD', 'Sodium Decahydrate', 'Sodium', 'tons'),
  createData('TJ', 'Trona Ore', 'Sodium', 'tons'),
  createData('TM', 'Sodium Metabisulfite', 'Sodium', 'tons'),
  createData('TW', 'Mine Water', 'Mine Water', 'tons'),
  createData('UA', 'Uranium-Raw Ore', 'Uranium', 'pounds'),
  createData('UU', 'Uranium Conc. (Yellow Cake)', 'Uranium', 'pounds'),
  createData('ZA', 'Zinc Concentrate', 'Zinc', 'tons'),
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

const HistoricalSales_ONRR2014_ProductCodesTable = () => {
  const classes = tableStyles()
  return (
    <TableContainer>
      <Table className={classes.table} aria-label='Historical Form ONRR-2014 Product Codes'>
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

export default HistoricalSales_ONRR2014_ProductCodesTable
