
import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useQuery, gql } from 'urql'

import QueryLink from '../../../../components/QueryLink'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import {
  DATA_FILTER_CONSTANTS as DFC,
  DISPLAY_NAMES
} from '../../../../constants'
import { useInView } from 'react-intersection-observer'
import CircularProgress from '@material-ui/core/CircularProgress'

import {
  Box,
  Container,
  Grid,
  Hidden,
  Typography
} from '@material-ui/core'

import {
  useTheme
} from '@material-ui/core/styles'

// not used import StackedBarChart from '../../../data-viz/StackedBarChart/StackedBarChart'
import { HorizontalStackedBarChart } from '../../../data-viz/StackedBarChart'
import DisbursementLocationTotal from './DisbursementLocationTotal'

import utils from '../../../../js/utils'

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
  // eslint-disable-next-line max-len
  'Provides matching grants to states and local governments to buy and develop public outdoor recreation areas across the 50 states. <a href="/how-revenue-works/lwcf" style="color: #1478a6">How this fund works</a>',
  // eslint-disable-next-line max-len
  'Helps preserve U.S. historical and archaeological sites and cultural heritage through grants to state and tribal historic preservation offices. <a href="/how-revenue-works/hpf" style="color: #1478a6">How this fund works</a>',
  // eslint-disable-next-line max-len
  'Some funds are directed back to federal agencies that administer these lands to help cover operational costs. The Ultra-Deepwater Research Program and the Mescal Settlement Agreement also receive $50 million each.',
]

const NationwideDisbursementSummary = props => {
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year

  const { title } = props
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const [result, _reexecuteQuery] = useQuery({
    query: NATIONWIDE_DISBURSEMENT_SUMMARY_QUERY,
    variables: { year },
    pause: inView === false,
  });

  const { data, fetching, error } = result;

  const yOrderBy = ['Federal Onshore', 'Federal Offshore', 'Native American', 'Federal - Not tied to a lease']

  let groupData
  let groupTotal
  let nationwideSummaryData
  const xAxis = 'year'
  const yAxis = 'total'
  const yGroupBy = 'source'
  const xLabels = 'month'
  const units = 'dollars'
  const colorRange = [
    theme.palette.explore[700],
    theme.palette.explore[500],
    theme.palette.explore[300],
    theme.palette.explore[100]
  ]

  const createMarkup = markup => {
    return { __html: markup }
  }

  if (fetching) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    groupData = utils.groupBy(data.fiscal_disbursement_recipient_source_summary, 'recipient')

    // eslint-disable-next-line no-return-assign
    groupTotal = Object.keys(groupData).map(k => groupData[k].reduce((sum, i) => sum += i.total, 0)).reduce((total, s) => total += s, 0)

    nationwideSummaryData = Object.entries(groupData)

    return (
      <Container id={utils.formatToSlug(title)} ref={ref} >
        <Grid container>
          <Grid item md={12}>
            <Box mt={10} mb={1} color="secondary.main" borderBottom={5}>
              <Box component="h2" color="secondary.dark">{title}</Box>
            </Box>
            <Typography variant="body1">
              <DisbursementLocationTotal />
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item sm={12}>
            <Box color="secondary.main" mt={5} mb={2} borderBottom={2} display="flex" justifyContent="space-between">
              <Box component="h3" color="secondary.dark" display="inline" align="left">Nationwide disbursements by recipient and source</Box>
              <Box display={{ xs: 'none', sm: 'inline' }} align="right" position="relative" top={5}>
                <QueryLink
                  groupBy={DFC.RECIPIENT}
                  recipient="Historic Preservation Fund,Land and Water Conservation Fund,Other,Reclamation,State and local governments,U.S. Treasury"
                  linkType="FilterTable" {...props}>
                  Query nationwide disbursements
                </QueryLink>
              </Box>
            </Box>
            <Box display={{ xs: 'block', sm: 'none' }} align="left">
              <QueryLink
                groupBy={DFC.RECIPIENT}
                recipient="Historic Preservation Fund,Land and Water Conservation Fund,Other,Reclamation,State and local governments,U.S. Treasury"
                linkType="FilterTable" {...props}>
                Query nationwide disbursements
              </QueryLink>
            </Box>
          </Grid>
          <Grid container item xs={5} style={{ borderBottom: '2px solid #cde3c3' }}>
            <Box fontWeight="bold">Recipient</Box>
          </Grid>
          <Grid container item xs={7} style={{ borderBottom: '2px solid #cde3c3' }}>
            <Hidden xsDown>
              <Grid item sm={6}>
                <Box fontWeight="bold" display="flex" justifyContent="flex-start" >Source</Box>
              </Grid>
            </Hidden>
            <Grid item xs={12} sm={6}>
              <Box fontWeight="bold" display="flex" justifyContent="flex-end">{DISPLAY_NAMES[DFC.FISCAL_YEAR].default} {year}</Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          { nationwideSummaryData &&
              nationwideSummaryData.map((item, i) => {
                return (
                  <Box p={2} width="100%" borderBottom="1px solid rgba(224, 224, 224, 1)">
                    <Grid container>
                      <Grid container item xs={12} sm={5}>
                        <Box key={i}>
                          <Box component="h4">{item[0]}</Box>
                          <Box component="p" pb={2} pr={{ xs: 0, md: 3 }}>
                            <span dangerouslySetInnerHTML={createMarkup(disbursementTypeDescriptions[i])} />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid container item xs={12} sm={7}>
                        <Box mt={{ xs: 0, sm: 4 }} width="100%">
                          <HorizontalStackedBarChart
                            key={`NDS${ dataSet }`}
                            data={item[1]}
                            legendFormat={v => {
                              if (v === 0) {
                                return '-'
                              }
                              else {
                                return utils.formatToDollarInt(v)
                              }
                            }}
                            // legendHeaders two dimensional array
                            legendHeaders={['', '']}
                            // chartTooltip two dimensional array
                            chartTooltip={
                              d => {
                                const r = []
                                r[0] = d.key
                                r[1] = utils.formatToDollarInt(d[0].data[d.key])
                                return r
                              }
                            }
                            // eslint-disable-next-line no-return-assign
                            barScale={item[1].reduce((sum, i) => sum += i.total, 0) / groupTotal }
                            units={units}
                            xAxis={xAxis}
                            xLabels={xLabels}
                            yAxis={yAxis}
                            yGroupBy={yGroupBy}
                            yOrderBy={yOrderBy}
                            horizontal
                            legendReverse={true}
                            colorRange={colorRange}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )
              })
          }
        </Grid>
      </Container>
    )
  }
  else {
    return (
      <Box display="flex" justifyContent="center" id={utils.formatToSlug(title)} ref={ref} height={300}>
        <CircularProgress />
      </Box>
    )
  }
}

export default NationwideDisbursementSummary

NationwideDisbursementSummary.propTypes = {
  title: PropTypes.string
}
