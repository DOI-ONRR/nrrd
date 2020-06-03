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
    position: 'absolute',
    bottom: 180,
    left: 10,
    '@media (max-width: 768px)': {
      bottom: 150,
      left: 5,
    },
    '& svg': {
      height: '.75em',
      width: '.75em',
    },
  },
}))

const MapControls = props => {
  const classes = useStyles()

  return (
    <Box className={classes.zoomButtonGroupContainer}>
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        aria-label="Explore data map zoom controls"
        classes={{ grouped: classes.buttonGroupGrouped }}>
        <Button onClick={() => props.handleClick('add')} role="button" aria-label="Map zoom in">
          <AddIcon />
        </Button>
        <Button onClick={() => props.handleClick('remove')} role="button" aria-label="Map zoom out">
          <RemoveIcon />
        </Button>
        <Button onClick={() => props.handleClick('refresh')} role="button" aria-label="Map reset">
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
