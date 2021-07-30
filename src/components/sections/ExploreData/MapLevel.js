import React, { useContext } from 'react'

import {
  Box
} from '@material-ui/core'

import { withStyles, createStyles } from '@material-ui/core/styles'

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
    { value: false, option: false },
    { value: true, option: true }
  ]
}

const MapLevelContainer = withStyles(theme =>
  createStyles({
    root: {
      position: 'absolute',
      top: 10,
      left: 10,
      height: 'auto',
      '@media and (max-width: 600px)': {
        top: 5,
        left: 5,
      },
      '& > div:last-child': {
        position: 'relative',
        top: -15,
      }
    },
  })
)(Box)

const MapLevel = props => {
  const { state: filterState } = useContext(DataFilterContext)

  const {
    dataType,
    mapLevel,
    offshoreRegions
  } = filterState

  // const mapLevelLabel = `Map level ${ mapLevel || DFC.STATE } ${ offshoreRegions ? ' and offshore' : '' }`
  const offshore = (offshoreRegions === true || (offshoreRegions === 1 || offshoreRegions === '1'))

  return (
    <MapLevelContainer>
      <MapLevelToggleInput
        dataFilterKey={MAP_LEVEL}
        defaultSelected={mapLevel || DFC.STATE}
        data={MAP_LEVEL_OPTIONS[MAP_LEVEL]}
        label="Map level toggle"
        legend={false}
        size="small"
        disabled={false} />
      <OffshoreRegionsSwitchInput
        dataFilterKey={OFFSHORE_REGIONS}
        data={MAP_LEVEL_OPTIONS[OFFSHORE_REGIONS]}
        defaultSelected={offshore}
        label='Show offshore'
        helperText='Disbursements from offshore production go to the states and counties that surround the offshore area.'
        disabled={dataType === 'Disbursements'}
        selectType='Single' />
    </MapLevelContainer>
  )
}

export default MapLevel
