import React, { useState } from 'react'
import { VariableSizeList } from 'react-window'
import { isEqual, isEqualWith } from 'lodash'

import { formatToSlug } from '../../../js/utils'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'

import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

const GUTTER_SIZE = 15

const useStyles = makeStyles(theme => ({
  autoCompleteRoot: {
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(1),
    borderRadius: 4,
    transition: theme.transitions.create(['border-color', 'box-shadow'])
  },
  autoCompleteFocused: {
    borderRadius: 4,
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
  },
}))

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

const BaseSearchSelect = ({ data, label, onChange, ...props }) => {
  const noop = () => {}
  const classes = useStyles()
  const handleOnChange = onChange || noop

  if (data && data.length > 0 && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }
  else if (!data) {
    return (<></>)
  }
  const labelSlug = formatToSlug(label)

  const handleChange = item => {
    console.log('handleChange', item.option)
    // handleOnChange(item.option)
  }

  return (
    <Autocomplete
      id="combo-box-demo"
      options={data}
      getOptionLabel={option => option.option}
      popupIcon={<KeyboardArrowDown />}
      renderInput={params => (
        <TextField {...params} label={label} variant="outlined" fullWidth />
      )}
      classes={{
        inputRoot: classes.autoCompleteRoot,
        focused: classes.autoCompleteFocused,
      }}
      size="small"
      {...props}
    />
  )
}

const areEqual = (prevProps, nextProps) => {
  const areDataValuesEqual = (item1, item2) => {
    let equal = (!item1 && !item2)
    if (item1 && item2) {
      if (item1.length !== item2.length) {
        equal = false
      }
      else {
        if (typeof item1[0] === 'string' && typeof item2[0] === 'string') {
          equal = isEqual(item1, item2)
        }
        else {
          equal = isEqual(item1.map(item => item.option), item2.map(item => item.option))
        }
      }
    }

    return equal
  }

  return isEqualWith(prevProps.data, nextProps.data, areDataValuesEqual) && isEqual(prevProps.selected, nextProps.selected)
}

export default React.memo(BaseSearchSelect, areEqual)
