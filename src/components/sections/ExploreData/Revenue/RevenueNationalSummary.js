
import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useQuery, gql } from 'urql'

import QueryLink from '../../../../components/QueryLink'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import { useInView } from 'react-intersection-observer'
import CircularProgress from '@material-ui/core/CircularProgress'

import {
  Box,
  Container,
  Grid,
  Hidden,
  Typography
} from '@material-ui/core'

import { makeStyles, useTheme } from '@material-ui/core/styles'

import { HorizontalStackedBarChart } from '../../../data-viz/StackedBarChart'
import RevenueLocationTotal from './RevenueLocationTotal'

import utils, { formatToDollarInt } from '../../../../js/utils'

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
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    width: '100%',
    margin: theme.spacing(1),
    '@media (max-width: 768px)': {
      maxWidth: '100%',
    },
  },
  progressContainer: {
    maxWidth: '25%',
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(3),
      marginRight: 'auto',
      marginLeft: 'auto',
    }
  },
  circularProgressRoot: {
    color: theme.palette.primary.dark,
  }
}))

const revenueTypeDescriptions = [
  'Once the land or water produces enough resources to pay royalties, the leaseholder pays royalties to the federal government.',
  'Companies bid on and lease lands and waters from the federal government.  They pay a bonus when they win a lease.',
  'Leaseholders pay rent until the land or water starts producing resources.',
  // eslint-disable-next-line max-len
  'This category includes revenues that are not included in the royalty, rent, or bonus categories. Other revenues contain minimum royalties, estimated royalties, settlement agreements, and interest.',
  'ONRR issues civil penalties when companies fail to comply with, or knowingly or willfully violate, regulations or laws.',
  // eslint-disable-next-line max-len
  'The Department of the Interior inspects offshore oil and gas drilling rigs at least once a year. Inspection fees help recover some of the costs associated with these inspections.'
]

const RevenueNationalSummary = props => {
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const commodityKey = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'All'
  const { title } = props

  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const [result, _reexecuteQuery] = useQuery({
    query: NATIONAL_REVENUE_SUMMARY_QUERY,
    variables: { 
      year: year, 
      period: period, 
      commodities: commodities 
    },
    pause: inView === false,
  });

  const { data, fetching, error } = result;

  const yOrderBy = ['Federal Onshore', 'Federal Offshore', 'Native American', 'Federal - Not tied to a lease']

  let groupData
  let groupTotal
  let nationalRevenueData
  const xAxis = 'year'
  const yAxis = 'total'
  const yGroupBy = 'land_type'

  const units = 'dollars'

  const colorRange = [
    theme.palette.explore[700],
    theme.palette.explore[500],
    theme.palette.explore[300],
    theme.palette.explore[100]
  ]

  if (fetching) {
    return (
	    <Box display="flex" justifyContent="center" id={utils.formatToSlug(title)} ref={ref} height={2022}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    groupData = utils.groupBy(data.revenue_type_class_summary, 'revenue_type')
    // eslint-disable-next-line no-return-assign
    groupTotal = Object.keys(groupData).map(k => groupData[k].reduce((total, i) => total += i.total, 0)).reduce((total, s) => total += s, 0)
    nationalRevenueData = Object.entries(groupData)

    return (
      <Container id={utils.formatToSlug(title)} ref={ref}>
        <Grid container>
          <Grid item md={12}>
            <Box mt={10} mb={1} color="secondary.main" borderBottom={5}>
              <Box component="h2" color="secondary.dark">Nationwide revenue summary</Box>
            </Box>
            <Typography variant="body1">
              <RevenueLocationTotal />
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Box color="secondary.main" mb={2} borderBottom={2} display="flex" justifyContent="space-between">
              <Box component="h3" color="secondary.dark" display="inline" align="left">Nationwide revenue by revenue type and source</Box>
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
                      <HorizontalStackedBarChart
                        key={`NRS${ year }_${ i }${ commodityKey }`}
                        data={item[1]}
                        legendFormat={v => {
                          if (v === 0) {
                            return '-'
                          }
                          else {
                            return formatToDollarInt(v)
                          }
                        }}
                        // legendHeaders two dimensional array
                        legendHeaders={['', '']}
                        // chartTooltip two dimensional array
                        chartTooltip={
                          d => {
                            // console.log('RNS chartTooltip d: ', d)
                            const r = []
                            r[0] = d.key
                            r[1] = formatToDollarInt(d[0].data[d.key])
                            return r
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
      <Box display="flex" justifyContent="center" id={utils.formatToSlug(title)} ref={ref} height={2022}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </Box>
    )
  }
}

export default RevenueNationalSummary

RevenueNationalSummary.propTypes = {
  title: PropTypes.string
}
