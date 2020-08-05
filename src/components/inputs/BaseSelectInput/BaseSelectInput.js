import React, { useEffect, useState } from 'react'
import PropTypes, { object } from 'prop-types'
import { isEqual, isEqualWith } from 'lodash'

import {
  Box,
  InputBase,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Checkbox,
  Tooltip
} from '@material-ui/core'

import {
  makeStyles,
  withStyles,
  createStyles
} from '@material-ui/core/styles'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

import { formatToSlug } from '../../../js/utils'
import { ZERO_OPTIONS } from '../../../constants'

const useStyles = makeStyles(theme => ({
  root: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 275,
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, -6px) scale(0.75)'
    },
  },
  formHelperTextRoot: {
    fontSize: '.75rem',
    '& $disabled': {
      fontSize: '.75rem',
    },
  },
  selectInput: {
    minHeight: 'inherit',
    padding: '8.5px 14px',
    marginBottom: theme.spacing(0.5),
  },
  iconRoot: {
    fill: theme.palette.common.black,
    position: 'absolute',
    top: -10,
    right: 0,
    cursor: 'pointer',
  },
  iconFontSizeSmall: {
    fontSize: 20,
  },
  tooltipRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
      minWidth: 130,
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  })
)(InputBase)

const BaseSelectInput = ({
  data, onChange, selectType, defaultSelected, selected, defaultSelectAll, helperText, label, variant, showClearSelected, theme, disabled, ...props
}) => {
  if (data && data.length > 0 && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }
  else if (!data) {
    return (<></>)
  }

  const noop = () => {}

  return (
    <>
      {(selectType === 'Single') &&
        <BaseSingleSelectInput
          data={data}
          label={label}
          selected={selected}
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
          selected={selected}
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

export default React.memo(BaseSelectInput, areEqual)

// Single Select Input
const BaseSingleSelectInput = ({ data, defaultSelected, selected, label, helperText, variant, showClearSelected, theme, onChange, disabled }) => {
  const classes = useStyles()
  const labelSlug = formatToSlug(label)

  /**
   * We have multiple ways to specify a default value. It will check to see if a defaultSelected has been specified.
   * If not it will check to see if an option has been set as default = true
   */
  const getDefaultSelected = () => {
    let defaultItem
    if (data) {
      if (selected) {
        defaultItem = { option: selected }
      }
      else if (defaultSelected) {
        defaultItem = data.find(item => (item.option === defaultSelected || item.value === defaultSelected))
      }
      else {
        defaultItem = data.find(item => item.default)
      }
    }
    return (defaultItem && !disabled) ? (defaultItem.value || defaultItem.option) : ''
  }
  const [selectedOption, setSelectedOption] = useState(getDefaultSelected())

  const handleChange = value => {
    if (value.includes('Clear')) {
      setSelectedOption()
      onChange()
    }
    else {
      setSelectedOption(value.toString())
      onChange(value.toString())
    }
  }

  useEffect(() => {
    if (selected && !isEqual(selected, selectedOption)) {
      handleChange(selected)
    }
  }, [selected])

  return (
    <FormControl variant={variant} className={classes.formControl} disabled={((disabled) || (data && data.length === 0))}>
      <InputLabel htmlFor={`${ labelSlug }-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${ labelSlug }-select-label`}
        id={`${ labelSlug }-select`}
        IconComponent={() => <KeyboardArrowDown className="MuiSvgIcon-root MuiSelect-icon" />}
        value={(selectedOption === ZERO_OPTIONS || !selectedOption) ? '' : selectedOption}
        onChange={e => handleChange(e.target.value)}
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
const BaseMultiSelectInput = ({ data, defaultSelected, selected, defaultSelectAll, label, helperText, variant, showClearSelected, theme, onChange, disabled }) => {
  const classes = useStyles()
  const labelSlug = formatToSlug(label)
  const defaultSelectedOptions = defaultSelected && defaultSelected.split(',')

  /**
   * We have multiple ways to specify a default value. It will check to see if a defaultSelected has been specified.
   * If not it will check to see if an option has been set as default = true
   */
  const getDefaultSelected = () => {
    let defaultItems
    if (data) {
      if (selected) {
        if (typeof selected === 'string') {
          defaultItems = selected.split(',')
        }
        else {
          defaultItems = selected
        }
      }
      else if (defaultSelectedOptions) {
        defaultItems = defaultSelectedOptions
      }
      else {
        defaultItems = []
      }
    }
    return (defaultItems && !disabled) ? defaultItems : []
  }
  const [selectedOptions, setSelectedOptions] = useState(getDefaultSelected())
  const [selectAllOptions, setSelectAllOptions] = useState(defaultSelectAll)
  const [selectedOptionsChanged, setSelectedOptionsChanged] = useState(false)

  const handleChange = value => {
    if (value.includes('selectAll')) {
      setSelectedOptions(data.map(item => item.option))
      setSelectAllOptions(true)
    }
    else if (value.includes('selectNone')) {
      setSelectedOptions([])
      setSelectAllOptions(false)
    }
    else {
      setSelectedOptions(value)
      setSelectAllOptions(false)
    }
    setSelectedOptionsChanged(true)
  }

  const handleClose = event => {
    if (selectedOptionsChanged) {
      onChange(selectedOptions.toString())
    }

    if (selectAllOptions) {
      onChange(undefined)
    }
  }

  const handleRenderValue = renderValues => {
    let selectedVal
    if (label === 'Recipient') {
      // console.log(selected, renderValues, selectedOptions)
    }

    if (renderValues && renderValues.length !== data.length) {
      selectedVal = renderValues.join(', ')
    }

    if (renderValues && renderValues.length === data.length) {
      selectedVal = 'All'
    }

    if (renderValues && renderValues.length === 0) {
      selectedVal = 'None selected'
    }

    return selectedVal
  }

  const helperContent = () => {
    return (
      <>
        {helperText &&
          <Box component="span" className={classes.formHelperTextRoot}>
            {helperText}
          </Box>
        }
        {(data && data.length === 0) &&
          <Box component="span" className={classes.formHelperTextRoot}>
            No {label} match the current filter options.
          </Box>
        }
      </>
    )
  }

  useEffect(() => {
    console.log('BaseSelectInput selectedOptions', selectedOptions)
    if (!disabled) {
      if (selectAllOptions) {
        setSelectedOptions(data.map(item => item.option))
      }
      else {
        setSelectedOptions(data.filter(item => (selectedOptions.includes(item.option))).map(item => item.option))
      }
    }
  }, [data])

  useEffect(() => {
    if (selected && !isEqual(selected, selectedOptions)) {
      if (typeof selected === 'string') {
        handleChange(selected.split(','))
      }
      else {
        handleChange(selected)
      }
    }
  }, [selected])

  return (
    <FormControl
      className={classes.formControl}
      variant={variant}
      disabled={((disabled) || (data && data.length === 0))}>
      <InputLabel id={`${ labelSlug }-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${ labelSlug }-select-label`}
        id={`${ labelSlug }-select`}
        IconComponent={() => <KeyboardArrowDown className="MuiSvgIcon-root MuiSelect-icon" />}
        multiple
        value={selectedOptions}
        renderValue={renderValues => handleRenderValue(renderValues)}
        input={theme}
        onChange={e => handleChange(e.target.value)}
        onClose={handleClose}
        classes={{
          root: classes.selectInput,
          disabled: classes.selectDisabled
        }}
        displayEmpty
      >
        <MenuItem key={0} role="select-menu" value={selectAllOptions ? 'selectNone' : 'selectAll'}>
          <Checkbox checked={selectAllOptions} />
          <ListItemText primary='All' />
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

      {(helperText || (data && data.length === 0)) &&
        <Tooltip
          title={helperContent()}
          classes={{
            tooltip: classes.tooltipRoot,
            arrow: classes.tooltipArrow,
          }}>
          <HelpOutlineIcon
            fontSize="small"
            classes={{
              root: classes.iconRoot,
              fontSizeSmall: classes.iconFontSizeSmall
            }} />
        </Tooltip>
      }
    </FormControl>
  )
}
