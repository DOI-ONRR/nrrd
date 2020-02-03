import React from 'react'
import utils from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'

import TriangleUpIcon from '-!svg-react-loader!../../../img/svg/arrow-up.svg'
import TriangleDownIcon from '-!svg-react-loader!../../../img/svg/arrow-down.svg'

const useStyles = makeStyles(theme => ({
  trendIcon: {
    position: 'relative',
    marginRight: 5,
    top: 5,
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
        ? <TriangleUpIcon className={classes.trendIcon} viewBox="-20 -15 50 40"/>
        : <TriangleDownIcon className={classes.trendIcon} viewBox="-20 -10 50 40"/>
      }
      <span>
        {utils.round(percentIncrease, 0) + '%'}
      </span>
    </span>
  )
}


export default PercentDifference
