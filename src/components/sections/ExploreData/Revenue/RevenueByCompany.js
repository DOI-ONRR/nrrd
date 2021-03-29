/* eslint-disable no-return-assign */
import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

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
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core'

import { makeStyles, useTheme } from '@material-ui/core/styles'

import StackedBarChart from '../../../data-viz/StackedBarChart/StackedBarChart'
import { HorizontalStackedBarChart } from '../../../data-viz/StackedBarChart'

import utils, { formatToDollarInt } from '../../../../js/utils'

// revenue type by land but just take one year of front page to do poc
const NATIONAL_REVENUE_SUMMARY_QUERY = gql`
  query RevenueNational($year: Int!, $commodities: [String!]) {
   federal_revenue_by_company_type_summary(order_by: {company_rank: asc, revenue: desc,  type_order: desc }, where: {calendar_year: {_eq: $year}, commodity: {_in: $commodities} }) {
    corporate_name
    calendar_year
    revenue_type
    commodity
    total
    percent_of_revenue
    revenue
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

const RevenueByCompany = props => {
  console.log('RevenueByCompany props: ', props)
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const { title } = props

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const { loading, error, data } = useQuery(NATIONAL_REVENUE_SUMMARY_QUERY, {
    variables: { year: year, commodities: commodities },
    skip: period !== 'Calendar Year' || inView === false
  })

  let groupData
  let groupTotal
  let remainingTotal
  let totalTotal
  let remainingPercent

  let nationalRevenueData
  const xAxis = 'year'
  const yAxis = 'revenue'
  const yGroupBy = 'revenue_type'
  const yOrderBy = 'revenue'

  const units = 'dollars'
  const colorRange = [
    theme.palette.explore[700],
    theme.palette.explore[600],
    theme.palette.explore[500],
    theme.palette.explore[400],
    theme.palette.explore[300],
    theme.palette.explore[200],
    theme.palette.explore[100]
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" id={utils.formatToSlug(title)} ref={ref} height={1340}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) return `Error! ${ error.message }`

  if (data && data.federal_revenue_by_company_type_summary.length > 0) {
    groupData = utils.groupBy(data.federal_revenue_by_company_type_summary, 'corporate_name')
    groupTotal = Object.keys(groupData).filter((d, i) => i < 1)
			 .map(k => groupData[k].reduce((revenue, i) => (revenue += i.revenue), 0)).reduce((revenue, s) => (revenue += s), 0)
    nationalRevenueData = Object.entries(groupData)
    nationalRevenueData = nationalRevenueData.sort((sortA, sortB) =>
	  (sortA[1].reduce((a, b) => +a + +b.revenue, 0) < sortB[1].reduce((a, b) => +a + +b.revenue, 0)) ? 1 : -1)

    totalTotal = nationalRevenueData.reduce((total, item) =>
	  (total += item[1].reduce((subtotal, subitem) => (subtotal += subitem.revenue), 0)), 0)

    remainingTotal = nationalRevenueData.filter((d, i) => i > 9)
					  .reduce((total, item) =>
					      (total += item[1].reduce((subtotal, subitem) => (subtotal += subitem.revenue), 0)), 0)

    remainingPercent = remainingTotal / totalTotal * 100

    return (
	  <Container id={utils.formatToSlug(title)} ref={ref}>
        <Grid container>
          <Grid item xs={12}>
            <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
		          <Box component="h3" color="secondary.dark">{title}</Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Hidden smDown>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>Company</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Percent</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>
                      <Box display="flex" justifyContent="space-between">
                        <Box component="span">Revenue type</Box>
                        <Box component="span">
                          {`${ period } ${ year }`}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { nationalRevenueData &&
                nationalRevenueData.filter((d, i) => i < 10).map((item, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box component="p" mt={0}>{item[0]}</Box>
                        <Box component="p"></Box>
                      </TableCell>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box mt={0}>{formatToDollarInt(item[1].reduce((a, b) => +a + +b.revenue, 0))}</Box>
                      </TableCell>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box mt={0}>{ (item[1].reduce((a, b) => +a + +b.revenue, 0) / totalTotal * 100).toFixed(2) }%</Box>
                      </TableCell>
                      <TableCell style={{ width: '45%' }}>
                        <HorizontalStackedBarChart
                          key={'NRS' + year + '_' + i}
                          data={item[1]}
                          collapsibleLegend={true}
                          collapsedLegend={true}
                          legendFormat={v => {
                            if (v === 0) {
                              return '-'
                            }
                            else {
                              return formatToDollarInt(v)
                            }
                          }}
                          legendHeaders={['', '']}
                          chartTooltip={
                            d => {
                              const r = []
                              r[0] = d.key
                              r[1] = formatToDollarInt(d[0].data[d.key])
                              return r
                            }
                          }
                          // eslint-disable-next-line no-return-assign
                          barScale={item[1].reduce((total, i) => total += i.revenue, 0) / groupTotal }
                          units={units}
                          xAxis={xAxis}
                          yAxis={yAxis}
                          yGroupBy={yGroupBy}
                          yOrderBy={yOrderBy}
                          horizontal
                          legendReverse={true}
                          colorRange={colorRange}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
                  }
                  { nationalRevenueData && <>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box component="h4" mt={0}>Other companies</Box>
                      </TableCell>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box mt={0}>{utils.formatToDollarInt(remainingTotal)}</Box>
                      </TableCell>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box mt={0}>{remainingPercent.toFixed(2)}%</Box>
                      </TableCell>
                      <TableCell style={{ verticalAlign: 'top', width: '45%' }}>
                        <QueryLink
                          groupBy={DFC.REVENUE_TYPE}
                          dataType={DFC.REVENUE_BY_COMPANY}
                          linkType="FilterTable"
                          {...props}
                          mt={0}>
                          Query revenue data for all { nationalRevenueData.length } companies.
                        </QueryLink>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box component="h4" mt={0}>Total</Box>
                      </TableCell>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box mt={0}>{utils.formatToDollarInt(totalTotal)}</Box>
                      </TableCell>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        <Box mt={0}>100%</Box>
                      </TableCell>
                      <TableCell style={{ verticalAlign: 'top', width: '45%' }}>
                      </TableCell>
                    </TableRow>
                  </>
                  }
                </TableBody>
              </Table>
            </Hidden>
            <Hidden mdUp>
              {nationalRevenueData &&
              nationalRevenueData.filter((d, i) => i < 10).map((item, i) => {
                return (
                  <Box pb={2} mb={2} border={1} borderTop={0} borderLeft={0} borderRight={0} borderColor={theme.palette.grey[400]}>
                    <Box fontWeight="bold">{item[0]}</Box>
                    <Box display="flex" justifyContent="flex-end">{utils.formatToDollarInt(item[1][0].total)}</Box>
                    <Box display="flex" justifyContent="flex-end">{item[1][0].percent_of_revenue.toFixed(2)}%</Box>
                    <Box display="flex" justifyContent="space-between" fontWeight="bold" mt={2}>
                      <Box component="span">Revenue type</Box>
                      <Box component="span">{`${ period } ${ year }`}</Box>
                    </Box>
                    <Box>
                      <StackedBarChart
                        key={'NRS' + year + '_' + i}
                        data={item[1]}
                        collapsibleLegend={true}
                        collapsedLegend={true}
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
                        chartTooltip={
                          d => {
                            const r = []
                            r[0] = d.key
                            r[1] = utils.formatToDollarInt(d[0].data[d.key])
                            return r
                          }
                        }
                        // eslint-disable-next-line no-return-assign
                        barScale={item[1].reduce((total, i) => total += i.revenue, 0) / groupTotal }
                        units={units}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        yGroupBy={yGroupBy}
                        yOrderBy={yOrderBy}
                        horizontal
                        legendReverse={true}
                        colorRange={[
                          theme.palette.explore[700],
                          theme.palette.explore[600],
                          theme.palette.explore[500],
                          theme.palette.explore[400],
                          theme.palette.explore[300],
                          theme.palette.explore[200],
                          theme.palette.explore[100]
                        ]}
                      />
                    </Box>
                  </Box>
                )
              })
              }
              { nationalRevenueData &&
                <>
                  <Box pb={2} mb={2} border={1} borderTop={0} borderLeft={0} borderRight={0} borderColor={theme.palette.grey[400]}>
                    <Box fontWeight="bold">Other companies</Box>
                    <Box display="flex" justifyContent="flex-end">{utils.formatToDollarInt(remainingTotal)}</Box>
                    <Box display="flex" justifyContent="flex-end">{remainingPercent.toFixed(2)}%</Box>
                    <Box>
                      <QueryLink
                        groupBy={DFC.REVENUE_TYPE}
                        dataType={DFC.REVENUE_BY_COMPANY}
                        linkType="FilterTable"
                        {...props}
                        mt={3}>
                          Query revenue data for all { nationalRevenueData.length } companies.
                      </QueryLink>
                    </Box>
                  </Box>
                  <Box pb={2} mb={2} border={1} borderTop={0} borderLeft={0} borderRight={0} borderColor={theme.palette.grey[400]}>
                    <Box fontWeight="bold">Total</Box>
                    <Box display="flex" justifyContent="flex-end">{utils.formatToDollarInt(totalTotal)}</Box>
                    <Box display="flex" justifyContent="flex-end">100%</Box>
                  </Box>
                </>
              }
            </Hidden>
          </Grid>
        </Grid>
	  </Container>
    )
  }
  else if (data && data.federal_revenue_by_company_type_summary.length === 0) {
    return (
      <Container id={utils.formatToSlug(title)} ref={ref}>
        <Grid container>
          <Grid item xs={12}>
            <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
		          <Box component="h3" color="secondary.dark">{title}</Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            There is no revenue by company data for { commodities || year }.
          </Grid>
        </Grid>
      </Container>
    )
  }
  else {
    return (
      <Box display="flex" justifyContent="center" id={utils.formatToSlug(title)} ref={ref} height={1340}>
        <CircularProgress />
      </Box>
    )
  }
}

export default RevenueByCompany

RevenueByCompany.propTypes = {
  title: PropTypes.string
}
