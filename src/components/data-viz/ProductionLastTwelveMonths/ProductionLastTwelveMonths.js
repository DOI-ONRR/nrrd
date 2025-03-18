import React from 'react'
import PropTypes from 'prop-types'

import { formatToCommaInt } from '../../../js/utils'
import StackedBarChart from '../StackedBarChart'

import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import createStyles from '@material-ui/styles/createStyles'
import withStyles from '@material-ui/styles/withStyles'

import withQueryManager from '../../withQueryManager'
import { QK_PRODUCTION_COMMON, SOURCE } from '../../../constants'

/**
 * This displays data related to the Production for the last 12 months
 */
const ProductionLastTwelveMonths = ({ title, disableInteraction, filterByProduct, yGroupBy, units, data, chartHeight, skeletonHeight, svgTitle, ...restProps }) => {
  const ChartContainer = withStyles(() =>
    createStyles({
      root: restProps.style,
    })
  )(Box)

  // TODO get rid of hardcoded order by
  // const yOrderByTest = [...new Set(data?.results.map(item => item.recipient))]
  const yOrderBy = (yGroupBy === SOURCE)
    ? ['Native American', 'Federal offshore', 'Federal onshore']
    : ['Other Revenues', 'Inspection Fees', 'Civil Penalties', 'Rents', 'Bonus', 'Royalties']

  const xGroups = data?.results?.filter(row => row.product === filterByProduct).reduce((g, row, i) => {
    const r = g
    const year = row.period_date.substring(0, 4)
    const months = g[year] || []
    months.push(row.month)
    r[year] = months
    return r
  }, [])

  const xLabels = (x, i) => {
    return x.map(v => {
      const d = new Date(`${ v }T00:00:00`)
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
    const date = new Date(`${ headers[1].__data__ }T00:00:00`)
    const month = date.toLocaleString('default', { month: 'short' })
    const year = headers[1].__data__.substring(0, 4)
    const headerArr = [headers[0], `${ month } ${ year }`]
    return headerArr
  }

  return (
    <ChartContainer>
      {data
        ? <StackedBarChart
          title={`${ title } (${ maxEntry.month_long } ${ maxEntry.year })`}
          units={units}
          data={data.results.filter(row => row.product === filterByProduct)}
          xAxis={'period_date'}
          yAxis={'sum'}
          xGroups={xGroups}
          yGroupBy={yGroupBy}
          yOrderBy={yOrderBy}
          xLabels={xLabels}
          legendFormat={v => formatToCommaInt(v)}
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

ProductionLastTwelveMonths.propTypes = {
  /** The title for the chart */
  title: PropTypes.string,
  /** Defines which property of the data will be used to group the y axis */
  yGroupBy: PropTypes.string,
  /** The data that is returned from the graphql query */
  data: PropTypes.object,
  /** Flag to disable the hover,select and click events of the stacked bar chart */
  disableInteraction: PropTypes.bool,
  svgTitle: PropTypes.string,
}

ProductionLastTwelveMonths.defaultProps = {
  yGroupBy: SOURCE,
  skeletonHeight: 400,
  disableInteraction: false,
  svgTitle: ''
}

export default withQueryManager(ProductionLastTwelveMonths, QK_PRODUCTION_COMMON)
