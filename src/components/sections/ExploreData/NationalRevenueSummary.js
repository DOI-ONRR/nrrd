import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Link from '../../Link'

import { StoreContext } from '../../../store'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'

import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'

// revenue type by land but just take one year of front page to do poc
const NATIONAL_REVENUE_SUMMARY_QUERY = gql`
  query NationalRevenue($year: Int!) {
    fiscal_revenue_type_class_summary(where: {year: {_eq: $year}}, order_by: {class_order: asc}) {
      revenue_type
      sum
      year
      land_class
      class_order
    }
  }
`

const useStyles = makeStyles(theme => ({
  root: {},
}))

const NationalRevenueSummary = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const year = state.year

  const { loading, error, data } = useQuery(NATIONAL_REVENUE_SUMMARY_QUERY, {
    variables: { year }
  })

  const chartTitle = props.chartTitle || `${ CONSTANTS.REVENUE } (dollars)`
  const yOrderBy = ['Federal Onshore', 'Federal Offshore', 'Native American', 'Federal - Not tied to a lease']

  let chartData
  const xAxis = 'year'
  const yAxis = 'sum'
  const yGroupBy = 'land_class'
  const xLabels = 'month'
  const units = 'dollars'
  const xGroups = {}

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    // do something wit dat data
    console.log('NationalRevenueSummary data: ', data)
    chartData = data.fiscal_revenue_type_class_summary
    xGroups['Fiscal year'] = chartData.map((row, i) => row.year)
  }

  return (
    <Grid container>
      <Grid item md={12}>
        <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
          <Box component="h3" color="secondary.dark">Nationwide revenue summary</Box>
        </Box>
      </Grid>
      <Grid item md={12}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Revenue type</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>{year} amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={{ verticalAlign: 'top' }}>
                <Box component="h4" mt={0}>U.S. Treasury</Box>
                <Box component="p">
                  The federal government’s basic operating fund pays for roughly two-thirds of all federal expenditures, including the military, national parks, and schools.
                </Box>
              </TableCell>
              <TableCell style={{ width: '40%' }}>
                <Grid item xs={12}>
                  <StackedBarChart
                    data={chartData}
                    legendFormat={v => utils.formatToDollarInt(v)}
                    title={chartTitle}
                    units={units}
                    xAxis={xAxis}
                    xLabels={xLabels}
                    yAxis={yAxis}
                    xGroups={xGroups}
                    yGroupBy={yGroupBy}
                    yOrderBy={yOrderBy}
                    horizontal
                  />
                </Grid>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: 'top' }}>
                <Box component="h4" mt={0}>State and local governments</Box>
                <Box component="p">
                  Funds disbursed to states fall under the jurisdiction of each state, and each state determines how the funds will be used.
                </Box>
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: 'top' }}>
                <Box component="h4" mt={0}>Reclamation Fund</Box>
                <Box component="p">
                Supports the establishment of critical infrastructure projects like dams and power plants.
                </Box>
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: 'top' }}>
                <Box component="h4" mt={0}>Native American tribes and individuals</Box>
                <Box component="p">
                ONRR disburses 100% of revenue collected from resource extraction on Native American lands back to tribes, nations, and individuals.
                </Box>
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: 'top' }}>
                <Box component="h4" mt={0}>Land and Water Conservation Fund</Box>
                <Box component="p">
                  Provides matching grants to states and local governments to buy and develop public outdoor recreation areas across the 50 states.
                </Box>
                <Link href="/how-it-works/land-and-water-conservation-fund/">How this fund works</Link>
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: 'top' }}>
                <Box component="h4" mt={0}>Other funds</Box>
                <Box component="p">
                Some funds are directed back to federal agencies that administer these lands to help cover operational costs. The Ultra-Deepwater Research Program and the Mescal Settlement Agreement also receive $50 million each.
                </Box>
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ verticalAlign: 'top' }}>
                <Box component="h4" mt={0}>Historic Preservation Fund</Box>
                <Box component="p">
                Helps preserve U.S. historical and archaeological sites and cultural heritage through grants to state and tribal historic preservation offices.
                </Box>
                <Link href="/how-it-works/historic-preservation-fund/">How this fund works</Link>
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}

export default NationalRevenueSummary
