import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Button,
  ButtonGroup
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import RefreshIcon from '@material-ui/icons/Refresh'

const useStyles = makeStyles(theme => ({
  buttonGroupGrouped: {
    padding: theme.spacing(0.5),
    background: theme.palette.background.default,
    margin: 0,
  },
  zoomButtonGroupContainer: {
    left: 10,
    bottom: 170,
    height: 100,
    position: 'absolute',
    '@media (max-width: 768px)': {
      transform: 'scale(0.75)',
      left: 0,
    },
    '& svg': {
      height: '.75em',
      width: '.75em',
    },
  },
}))

const MapControls = props => {
  const classes = useStyles()

  const {
    handleClick,
  } = props

  return (
    <Box className={classes.zoomButtonGroupContainer}>
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        aria-label="Explore data map zoom controls"
        classes={{ grouped: classes.buttonGroupGrouped }}>
        <Button onClick={() => handleClick('add')} role="button" id="zoom-in" aria-label="Map zoom in">
          <AddIcon />
        </Button>
        <Button onClick={() => handleClick('remove')} role="button" id="zoom-out" aria-label="Map zoom out">
          <RemoveIcon />
        </Button>
        <Button onClick={() => handleClick('refresh')} role="button" id="zoomXYZreset" aria-label="Map reset">
          <RefreshIcon />
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export default MapControls

MapControls.propTypes = {
  // onClick handler for map
  handleClick: PropTypes.func.isRequired
}
