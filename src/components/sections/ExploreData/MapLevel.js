import React, { useContext, useState } from 'react'

import {
  Box,
  Button,
  Menu,
  MenuItem
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import {
  MapLevelToggleInput,
  OffshoreRegionsSwitchInput
} from '../../inputs'

import {
  DATA_FILTER_CONSTANTS as DFC,
  OFFSHORE_REGIONS,
  MAP_LEVEL
} from '../../../constants'

import { DataFilterContext } from '../../../stores/data-filter-store'

const MAP_LEVEL_OPTIONS = {
  [MAP_LEVEL]: [
    { value: DFC.STATE, option: DFC.STATE },
    { value: DFC.COUNTY_CAPITALIZED, option: DFC.COUNTY_CAPITALIZED }
  ],
  [OFFSHORE_REGIONS]: [
    { value: false, option: '' },
    { value: true, option: '' }
  ]
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 10,
    left: 10,
    height: 'auto',
    '@media and (max-width: 600px)': {
      top: 5,
      left: 5,
    }
  },
  mapLevelButton: {
    background: theme.palette.common.white,
    color: theme.palette.common.black,
    '&:hover': {
      background: theme.palette.common.white,
    }
  },
  menuItem: {
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    }
  }
}))

const MapLevel = props => {
  const classes = useStyles()

  const { state: filterState } = useContext(DataFilterContext)

  const {
    mapOverlay
  } = props

  const {
    dataType,
    mapLevel,
    offshoreRegions
  } = filterState

  const secondaryOptionLabel = `${ mapLevel || DFC.STATE } ${ (offshoreRegions === true) ? ' and offshore' : '' }`

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box className={classes.root}>
      <Button
        variant="contained"
        aria-haspopup="true"
        aria-controls="map-level-menu"
        aria-label="Map level"
        size="small"
        onClick={handleClickListItem}
        className={classes.mapLevelButton}>
          Map level <strong>&nbsp;{secondaryOptionLabel}</strong>
      </Button>
      <Menu
        id="map-level-menu"
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl}
        onClose={handleClose}>
        <MenuItem key={0} className={classes.menuItem}>
          <MapLevelToggleInput
            dataFilterKey={MAP_LEVEL}
            defaultSelected={mapLevel || DFC.STATE}
            data={MAP_LEVEL_OPTIONS[MAP_LEVEL]}
            label="Map level toggle"
            legend="Map level"
            size="small"
            disabled={mapOverlay} />
        </MenuItem>
        <MenuItem key={1} className={classes.menuItem}>
          <OffshoreRegionsSwitchInput
            dataFilterKey={OFFSHORE_REGIONS}
            data={MAP_LEVEL_OPTIONS[OFFSHORE_REGIONS]}
            defaultSelected={offshoreRegions === true}
            label='Show offshore'
            helperText='Disbursements from offshore production go to the states and counties that surround the offshore area.'
            disabled={dataType === 'Disbursements' || mapOverlay}
            selectType='Single' />
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default MapLevel
