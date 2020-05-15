import React, { useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { VariableSizeList } from 'react-window'
// import { List } from 'react-virtualized'

import PropTypes from 'prop-types'

import { useTheme, makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ListSubheader,
  TextField,
  useMediaQuery
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'

import AddCardButton from './AddCardButton'
import mapJson from './us-topology.json'
import mapStatesOffshore from './states-offshore.json'

const GUTTER_SIZE = 5

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
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  }
}))

// get region details from map object
const getRegionProperties = input => {
  console.log('getRegionProperties input: ', input)
  // check for fips_code that are only 4 digits, the data values should all be 5
  input = input.length === 4 ? input = `0${ input }` : input

  let selectedObj

  switch (input.length) {
  case 2:
    selectedObj = mapJson.objects.states.geometries.filter(obj => {
      if (obj.properties.abbr.toLowerCase() === input.toLowerCase()) {
        return obj.properties
      }
    })
    break
  case 3:
    console.log('handle planning area lookup...')
    break
  case 5:
    selectedObj = mapJson.objects.counties.geometries.filter(obj => {
      if (obj.properties.FIPS.toLowerCase() === input.toLowerCase()) {
        return obj.properties
      }
    })
    break
  default:
    console.warn('Unable to find state, county or planning area')
    break
  }

  // if (input.length > 2) {
  //   selectedObj = mapJson.objects.counties.geometries.filter(obj => {
  //     if (obj.properties.FIPS.toLowerCase() === input.toLowerCase()) {
  //       return obj.properties
  //     }
  //   })
  // }
  // else {
  //   selectedObj = mapJson.objects.states.geometries.filter(obj => {
  //     if (obj.properties.abbr.toLowerCase() === input.toLowerCase()) {
  //       return obj.properties
  //     }
  //   })
  // }

  return selectedObj
}

const RenderRow = props => {
  const { data, index, style } = props
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + GUTTER_SIZE,
      height: style.height + GUTTER_SIZE,
      // border: '1px solid deeppink',
    }
  })
}

const ListboxComponent = React.forwardRef((props, ref) => {
  const { children, role, ...other } = props

  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'))
  const itemData = React.Children.toArray(children)
  const itemCount = itemData.length
  const itemSize = smUp ? 50 : 45

  // console.log('ListboxComponent itemCount: ', itemData, itemCount)
  const getChildSize = child => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 45
    }

    return itemSize
  }

  return (
    <div ref={ref}>
      <div {...other}>
        <VariableSizeList
          height={150}
          width={275}
          itemCount={itemCount}
          itemData={itemData}
          itemSize={index => getChildSize(itemData[index])}
          innerElementType="ul"
          role="listbox"
          overscanCount={5}
          debug={true}
        >
          {RenderRow}
        </VariableSizeList>
      </div>
    </div>
  )
})

const AddLocationCard = props => {
  const data = useStaticQuery(graphql`
    query LocationQuery {
      onrr {
        distinct_locations(where: {location: {_neq: ""}}) {
          location
          location_id
          sort_order
        }
      }
    }
  `)

  const classes = useStyles()
  const [input, setInput] = useState('')
  const [keyCount, setKeyCount] = useState(0)

  const {
    cardMenuItems,
    onLink
  } = props

  const handleSearch = event => {
    setInput(event.target.value)
  }

  const handleChange = val => {
    // console.log('val: ', val)
    try {
      const item = getRegionProperties(val.location_id)[0]
      // console.log('item back: ', item)
      props.onLink(item)
      setInput('')
      setKeyCount(keyCount + 1)
    }
    catch (err) {
      console.error('Oh no, seems there was an error trying to grab that location', err)
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

  // console.log('addlocationcard data: ', data)
  const OPTIONS = data.onrr.distinct_locations

  return (
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
          disableListWrap
          inputValue={input}
          options={OPTIONS}
          ListboxComponent={ListboxComponent}
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
          <>
            <Box ml={1} mb={1} display="flex" flexDirection="column" align="left">
              <AddCardButton onLink={onLink} cardMenuItems={cardMenuItems} />
              <Box mt={2} fontSize="16px" display="block" lineHeight="16px" color="#1478a6">Add Nationwide Federal and Native American cards</Box>
            </Box>
          </>
        }
      </CardActions>
    </Card>
  )
}

export default AddLocationCard

AddLocationCard.propTypes = {
  // Title of location card
  title: PropTypes.string
}
