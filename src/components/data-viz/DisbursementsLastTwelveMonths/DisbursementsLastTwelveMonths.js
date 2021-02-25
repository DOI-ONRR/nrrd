import React from 'react'
import PropTypes from 'prop-types'

import { formatToDollarInt } from '../../../js/utils'
import StackedBarChart from '../StackedBarChart'

import Box from '@material-ui/core/Box'
import withStyles from '@material-ui/styles/withStyles'
import createStyles from '@material-ui/styles/createStyles'
import Skeleton from '@material-ui/lab/Skeleton'

import withQueryManager from '../../withQueryManager'
import { QK_DISBURSEMENTS_COMMON, RECIPIENT } from '../../../constants'

/**
 * This displays data related to the Disbursements by recipient for the last 12 months
 */
const DisbursementsLastTwelveMonths = ({ title, yGroupBy, data, disableInteraction, chartHeight, skeletonHeight, ...restProps }) => {
  const ChartContainer = withStyles(() =>
    createStyles({
      root: {
        ...restProps?.style,
      }
    })
  )(Box)

  const yOrderBy = [
    'Other funds',
    'Historic Preservation Fund',
    'Land and Water Conservation Fund',
    'Native American tribes and individuals',
    'Reclamation Fund',
    'State and local governments',
    'U.S. Treasury'
  ]

  // TODO add a sort order in the view for recipient
  // also make sure you can group by any property
  // const yOrderByTest = [...new Set(data?.results.map(item => item.recipient))]

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
          compact={true}
          disableInteraction={disableInteraction}
        />
        : <Skeleton variant="rect" height={skeletonHeight} animation="wave" />
      }
    </ChartContainer>
  )
}

DisbursementsLastTwelveMonths.propTypes = {
  /** The title for the chart */
  title: PropTypes.string,
  /** Defines which property of the data will be used to group the y axis */
  yGroupBy: PropTypes.string,
  /** The data that is returned from the graphql query */
  data: PropTypes.object,
  /** Flag to disable the hover,select and click events of the stacked bar chart */
  disableInteraction: PropTypes.bool,
}

DisbursementsLastTwelveMonths.defaultProps = {
  yGroupBy: RECIPIENT,
  skeletonHeight: 400,
  disableInteraction: false,
}

export default withQueryManager(DisbursementsLastTwelveMonths, QK_DISBURSEMENTS_COMMON)
