import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

function createData (state1, state2, state3, state4) {
  return { state1, state2, state3, state4 }
}

const rows = [
  createData(<a href="https://revenuedata.doi.gov/explore/states/AL/">Alabama</a>, <a href="https://revenuedata.doi.gov/explore/states/IN/">Indiana</a>, <a href="https://revenuedata.doi.gov/explore/states/NV/">Nevada</a>, <a href="https://revenuedata.doi.gov/explore/states/SC/">South Carolina</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/AK/">Alaska</a>, <a href="https://revenuedata.doi.gov/explore/states/KS/">Kansas</a>, <a href="https://revenuedata.doi.gov/explore/states/NJ/">New Jersey</a>, <a href="https://revenuedata.doi.gov/explore/states/SD/">South Dakota</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/AZ/">Arizona</a>, <a href="https://revenuedata.doi.gov/explore/states/LA/">Louisiana</a>, <a href="https://revenuedata.doi.gov/explore/states/NM/">New Mexico</a>, <a href="https://revenuedata.doi.gov/explore/states/TX/">Texas</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/AR/">Arkansas</a>, <a href="https://revenuedata.doi.gov/explore/states/MD/">Maryland</a>, <a href="https://revenuedata.doi.gov/explore/states/NY/">New York</a>, <a href="https://revenuedata.doi.gov/explore/states/UT/">Utah</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/CA/">CA</a>, <a href="https://revenuedata.doi.gov/explore/states/MI/">Michigan</a>, <a href="https://revenuedata.doi.gov/explore/states/NC/">North Carolina</a>, <a href="https://revenuedata.doi.gov/explore/states/VT/">Vermont</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/CO/">Colorado</a>, <a href="https://revenuedata.doi.gov/explore/states/MN/">Minnesota</a>, <a href="https://revenuedata.doi.gov/explore/states/ND/">North Dakota</a>, <a href="https://revenuedata.doi.gov/explore/states/VA/">Virginia</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/DE/">Delaware</a>, <a href="https://revenuedata.doi.gov/explore/states/MS/">Mississippi</a>, <a href="https://revenuedata.doi.gov/explore/states/OH/">Ohio</a>, <a href="https://revenuedata.doi.gov/explore/states/WA/">Washington</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/FL/">Florida</a>, <a href="https://revenuedata.doi.gov/explore/states/MO/">Missouri</a>, <a href="https://revenuedata.doi.gov/explore/states/OK/">Oklahoma</a>, <a href="https://revenuedata.doi.gov/explore/states/WV/">West Virginia</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/ID/">Idaho</a>, <a href="https://revenuedata.doi.gov/explore/states/MT/">Montana</a>, <a href="https://revenuedata.doi.gov/explore/states/OR/">Oregon</a>, <a href="https://revenuedata.doi.gov/explore/states/WI/">Wisconsin</a>),
  createData(<a href="https://revenuedata.doi.gov/explore/states/IL/">Illinois</a>, <a href="https://revenuedata.doi.gov/explore/states/NE/">Nebraska</a>, <a href="https://revenuedata.doi.gov/explore/states/PA/">Pennsylvania</a>, <a href="https://revenuedata.doi.gov/explore/states/WY/">Wyoming</a>),
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

const DatabyStateButtons = () => {
  const classes = tableStyles()
  return (
    <TableContainer>
      <Table className={classes.table} aria-label='Data by State links'>
        <TableHead>
          <TableRow>
            <HeaderTableCell> </HeaderTableCell>
            <HeaderTableCell> </HeaderTableCell>
            <HeaderTableCell> </HeaderTableCell>
            <HeaderTableCell> </HeaderTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.code}>
              <DataTableCell component={'th'} scope='row'>{row.state1}</DataTableCell>
              <DataTableCell>{row.state2}</DataTableCell>
              <DataTableCell>{row.state3}</DataTableCell>
              <DataTableCell>{row.state4}</DataTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DatabyStateButtons
