import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import {
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'

import { StoreContext } from '../../../store'

import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'

const APOLLO_QUERY = gql`
  query NationalSummary($year: Int!) {
    nationalRevenueSummary:fiscal_revenue_type_class_summary(order_by: {class_order: asc}, where: {year: {_eq: $year}}) {
        revenue_type
        sum
        year
        land_class
        class_order
      }
  }
`

const revenueTypeDescriptions = [
  'Once the land or water produces enough resources to pay royalties, the leaseholder pays royalties to the federal government.',
  'Companies bid on and lease lands and waters from the federal government.  They pay a bonus when they win a lease.',
  'Leaseholders pay rent until the land or water starts producing resources.',
  // eslint-disable-next-line max-len
  'The Department of the Interior inspects offshore oil and gas drilling rigs at least once a year. Inspection fees help recover some of the costs associated with these inspections.',
  'ONRR issues civil penalties when companies fail to comply with, or knowingly or willfully violate, regulations or laws.',
  'This includes other fees leaseholders pay such as permit fees and AML fees.'
]

const NationalSummary = ({ title, ...props }) => {
  const { state } = useContext(StoreContext)
  const year = state.year

  const chartTitle = props.chartTitle || `${ CONSTANTS.REVENUE } (dollars)`
  const yOrderBy = ['Federal Onshore', 'Federal Offshore', 'Native American', 'Federal - Not tied to a lease']

  const xAxis = 'year'
  const yAxis = 'sum'
  const yGroupBy = 'land_class'
  const xLabels = 'month'
  const units = 'dollars'
  const xGroups = {}

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year }
  })

  let nationalRevenueData

  if (loading) {}
  if (error) return `Error! ${ error.message }`

  if (data) {
    nationalRevenueData = data.nationalRevenueSummary
    const groupData = utils.groupBy(nationalRevenueData, 'revenue_type')
    nationalRevenueData = Object.entries(groupData)
    xGroups['Fiscal year'] = nationalRevenueData.map((row, i) => row[0])
  }

  return (
    <Container>
      <Grid container>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h3" color="secondary.dark" id={utils.formatToSlug(title)}>{title}</Box>
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
              { nationalRevenueData &&
              nationalRevenueData.map((item, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <Box component="h4" mt={0}>{item[0]}</Box>
                      <Box component="p">
                        {revenueTypeDescriptions[i]}
                      </Box>
                    </TableCell>
                    <TableCell style={{ width: '65%' }}>
                      <StackedBarChart
                        data={item[1]}
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
                    </TableCell>
                  </TableRow>
                )
              })
              }
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Container>
  )
}

export default NationalSummary

NationalSummary.propTypes = {}
