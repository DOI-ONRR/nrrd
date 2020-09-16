import React from 'react'
import utils from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

const useStyles = makeStyles(theme => ({
  trendIcon: {
    position: 'relative',
    marginRight: 5,
    top: 3,
    fontSize: 'large',
    color: theme.palette.orange[200],
  },
}))

/**
* PercentDifference({currentAmount,previousAmount}) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  @return TriangleUpIcon || TriangleDownIcon
**/

const PercentDifference = ({ currentAmount, previousAmount }) => {
  const classes = useStyles()
  const percentIncrease = ((currentAmount - previousAmount) / previousAmount) * 100
  return (
    <span>
      {percentIncrease > 0
        ? <ArrowUpwardIcon className={classes.trendIcon} />
        : <ArrowDownwardIcon className={classes.trendIcon} />
      }
      <span>
        {utils.round(percentIncrease, 0) + '%'}
      </span>
    </span>
  )
}

export default PercentDifference
