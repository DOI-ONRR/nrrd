import React from 'react'
import { roundFormatParens } from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

const useStyles = makeStyles(theme => ({
  trendIconUp: {
    position: 'relative',
    marginRight: 5,
    top: 3,
    fontSize: 'large',
    color: theme.palette.orange[500],
  },
  trendIconDown: {
    position: 'relative',
    marginRight: 5,
    top: 3,
    fontSize: 'large',
    color: theme.palette.orange[300],
  }
}))

/**
* PercentDifference({currentAmount,previousAmount}) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  @return TriangleUpIcon || TriangleDownIcon
**/

const PercentDifference = ({ currentAmount, previousAmount }) => {
  const classes = useStyles()
  const percentChange = (currentAmount < previousAmount ? -1 : 1) * (Math.abs(currentAmount - previousAmount) / Math.abs(previousAmount)) * 100
  let icon
  if (percentChange > 0) {
    icon = <ArrowUpwardIcon className={classes.trendIconUp} />
  }
  else if (percentChange < 0) {
    icon = <ArrowDownwardIcon className={classes.trendIconDown} />
  }
  else if (percentChange === 0) {
    icon = <ArrowForwardIcon className={classes.trendIconDown} />
  }

  return (
    <span>
      { icon || '' }
      <span>
        { (percentChange === 0) ? 'Flat' : `${ roundFormatParens(percentChange, 0) }%`}
      </span>
    </span>
  )
}

export default PercentDifference
