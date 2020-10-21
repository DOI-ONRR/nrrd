import React, { useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { VariableSizeList } from 'react-window'

// import PropTypes from 'prop-types'

import { useTheme, makeStyles } from '@material-ui/core/styles'
import {
  TextField,
  useMediaQuery
} from '@material-ui/core'

import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

import { Autocomplete } from '@material-ui/lab'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import mapJson from '../../sections/ExploreData/us-topology.json'
import mapStatesOffshore from '../../sections/ExploreData/states-offshore.json'

const GUTTER_SIZE = 15

const useStyles = makeStyles(theme => ({
  root: {
    '& label': {
      width: 'auto',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      fontSize: '15px',
      marginTop: 4,
    },
    '& label.Mui-focused': {
      width: 'auto',
      marginTop: 0,
    },
  },
  autoCompleteRoot: {
    color: theme.palette.primary.dark,
    minWidth: 250,
    maxWidth: '100%',
    marginRight: theme.spacing(1),
    borderRadius: 4,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
  autoCompleteFocused: {
    borderRadius: 4,
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
  }
}))

// get region details from map object
const getRegionProperties = location => {
  // console.log('getRegionProperties input: ', location)
  const offshoreRegions = ['AKR', 'AOR', 'GMR', 'POR']
  let selectedObj

  switch (location.region_type) {
  case DFC.STATE:
    selectedObj = mapJson.objects.states.geometries.filter(obj => {
      if (obj.id.toLowerCase() === location.fips_code.toLowerCase()) {
        return Object.assign(obj, { locData: location })
      }
    })
    break
  case DFC.COUNTY_CAPITALIZED:
    selectedObj = mapJson.objects.counties.geometries.filter(obj => {
      if (parseInt(obj.properties.FIPS) === parseInt(location.fips_code)) {
        return Object.assign(obj, { locData: location })
      }
    })
    break
  case DFC.OFFSHORE_CAPITALIZED:
    // console.log('mapStatesOffshore: ', mapStatesOffshore)
    if (offshoreRegions.includes(location.fips_code)) {
      return { id: location.fips_code, properties: { region: location.fips_code, name: location.location_name } }
    }
    else {
      selectedObj = mapStatesOffshore.objects['states-offshore-geo'].geometries.filter(obj => {
        // console.log('offshore obj: ', obj)
        if (obj.id.toLowerCase() === location.fips_code.toLowerCase()) {
          return Object.assign(obj, { locData: location })
        }
        else {
          console.warn(`Unable to find offshore id '${ location.fips_code }' in states-offshore-geo`)
        }
      })
    }
    break
  default:
    console.warn('Unable to find state, county or offshore area')
    break
  }

  return selectedObj
}

// useResetCache
const useResetCache = data => {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

// Render rows
const RenderRow = props => {
  const { data, index, style } = props
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + GUTTER_SIZE,
    }
  })
}

// Listbox component
const ListboxComponent = React.forwardRef((props, ref) => {
  const { children, role, ...other } = props

  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'))
  const itemData = React.Children.toArray(children)
  const itemCount = itemData.length
  const itemSize = smUp ? 50 : 45

  // console.log('ListboxComponent itemCount: ', itemData, itemCount)
  const getChildSize = child => {
    const charCount = child.props.children.props.children.length
    if (React.isValidElement(child) && charCount > 20) {
      return 100
    }

    return itemSize
  }

  const listRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <div {...other}>
        <VariableSizeList
          height={150}
          width={300}
          ref={listRef}
          itemCount={itemCount}
          itemData={itemData}
          itemSize={index => getChildSize(itemData[index])}
          innerElementType="ul"
          role="listbox"
          overscanCount={10}
          // debug={true}
        >
          {RenderRow}
        </VariableSizeList>
      </div>
    </div>
  )
})

// SearchLocationsInput
const SearchLocationsInput = props => {
  const data = useStaticQuery(graphql`
    query LocationQuery {
      onrr {
        state_locations: location(
          where: {
            fips_code: {_neq: ""},
            region_type: {_eq: "State"}
          },
          distinct_on: fips_code,  
        ) {
          fips_code
          location_name
          region_type
          state
          state_name
          county
        }

        county_locations: location(
          where: {
            fips_code: {_neq: ""},
            region_type: {_eq: "County"}
          },
          distinct_on: fips_code,  
        ) {
          fips_code
          location_name
          region_type
          state
          state_name
          county
        }

        offshore_locations: location(
          where: {
            fips_code: {_neq: ""},
            region_type: {_eq: "Offshore"}
          },
          distinct_on: fips_code,  
        ) {
          fips_code
          location_name
          region_type
          state
          state_name
          county
        }
      }
    }
`)

  const classes = useStyles()
  const [input, setInput] = useState('')
  const [keyCount, setKeyCount] = useState(0)
  const { onLink } = props

  const handleSearch = event => {
    setInput(event.target.value)
  }

  const handleChange = val => {
    // console.log('handleChange val: ', val)
    try {
      const item = getRegionProperties(val)
      onLink(item[0] ? item[0] : item)
      setInput('')
      setKeyCount(keyCount + 1)
    }
    catch (err) {
      console.error('Oh no, seems there was an error trying to grab that location', err)
    }
  }

  const renderOptionLabel = item => {
    let optionLabel
    switch (item.region_type) {
    case DFC.STATE:
      optionLabel = item.state_name
      break
    case DFC.COUNTY_CAPITALIZED:
      optionLabel = `${ item.county } ${ DFC.COUNTY_CAPITALIZED }, ${ item.state_name }`
      break
    case DFC.OFFSHORE_CAPITALIZED:
      optionLabel = item.location_name.includes('Offshore') ? item.location_name : `${ item.location_name } ${ item.region_type }`
      break
    default:
      optionLabel = item.location_name
      break
    }

    return optionLabel
  }

  const stateLocations = data.onrr.state_locations.map(location => ({ ...location, locationLabel: renderOptionLabel(location) }))
  const countyLocations = data.onrr.county_locations.map(location => ({ ...location, locationLabel: renderOptionLabel(location) }))
  const offshoreLocations = data.onrr.offshore_locations.map(location => ({ ...location, locationLabel: renderOptionLabel(location) }))

  const OPTIONS = [...stateLocations, ...countyLocations, ...offshoreLocations]

  return (
    <Autocomplete
      key={keyCount}
      id="location-select"
      disableListWrap
      inputValue={input}
      options={OPTIONS}
      ListboxComponent={ListboxComponent}
      getOptionLabel={option => option.locationLabel}
      style={{ width: '100%', maxWidth: 250 }}
      renderInput={params => (
        <TextField
          {...params}
          label="Add state, county, or offshore"
          variant="outlined"
          fullWidth
          onChange={handleSearch}
        />
      )}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.locationLabel, inputValue)
        const parts = parse(option.locationLabel, matches)

        return (
          <div>
            {parts.map((part, index) => (
              <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                {part.text}
              </span>
            ))}
          </div>
        )
      }}
      onChange={(e, v) => handleChange(v)}
      popupIcon={<KeyboardArrowDown className="MuiSvgIcon-root MuiSelect-icon" />}
      classes={{
        root: classes.root,
        inputRoot: classes.autoCompleteRoot,
        focused: classes.autoCompleteFocused,
      }}
      size="small"
    />
  )
}

export default SearchLocationsInput
