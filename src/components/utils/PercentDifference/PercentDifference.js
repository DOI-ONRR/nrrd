import React from 'react'
import { roundFormatParens } from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

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
  const percentIncrease = ((currentAmount - previousAmount) / previousAmount) * 100
  let icon
  if (percentIncrease > 0) {
    icon = <ArrowUpwardIcon className={classes.trendIconUp} />
  }
  else if (percentIncrease < 0) {
    icon = <ArrowDownwardIcon className={classes.trendIconDown} />
  }

  return (
    <span>
      { icon || '' }
      <span>
        {`${ roundFormatParens(percentIncrease, 0) }%`}
      </span>
    </span>
  )
}

export default PercentDifference
