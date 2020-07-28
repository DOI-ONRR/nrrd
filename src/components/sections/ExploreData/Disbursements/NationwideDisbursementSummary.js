
import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Link from '../../../Link'

import { StoreContext } from '../../../../store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

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

import StackedBarChart from '../../../data-viz/StackedBarChart/StackedBarChart'

import utils from '../../../../js/utils.js'
import CONSTANTS from '../../../../js/constants'

// revenue type by land but just take one year of front page to do poc
const NATIONWIDE_DISBURSEMENT_SUMMARY_QUERY = gql`
  query NationwideDisbursemtSummary($year: Int!) {
    fiscal_disbursement_recipient_source_summary( where: {year: {_eq: $year}}) {
      total
      recipient
      source
      year
    }
  }
`

const disbursementTypeDescriptions = [
  'The federal government’s basic operating fund pays for roughly two-thirds of all federal expenditures, including the military, national parks, and schools.',
  'Funds disbursed to states fall under the jurisdiction of each state, and each state determines how the funds will be used.',
  'Supports the establishment of critical infrastructure projects like dams and power plants.',
  // eslint-disable-next-line max-len
  'ONRR disburses 100% of revenue collected from resource extraction on Native American lands back to tribes, nations, and individuals.',
  'Provides matching grants to states and local governments to buy and develop public outdoor recreation areas across the 50 states. <a href="/how-revenue-works/lwcf" style="color: #1478a6">How this fund works</a>',
  'Helps preserve U.S. historical and archaeological sites and cultural heritage through grants to state and tribal historic preservation offices. <a href="/how-revenue-works/hpf" style="color: #1478a6">How this fund works</a>',
  'Some funds are directed back to federal agencies that administer these lands to help cover operational costs. The Ultra-Deepwater Research Program and the Mescal Settlement Agreement also receive $50 million each.',
]

const useStyles = makeStyles(theme => ({
  root: {},
}))

const NationwideDisbursementSummary = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year

  const { title } = props

  const { loading, error, data } = useQuery(NATIONWIDE_DISBURSEMENT_SUMMARY_QUERY, {
    variables: { year }
  })

  const chartTitle = props.chartTitle || `${ CONSTANTS.DISBURSEMENT } (dollars)`
  const yOrderBy = ['Federal Onshore', 'Federal Offshore', 'Native American', 'Federal - Not tied to a lease']

  let groupData
  let groupTotal
  let nationwideSummaryData
  const xAxis = 'year'
  const yAxis = 'total'
  const yGroupBy = 'source'
  const xLabels = 'month'
  const units = 'dollars'
  const xGroups = {}

  const createMarkup = markup => {
    return { __html: markup }
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    // do something wit dat data
    console.log('NationwideDisbursementSummary data: ', data)
    groupData = utils.groupBy(data.fiscal_disbursement_recipient_source_summary, 'recipient')
    console.debug('WTH', groupData)

    /* groupTotal = Object.keys(groupData).map(k =>
      groupData[k].reduce((sum, i) => {
        sum += i.total
      }, 0)).reduce((total, s) => {
      total += s
      }, 0)
    */
    groupTotal = Object.keys(groupData).map(k => groupData[k].reduce((sum, i) => sum += i.total, 0)).reduce((total, s) => total += s, 0)
    /*
    // Have to keep long form with return (calc) for some reason.
    groupTotal = Object.keys(groupData).map(k => {
      //console.debug("K: ", k, "groupData[k]", groupData[k] )
      let st= groupData[k].reduce((sum, i) => {
        //console.debug("sum", sum, "i", i)
        return (sum += i.total)
      }, 0)
      //console.debug("ST, ", st)
      return st
    }
    ).reduce((total, s) => {
      //  console.debug("total, ", total, s)
      return ( total += s)
      }, 0)
    */
    nationwideSummaryData = Object.entries(groupData)
    //  console.debug("groupTotal: ", groupTotal)
    /* debug    nationwideSummaryData.map((item, i) => {
      let barScale=item[1].reduce((sum, i) => { return (sum += i.total) }, 0) / groupTotal
      console.debug("barScale: ", barScale)
      console.debug("item: ", item)
    })
*/
    console.log('nationwideSummaryData: ', nationwideSummaryData)

    return (
      <Container id={utils.formatToSlug(title)}>
        <Grid container>
          <Grid item md={12}>
            <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
              <Box component="h3" color="secondary.dark">{title}</Box>
            </Box>
          </Grid>
          <Grid item md={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Recipient</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}><span>Source</span>
                    <span style={{ fontWeight: 'bold', float: 'right' }}>FY {year}</span></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                { nationwideSummaryData &&
              nationwideSummaryData.map((item, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <Box component="h4" mt={0}>{item[0]}</Box>
                      <Box component="p">
                        <span dangerouslySetInnerHTML={createMarkup(disbursementTypeDescriptions[i])} />
                      </Box>
                    </TableCell>
                    <TableCell style={{ width: '65%' }}>
                      <StackedBarChart
                        key={'NDS' + dataSet }
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
                        barScale={item[1].reduce((sum, i) => sum += i.total, 0) / groupTotal }
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
  else {
    return (null)
  }
}

export default NationwideDisbursementSummary

NationwideDisbursementSummary.propTypes = {
  title: PropTypes.string
}
