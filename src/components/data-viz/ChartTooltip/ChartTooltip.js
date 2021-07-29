import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, createStyles } from '@material-ui/core/styles'
import { Box, Tooltip } from '@material-ui/core'

// not used import { formatToDollarInt } from '../../../js/utils'

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

const ChartTooltip = ({ children, title, ...rest }) => {
  // console.log('ChartTooltip rest: ', rest)

  const getTooltipTitle = (d, chartTooltip) => {
    const data = chartTooltip(d)

    if (data && data.length > 0) {
      return (
        <>
          <Box>{data[0]}</Box>
          <Box>{data[1]}</Box>
        </>
      )
    }
    else {
      return (
        <>
          <Box component="span">No tooltip title found</Box>
        </>
      )
    }
  }

  const ChartTooltipDisplay = React.forwardRef((props, ref) => (
    <StyledTooltip
      title={getTooltipTitle(props.data, props.chartTooltip)}
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

export default ChartTooltip

ChartTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // title: PropTypes.string.isRequired
}
