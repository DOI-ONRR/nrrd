import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'
import { StoreContext } from '../../../store'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import AddCardButton from './AddCardButton'
import mapJson from './us-topology.json'

const APOLLO_QUERY = gql`
  query DistinctLocationsQuery {
    distinct_locations(where: {location: {_neq: ""}}) {
      location
      location_id
      sort_order
    }
  }
`

const useStyles = makeStyles(theme => ({
  root: {},
  addLocationCard: {
    background: `${ theme.palette.grey['100'] }`,
    '& div:nth-child(1)': {
      background: `${ theme.palette.grey['100'] } !important`,
      '& > span': {
        color: `${ theme.palette.common.black } !important`,
      }
    },
    '& .MuiCardContent-root div': {
      textAlign: 'left',
    }
  },
  cardButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& .MuiButton-root': {
      marginRight: theme.spacing(2),
    },
  },
  addCardButtonContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'right',
    '& button': {
      padding: theme.spacing(0.5),
      color: theme.palette.common.black,
      backgroundColor: theme.palette.common.white,
      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    '@media (max-width: 768px)': {
      textAlign: 'left',
    }
  },
  searchString: {
    fontWeight: 700,
  },
  cardHeader: {
    padding: 10,
    height: 75,
    fontSize: '1.2rem',
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
  },
  cardHeaderContent: {
    fontSize: theme.typography.h3.fontSize,
  },
  autoCompleteRoot: {
    background: theme.palette.background.default,
    color: theme.palette.primary.dark,
  },
  autoCompleteFocused: {
    color: theme.palette.primary.dark,
  },
}))

// get region details from map object
const getRegionProperties = input => {
  // check for fips_code that are only 4 digits, the data values should all be 5
  input = input.length === 4 ? input = `0${ input }` : input

  let selectedObj
  if (input.length > 2) {
    selectedObj = mapJson.objects.counties.geometries.filter(obj => {
      if (obj.properties.FIPS.toLowerCase() === input.toLowerCase()) {
        return obj.properties
      }
    })
  }
  else {
    selectedObj = mapJson.objects.states.geometries.filter(obj => {
      if (obj.properties.abbr.toLowerCase() === input.toLowerCase()) {
        return obj.properties
      }
    })
  }

  return selectedObj
}

const AddLocationCard = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]

  const [input, setInput] = useState(null)
  const [keyCount, setKeyCount] = useState(0)

  const {
    cardMenuItems,
    onLink
  } = props

  const handleSearch = event => {
    setInput(event.target.value)
  }

  const handleChange = val => {
    if (val) {
      const item = getRegionProperties(val.location_id)[0]
      props.onLink(item)
      setInput(null)
      setKeyCount(keyCount + 1)
    }
  }

  const renderLabel = item => {
    const label = item
    const searchString = input

    if (searchString) {
      const index = label.toLowerCase().indexOf(searchString.toLowerCase())

      if (index !== -1) {
        const length = searchString.length
        const prefix = label.substring(0, index)
        const suffix = label.substring(index + length)
        const match = label.substring(index, index + length)

        return (
          <span>
            {prefix}<Box variant="span" fontWeight="bold" display="inline">{match}</Box>{suffix}
          </span>
        )
      }
    }

    return (
      <span>{label}</span>
    )
  }

  const { loading, error, data } = useQuery(APOLLO_QUERY)

  if (loading) {}
  if (error) return `Error! ${ error.message }`

  return (
    <>
      { (data && data.distinct_locations.length > 0) &&
        <Card className={classes.addLocationCard}>
          <CardHeader
            title={props.title}
            classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
            disableTypography
          />
          <CardContent>
            <Autocomplete
              key={keyCount}
              id="location-select"
              autoComplete
              inputValue={input}
              options={data.distinct_locations}
              getOptionLabel={option => option.location}
              style={{ width: '100%' }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Search locations..."
                  variant="outlined"
                  fullWidth
                  onChange={handleSearch}
                />
              )}
              renderOption={option => renderLabel(option.location)}
              onChange={(e, v) => handleChange(v)}
              classes={{
                inputRoot: classes.autoCompleteRoot,
                focused: classes.autoCompleteFocused,
              }}
            />
          </CardContent>
          <CardActions>
            { cardMenuItems.length > 0 &&
              <AddCardButton onLink={onLink} cardMenuItems={cardMenuItems} />
            }
          </CardActions>
        </Card>
      }
    </>
  )
}

export default AddLocationCard

AddLocationCard.propTypes = {
  // Title of location card
  title: PropTypes.string
}
