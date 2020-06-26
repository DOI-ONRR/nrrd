import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {
  InputBase,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Checkbox
} from '@material-ui/core'

import {
  makeStyles,
  withStyles,
  createStyles
} from '@material-ui/core/styles'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'

import { formatToSlug } from '../../../js/utils'
import { ZERO_OPTIONS } from '../../../constants'

const useStyles = makeStyles(theme => ({
  root: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 275,
  },
  selectInput: {
    minHeight: 'inherit',
    padding: '8.5px 14px',
  },
}))

const BaseInput = withStyles(theme =>
  createStyles({
    root: {
      marginTop: theme.spacing(0.5),
      'label + &': {
        marginTop: theme.spacing(1.5),
      },
    },
    input: {
      borderRadius: 4,
      border: '1px solid #ced4da',
      padding: '8.5px 14px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  })
)(InputBase)

const BaseSelectInput = ({ data, onChange, selectType, defaultSelected, defaultSelectAll, helperText, label, variant, showClearSelected, theme, disabled, ...props }) => {
  if (data && data.length > 0 && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }
  else if (!data) {
    data = []
  }

  const noop = () => {}

  return (
    <>
      {(selectType === 'Single') &&
        <BaseSingleSelectInput
          data={data}
          label={label}
          defaultSelected={defaultSelected}
          helperText={helperText}
          variant={variant || 'outlined'}
          theme={theme || <BaseInput />}
          showClearSelected={showClearSelected}
          onChange={onChange || noop}
          disabled={disabled} />
      }
      {selectType === 'Multi' &&
        <BaseMultiSelectInput
          data={data}
          label={label}
          defaultSelected={defaultSelected}
          defaultSelectAll={defaultSelectAll}
          helperText={helperText}
          variant={variant || 'outlined'}
          theme={theme || <BaseInput />}
          onChange={onChange || noop}
          disabled={disabled} />
      }
    </>
  )
}

BaseSelectInput.propTypes = {
  /**
   * Specify the selection type
   */
  selectType: PropTypes.oneOf(['Single', 'Multi']).isRequired,
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,
  /**
   * Text that displays on the component
   */
  label: PropTypes.string.isRequired,
  /**
   * Option to show/hide the clear selection option
   */
  showClearSelected: PropTypes.bool,
  /**
   * Select all options in multi-select only by default
   */
  defaultSelectAll: PropTypes.bool,
}

BaseSelectInput.defaultProps = {
  selectType: 'Single',
  showClearSelected: true,
  defaultSelectAll: true
}

export default BaseSelectInput

// Single Select Input
const BaseSingleSelectInput = ({ data, defaultSelected, label, helperText, variant, showClearSelected, theme, onChange, disabled }) => {
  const classes = useStyles()
  const labelSlug = formatToSlug(label)

  /**
   * We have multiple ways to specify a default value. It will check to see if a defaultSelected has been specified.
   * If not it will check to see if an option has been set as default = true
   */
  const getDefaultSelected = () => {
    let defaultItem
    if (data) {
      if (defaultSelected) {
        defaultItem = data.find(item => (item.option === defaultSelected || item.value === defaultSelected))
      }
      else {
        defaultItem = data.find(item => item.default)
      }
    }
    return (defaultItem && !disabled) ? (defaultItem.value || defaultItem.option) : ''
  }
  const [selectedOption, setSelectedOption] = useState(getDefaultSelected())

  const handleChange = event => {
    if (event.target.value.includes('Clear')) {
      setSelectedOption()
      onChange()
    }
    else {
      setSelectedOption(event.target.value.toString())
      onChange(event.target.value.toString())
    }
  }

  return (
    <FormControl variant={variant} className={classes.formControl} disabled={((disabled) || (data && data.length === 0))}>
      <InputLabel htmlFor={`${ labelSlug }-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${ labelSlug }-select-label`}
        id={`${ labelSlug }-select`}
        IconComponent={() => <KeyboardArrowDown className="MuiSvgIcon-root MuiSelect-icon" />}
        value={(selectedOption === ZERO_OPTIONS || !selectedOption) ? '' : selectedOption}
        onChange={handleChange}
        displayEmpty
        label={label}
        input={theme}
        classes={{ root: classes.selectInput }}
      >
        {showClearSelected &&
          <MenuItem value={'Clear'}>
            <em>Clear selected</em>
          </MenuItem>
        }
        {data &&
           data.map((item, i) =>
             <MenuItem
               key={`${ item.option }_${ i }`}
               value={item.value || item.option}>
               {item.option}
             </MenuItem>)
        }
      </Select>
      {helperText &&
        <FormHelperText>{helperText}</FormHelperText>
      }
      {(data && data.length === 0) &&
        <FormHelperText>No '{label}' match the current filter options.</FormHelperText>
      }
    </FormControl>
  )
}

// Multi select input
const BaseMultiSelectInput = ({ data, defaultSelected, defaultSelectAll, label, helperText, variant, showClearSelected, theme, onChange, disabled }) => {
  const classes = useStyles()
  const labelSlug = formatToSlug(label)
  const defaultSelectedOptions = defaultSelected && defaultSelected.split(',')

  const [selectedOptions, setSelectedOptions] = useState(defaultSelectedOptions || [])
  const [selectAllOptions, setSelectAllOptions] = useState(defaultSelectAll)
  const [selectedOptionsChanged, setSelectedOptionsChanged] = useState(false)

  const handleChange = event => {
    if (event.target.value.includes('selectAll')) {
      setSelectedOptions(data.map(item => item.option))
      setSelectAllOptions(true)
    }
    else if (event.target.value.includes('selectNone')) {
      setSelectedOptions([])
      setSelectAllOptions(false)
    }
    else {
      setSelectedOptions(event.target.value)
      setSelectAllOptions(false)
    }
    setSelectedOptionsChanged(true)
  }

  const handleClose = event => {
    if (selectedOptionsChanged) {
      onChange(selectedOptions.toString())
    }
  }

  const handleRenderValue = selected => {
    let selectedVal

    if (selected && selected.length !== data.length) {
      selectedVal = selected.join(', ')
    }

    if (selected && selected.length === data.length) {
      selectedVal = 'All'
    }

    if (selected && selected.length === 0) {
      selectedVal = 'None selected'
    }

    return selectedVal
  }

  useEffect(() => {
    if (!disabled) {
      if (selectAllOptions) {
        setSelectedOptions(data.map(item => item.option))
      }
      else {
        setSelectedOptions(data.filter(item => (selectedOptions.includes(item.option))).map(item => item.option))
      }
    }
  }, [data])

  return (
    <FormControl className={classes.formControl} variant={variant} disabled={((disabled) || (data && data.length === 0))}>
      <InputLabel id={`${ labelSlug }-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${ labelSlug }-select-label`}
        id={`${ labelSlug }-select`}
        IconComponent={() => <KeyboardArrowDown className="MuiSvgIcon-root MuiSelect-icon" />}
        multiple
        value={selectedOptions}
        renderValue={selected => handleRenderValue(selected)}
        input={theme}
        onChange={handleChange}
        onClose={handleClose}
        classes={{ root: classes.selectInput }}
        displayEmpty
      >
        <MenuItem key={0} role="select-menu" value={selectAllOptions ? 'selectNone' : 'selectAll'}>
          <ListItemText primary={selectAllOptions ? 'Select none' : 'Select all'} />
        </MenuItem>
        {data &&
          data.map(
            (item, i) => <MenuItem key={`${ item.option }_${ i }`} value={item.value || item.option}>
              <Checkbox
                checked={selectedOptions.includes(item.option)} />
              <ListItemText primary={item.option} />
            </MenuItem>)
        }
      </Select>
      {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
      }
      {(data && data.length === 0) &&
            <FormHelperText>No '{label}' match the current filter options.</FormHelperText>
      }
    </FormControl>
  )
}
