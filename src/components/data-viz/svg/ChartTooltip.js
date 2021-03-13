import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, createStyles } from '@material-ui/core/styles'
import { Box, Tooltip } from '@material-ui/core'

import { formatToDollarInt } from '../../../js/utils'

const StyledTooltip = withStyles(theme =>
  createStyles({
    tooltip: {
      backgroundColor: theme.palette.info.dark,
      color: theme.palette.common.white,
      boxShadow: theme.shadows[2],
      fontSize: theme.typography.fontSize,
      textAlign: 'center'
    },
  })
)(Tooltip)

export const ChartTooltip = ({ children, title, ...rest }) => {
  // console.log('ChartTooltip rest: ', rest)

  // TODO: should get tooltip format from chart format
  const getTooltipTitle = (d, xAxis, yAxis, format) => {
    return (
      <>
        <Box component="span">{d.data[xAxis]}</Box>
        <Box compnent="span">{format(d.data[yAxis])}</Box>
      </>
    )
  }

  const ChartTooltipDisplay = React.forwardRef((props, ref) => (
    <StyledTooltip
      title={getTooltipTitle(props.data, props.xAxis, props.yAxis, props.format)}
      enterDelay={100}
      leaveDelay={250}
      enterTouchDelay={100}
      leaveTouchDelay={3000}
      arrow
      placement="top"
      ref={ref}>
      {children}
    </StyledTooltip>
  ))

  return (
    <>
      <ChartTooltipDisplay tabIndex='0' {...rest} />
    </>
  )
}

ChartTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // title: PropTypes.string.isRequired
}
