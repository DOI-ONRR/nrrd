
import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import QueryLink from '../../../../components/QueryLink'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import {
  Box,
  Container,
  Grid,
  Hidden
} from '@material-ui/core'

import { useTheme } from '@material-ui/core/styles'

import StackedBarChart from '../../../data-viz/StackedBarChart/StackedBarChart'

import utils from '../../../../js/utils'

// revenue type by land but just take one year of front page to do poc
const NATIONAL_REVENUE_SUMMARY_QUERY = gql`
  query RevenueNational($year: Int!, $period: String!, $commodities: [String!]) {
   revenue_type_class_summary(
     order_by: {
       revenue_type_order: asc,
       land_type_order: asc},
        where: {
          year: {_eq: $year},
          period: { _eq: $period},
          commodity: {_in: $commodities}  
        }
  ) {
    revenue_type
    year
    land_type
    land_type_order
    total
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

const RevenueNationalSummary = props => {
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const commodityKey = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'All'
  const { title } = props

  const { loading, error, data } = useQuery(NATIONAL_REVENUE_SUMMARY_QUERY, {
    variables: { year: year, period: period, commodities: commodities }
  })

  const yOrderBy = ['Federal Onshore', 'Federal Offshore', 'Native American', 'Federal - Not tied to a lease']

  let groupData
  let groupTotal
  let nationalRevenueData
  const xAxis = 'year'
  const yAxis = 'total'
  const yGroupBy = 'land_type'

  const units = 'dollars'

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    groupData = utils.groupBy(data.revenue_type_class_summary, 'revenue_type')
    // eslint-disable-next-line no-return-assign
    groupTotal = Object.keys(groupData).map(k => groupData[k].reduce((total, i) => total += i.total, 0)).reduce((total, s) => total += s, 0)
    nationalRevenueData = Object.entries(groupData)
  }

  return (
    <Container id={utils.formatToSlug(title)}>
      <Grid container>
        <Grid item xs={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2} display="flex" justifyContent="space-between">
            <Box component="h3" color="secondary.dark" display="inline" align="left">{title}</Box>
            <Box display={{ xs: 'none', sm: 'inline' }} align="right" position="relative" top={5}>
              <QueryLink
                groupBy={DFC.REVENUE_TYPE}
                linkType="FilterTable" {...props}>
                  Query nationwide revenue
              </QueryLink>
            </Box>
          </Box>
          <Box display={{ xs: 'block', sm: 'none' }} align="left">
            <QueryLink
              groupBy={DFC.REVENUE_TYPE}
              linkType="FilterTable" {...props}>
                  Query nationwide revenue
            </QueryLink>
          </Box>
        </Grid>
        <Grid container item xs={5} style={{ borderBottom: '2px solid #cde3c3' }}>
          <Box fontWeight="bold">Revenue type</Box>
        </Grid>
        <Grid container item xs={7} style={{ borderBottom: '2px solid #cde3c3' }}>
          <Hidden xsDown>
            <Grid item sm={6}>
              <Box fontWeight="bold" display="flex" justifyContent="flex-start" >Source</Box>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={6}>
            <Box fontWeight="bold" display="flex" justifyContent="flex-end">{`${ period } ${ year }`}</Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        { nationalRevenueData &&
          nationalRevenueData.map((item, i) => {
            return (
              <Box p={2} width="100%" borderBottom="1px solid rgba(224, 224, 224, 1)">
                <Grid container>
                  <Grid container item xs={12} sm={5}>
                    <Box key={i}>
                      <Box component="h4">{item[0]}</Box>
                      <Box component="p" pb={2} pr={{ xs: 0, md: 3 }}>
                        {revenueTypeDescriptions[i]}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid container item xs={12} sm={7}>
                    <Box mt={{ xs: 0, sm: 4 }} width="100%">
                      <StackedBarChart
                        key={`NRS${ year }_${ i }${ commodityKey }`}
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
                        // eslint-disable-next-line no-return-assign
                        barScale={item[1].reduce((total, i) => total += i.total, 0) / groupTotal }
                        units={units}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        yGroupBy={yGroupBy}
                        yOrderBy={yOrderBy}
                        horizontal
                        legendReverse={true}
                        primaryColor={theme.palette.chart.primary}
                        secondaryColor="#37253c"
                        colorRange={[
                          theme.palette.chart[600],
                          theme.palette.chart[500],
                          // theme.palette.chart[400],
                          // theme.palette.chart[300],
                          theme.palette.chart[200],
                          theme.palette.chart[100]
                        ]}
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

export default RevenueNationalSummary

RevenueNationalSummary.propTypes = {
  title: PropTypes.string
}
