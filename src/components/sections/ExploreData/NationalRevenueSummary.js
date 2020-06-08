
import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Link from '../../Link'

import { StoreContext } from '../../../store'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import { makeStyles } from '@material-ui/core/styles'
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

import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'

// revenue type by land but just take one year of front page to do poc
const NATIONAL_REVENUE_SUMMARY_QUERY = gql`
  query NationalRevenue($year: Int!) {
    fiscal_revenue_type_class_summary(order_by: {class_order: asc}, where: {year: {_eq: $year}}) {
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

const useStyles = makeStyles(theme => ({
  root: {},
}))

const NationalRevenueSummary = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019

  const { title } = props

  const { loading, error, data } = useQuery(NATIONAL_REVENUE_SUMMARY_QUERY, {
    variables: { year }
  })

  const chartTitle = props.chartTitle || `${ CONSTANTS.REVENUE } (dollars)`
  const yOrderBy = ['Federal Onshore', 'Federal Offshore', 'Native American', 'Federal - Not tied to a lease']

  let groupData
  let groupTotal
  let nationalRevenueData
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
    //    console.log('NationalRevenueSummary data: ', data)
    groupData = utils.groupBy(data.fiscal_revenue_type_class_summary, 'revenue_type')
    groupTotal = Object.keys(groupData).map(k => groupData[k].reduce((sum, i) => sum += i.sum, 0)).reduce((total, s) => total += s, 0)
    nationalRevenueData = Object.entries(groupData)
  }

  return (
    <Container id={utils.formatToSlug(title)}>
      <Grid container>
        <Grid item xs={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h3" color="secondary.dark">{title}</Box>
          </Box>
        </Grid>
        <Grid item xs={12} style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Revenue type</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}><span>Source</span>
                  <span style={{ fontWeight: 'bold', float: 'right' }}>FY {year}</span></TableCell>

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
                        key={'NRS' + year + '_' + i}
                        data={item[1]}
                        legendFormat={v => {
                          if (v === 0) {
                            return '-'
                          }
                          else {
                            return utils.formatToDollarInt(v)
                          }
                        }}
                        legendHeaders={ headers => {
                          // console.debug('headers..................', headers)
                          headers[0] = ''
                          headers[2] = ''
                          return headers
                        }
                        }
                        barScale={item[1].reduce((sum, i) => sum += i.sum, 0) / groupTotal }
                        units={units}
                        xAxis={xAxis}
                        xLabels={xLabels}
                        yAxis={yAxis}
                        yGroupBy={yGroupBy}
                        yOrderBy={yOrderBy}
                        horizontal
                        legendReverse={true}
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

export default NationalRevenueSummary

NationalRevenueSummary.propTypes = {
  title: PropTypes.string
}
