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
  console.log('ChartTooltip title: ', title)

  const getTooltipTitle = d => {
    return (
      <>
        <Box component="span">{d.data.recipient || d.data.source}</Box>
        <Box compnent="span">{formatToDollarInt(d.data.total)}</Box>
      </>
    )
  }

  const ChartTooltipDisplay = React.forwardRef((props, ref) => (
    <StyledTooltip
      title={getTooltipTitle(props.data)}
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
  children: PropTypes.string.isRequired,
  // title: PropTypes.string.isRequired
}
