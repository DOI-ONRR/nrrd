import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'

import {
  InputBase,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemIcon,
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

import { DataFilterContext } from '../../../stores/data-filter-store'
import { AppStatusContext } from '../../../stores/app-status-store'
import { formatToSlug } from '../../../js/utils'
import { ZERO_OPTIONS } from '../../../constants'
import DFQM from '../../../js/data-filter-query-manager/index'

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

const BaseSelectInput = ({ dataFilterKey, data, selectType, defaultOption, helperText, label, variant, clearSelected, theme, ...props }) => {
  console.log('BaseSelectInput', data)
  if (data && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }
  else if (!data) {
    data = []
  }

  return (
    <>
      {selectType === 'Single' &&
        <BaseSingleSelectInput
          dataFilterKey={dataFilterKey}
          data={data}
          label={label}
          defaultOption={defaultOption}
          helperText={helperText}
          variant={variant || 'outlined'}
          theme={theme || <BaseInput />}
          clearSelected={clearSelected} />
      }
      {selectType === 'Multi' &&
        <BaseMultiSelectInput
          dataFilterKey={dataFilterKey}
          data={data}
          label={label}
          defaultOption={defaultOption}
          helperText={helperText}
          variant={variant || 'outlined'}
          theme={theme || <BaseInput />} />
      }
    </>
  )
}

BaseSelectInput.propTypes = {
  /**
   * The data filter key used for data filter context
   */
  dataFilterKey: PropTypes.string.isRequired,
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
  clearSelected: PropTypes.bool
}

BaseSelectInput.defaultProps = {
  selectType: 'Single',
  clearSelected: true
}

export default BaseSelectInput

// Single Select Input
const BaseSingleSelectInput = ({ dataFilterKey, data, defaultOption, label, helperText, variant, clearSelected, theme }) => {
  const classes = useStyles()
  const labelSlug = formatToSlug('Commodity')

  const { state, updateDataFilter } = useContext(DataFilterContext)

  const getDefaultOption = () => {
    const defaultItem = (data && data.find(item => item.default))
    return (defaultItem) ? defaultItem.option : ''
  }
  const [selectedOption, setSelectedOption] = useState(getDefaultOption())

  const handleChange = event => {
    console.log('handleChange state: ', event.target.value)
    if (event.target.value.includes('Clear')) {
      handleClearAll()
    }
    else {
      updateDataFilter({ ...state, [dataFilterKey]: event.target.value.toString() })
      setSelectedOption(event.target.value.toString())
    }
  }

  useEffect(() => {
    if (data && data.length === 0) {
      updateDataFilter({ [dataFilterKey]: ZERO_OPTIONS })
    }
    else if (state[dataFilterKey] === ZERO_OPTIONS) {
      handleClearAll()
    }
  }, [data])

  const handleClearAll = () => updateDataFilter({ [dataFilterKey]: ZERO_OPTIONS })

  return (
    <FormControl variant={variant} className={classes.formControl} disabled={(data && (data.length === 0 || data.length === 1))}>
      <InputLabel id={`${ labelSlug }-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${ labelSlug }-select-label`}
        id={`${ labelSlug }-select`}
        IconComponent={() => <KeyboardArrowDown className="MuiSvgIcon-root MuiSelect-icon" />}
        value={(state[dataFilterKey] === ZERO_OPTIONS || !selectedOption) ? '' : selectedOption}
        onChange={handleChange}
        displayEmpty
        label={label}
        input={theme}
        classes={{ root: classes.selectInput }}
      >
        {clearSelected &&
          <MenuItem value={'Clear'}>
            <em>Clear selected</em>
          </MenuItem>
        }
        {data &&
           data.map((item, i) =>
             <MenuItem
               key={`${ item.option }_${ i }`}
               value={item.option}>
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
const BaseMultiSelectInput = ({ dataFilterKey, data, defaultOption, label, helperText, variant, theme }) => {
  const classes = useStyles()
  const labelSlug = formatToSlug(label)

  const { state, updateDataFilter } = useContext(DataFilterContext)
  // const [selectedOptions, setSelectedOptions] = useState((state[dataFilterKey] === ZERO_OPTIONS || !state[dataFilterKey]) ? '' : state[dataFilterKey])
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectAllOptions, setSelectAllOptions] = useState(true)

  const handleChange = event => {
    if (event.target.value.includes('Clear')) {
      handleClearAll()
    }
    else {
      setSelectedOptions(event.target.value)
    }
  }

  const handleClose = event => {
    if (!(selectedOptions.length === 0 && !state[dataFilterKey]) && (selectedOptions !== state[dataFilterKey])) {
      updateDataFilter({ [dataFilterKey]: selectedOptions })
    }
  }

  useEffect(() => {
    if (data && data.length === 0) {
      updateDataFilter({ [dataFilterKey]: ZERO_OPTIONS })
    }
    else if (state[dataFilterKey] === ZERO_OPTIONS) {
      handleClearAll()
    }
  }, [data])

  useEffect(() => {
    if (!selectAllOptions) {
      handleClearAll()
    }
    else {
      setSelectedOptions(data.map(item => item.option).join(','))
    }
  }, [selectAllOptions])

  const handleClearAll = () => {
    setSelectedOptions('')
    if (state[dataFilterKey]) {
      updateDataFilter({ [dataFilterKey]: undefined })
    }
  }

  const toggleSelectAllOptions = () => {
    setSelectAllOptions(!selectAllOptions)
  }

  return (
    <FormControl className={classes.formControl} variant={variant} disabled={(data && data.length === 0)}>
      <InputLabel id={`${ labelSlug }-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${ labelSlug }-select-label`}
        id={`${ labelSlug }-select`}
        multiple
        value={selectedOptions.length > 0 ? selectedOptions.split(',') : []}
        renderValue={selected => selected && selected.join(', ')}
        input={theme}
        onChange={handleChange}
        onClose={handleClose}
        classes={{ root: classes.selectInput }}
      >
        <MenuItem key={0} role="select-menu" onClick={toggleSelectAllOptions} value="null">
          <Checkbox
            checked={selectAllOptions}
            tabIndex={0}
            inputProps={{ 'aria-labelledby': 'selectAll' }}
          />
          <ListItemText primary={selectAllOptions ? 'Select none' : 'Select all'} />
        </MenuItem>
        {data &&
          data.map(
            (item, i) => <MenuItem key={`${ item.option }_${ i }`} value={item.option}>
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
