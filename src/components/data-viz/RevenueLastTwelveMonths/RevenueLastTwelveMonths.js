import React from 'react'
import PropTypes from 'prop-types'

import { formatToDollarInt } from '../../../js/utils'
import StackedBarChart from '../StackedBarChart'

import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import createStyles from '@material-ui/styles/createStyles'
import withStyles from '@material-ui/styles/withStyles'

import withQueryManager from '../../withQueryManager'
import { QK_REVENUE_COMMON, SOURCE } from '../../../constants'

/**
 * This displays data related to the Revenue for the last 12 months
 */
const RevenueLastTwelveMonths = ({ title, yGroupBy, data, chartHeight, skeletonHeight, ...restProps }) => {
  const ChartContainer = withStyles(() =>
    createStyles({
      root: restProps.style,
    })
  )(Box)

  // TODO get rid of hardcoded order by
  // const yOrderByTest = [...new Set(data?.results.map(item => item.recipient))]
  const yOrderBy = (yGroupBy === SOURCE)
    ? ['Federal - not tied to a location', 'Native American', 'Federal Offshore', 'Federal Onshore']
    : ['Other Revenues', 'Inspection Fees', 'Civil Penalties', 'Rents', 'Bonus', 'Royalties']

  const xGroups = data?.results.reduce((g, row, i) => {
    const r = g
    const year = row.period_date.substring(0, 4)
    const months = g[year] || []
    months.push(months)
    r[year] = months
    return r
  }, {})

  const xLabels = (x, i) => {
    return x.map(v => {
      const dStr = v.replace(/\b0/g, '')
      const d = new Date(dStr)
      const m = d.toLocaleDateString('default', { month: 'short' })
      return m
    })
  }

  const legendHeaders = (headers, row) => {
    const dStr = headers[2].replace(/\b0/g, '')
    const date = new Date(dStr)
    const month = date.toLocaleString('default', { month: 'short' })
    const year = headers[2].substring(0, 4)
    const headerArr = [headers[0], '', `${ month } ${ year }`]
    return headerArr
  }
  console.log(yGroupBy)
  return (
    <ChartContainer>
      {data
        ? <StackedBarChart
          title={title}
          units={'dollars'}
          data={data.results}
          xAxis={'period_date'}
          yAxis={'sum'}
          xGroups={xGroups}
          yGroupBy={yGroupBy}
          yOrderBy={yOrderBy}
          xLabels={xLabels}
          legendFormat={v => formatToDollarInt(v)}
          legendHeaders={legendHeaders}
          chartHeight={chartHeight}
        />
        : <Skeleton variant="rect" height={skeletonHeight} animation="wave" />
      }
    </ChartContainer>
  )
}

RevenueLastTwelveMonths.propTypes = {
  /** The title for the chart */
  title: PropTypes.string,
  /** Defines which property of the data will be used to group the y axis */
  yGroupBy: PropTypes.string,
  /** The data that is returned from the graphql query */
  data: PropTypes.object,
}

RevenueLastTwelveMonths.defaultProps = {
  yGroupBy: SOURCE,
  skeletonHeight: 400,
}

export default withQueryManager(RevenueLastTwelveMonths, QK_REVENUE_COMMON)
