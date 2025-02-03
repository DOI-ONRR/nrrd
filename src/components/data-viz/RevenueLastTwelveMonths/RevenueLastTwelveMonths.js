import React from 'react'
import PropTypes from 'prop-types'

import { formatToDollarInt } from '../../../js/utils'
import StackedBarChart from '../StackedBarChart'

import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import createStyles from '@material-ui/styles/createStyles'
import withStyles from '@material-ui/styles/withStyles'

import withQueryManager from '../../withQueryManager'
import { QK_REVENUE_COMMON, SOURCE, COMMODITY, DISPLAY_NAMES } from '../../../constants'
import { max } from 'lodash'

/**
 * This displays data related to the Revenue for the last 12 months
 */
const RevenueLastTwelveMonths = ({ title, disableInteraction, yGroupBy, data, chartHeight, skeletonHeight, svgTitle, ...restProps }) => {
  const ChartContainer = withStyles(() =>
    createStyles({
      root: restProps.style,
    })
  )(Box)

  let yOrderBy
  switch (yGroupBy) {
  case SOURCE:
    yOrderBy = ['Federal - not tied to a lease', 'Native American', 'Federal offshore', 'Federal onshore']
    break
  case COMMODITY:
    yOrderBy = ['Not tied to a commodity', 'Other commodities', 'Coal', 'Gas', 'Oil']
    break
  default:
    yOrderBy = ['Other revenues', 'Inspection fees', 'Civil penalties', 'Rents', 'Bonus', 'Royalties']
    break
  }

  if (yGroupBy === COMMODITY && data) {
    data.results = Object.values(groupByCommodity(data.results))
  }

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
      const d = new Date(v)
      const m = d.toLocaleDateString('default', { month: 'short' })
      return m
    })
  }

  const maxEntry = data?.results.reduce((max, current) => {
    if (
      current.year > max.year ||
        (current.year === max.year && current.month > max.month)
    ) {
      return current
    }
    return max
  }, data?.results[0])

  const legendHeaders = (headers, row) => {
    const date = new Date(headers[1])
    const month = date.toLocaleString('default', { month: 'short' })
    const year = headers[1].substring(0, 4)
    const name = (yGroupBy === 'revenue_type') ? 'Revenue type' : DISPLAY_NAMES[headers[0]]?.default
    const headerArr = [name, `${ month } ${ year }`]
    return headerArr
  }

  return (
    <ChartContainer>
      {data
        ? <StackedBarChart
          title={`${ title } (${ maxEntry.month_long } ${ maxEntry.year })`}
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
          compact={true}
          disableInteraction={disableInteraction}
          svgTitle={svgTitle}
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
  /** Flag to disable the hover,select and click events of the stacked bar chart */
  disableInteraction: PropTypes.bool,
}

RevenueLastTwelveMonths.defaultProps = {
  yGroupBy: SOURCE,
  skeletonHeight: 400,
  disableInteraction: false,
}

export default withQueryManager(RevenueLastTwelveMonths, QK_REVENUE_COMMON)

function groupByCommodity (data) {
  return data.reduce((acc, item) => {
    const commodity = ['Not tied to a commodity', 'Oil', 'Gas', 'Coal'].includes(item.commodity) ? item.commodity : 'Other commodities'

    // Create a unique key for grouping based on source, revenue_type, month, year, commodity, and recipient
    const key = `${ item.source }-${ item.revenue_type }-${ item.month }-${ item.year }-${ commodity }-${ item.recipient }`

    // If the key doesn't exist in accumulator, create a new entry
    if (!acc[key]) {
      acc[key] = {
        source: item.source,
        revenue_type: item.revenue_type,
        month: item.month,
        year: item.year,
        commodity: commodity,
        sum: 0,
        recipient: item.recipient,
        month_long: item.month_long,
        period_date: item.period_date
      }
    }

    // Add the sum for this item to the grouped entry
    acc[key].sum += item.sum

    return acc
  }, {})
}
