import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'

import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Checkbox
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

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
    // background: theme.palette.background.paper,
    // padding: '8.5px 14px',
  },
}))

const BaseSelectInput = ({ dataFilterKey, dataOptions, selectType, defaultOption, helperText, label, variant, ...props }) => {

  // need to figure out a way to conditionally run queries, looks like skip method should work 
  // https://www.apollographql.com/docs/react/api/react-hooks/

  // const { loading, error, data } = useQuery(SOME_FANCY_QUERY, {
  //   variables: { specialVarKey: specialVarValue },
  //   skip: false
  // })

  // const { state } = useContext(DataFilterContext)

  // console.log('state: ', state)

  // const { loading, error, data } = useQuery(DFQM.getQuery(dataFilterKey, state), { variables: DFQM.getVariables(state), skip: true })
  // console.log('data: ', data)

  // const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  // useEffect(() => {
  //   if (error) {
  //     showErrorMessage(`Error!: ${ error.message }`)
  //   }
  // }, [error])

  // useEffect(() => {
  //   updateLoadingStatus({ status: loading, message: 'Loading...' })
  // }, [loading])

  return (
    <>
      {selectType === 'Single' &&
        <BaseSingleSelectInput
          dataFilterKey={dataFilterKey}
          data={dataOptions}
          label={label}
          defaultOption={defaultOption}
          helperText={helperText}
          variant={variant}
          theme={props.theme}
          clearSelected={props.clearSelected} />
      }
      {selectType === 'Multi' &&
        <BaseMultiSelectInput
          dataFilterKey={dataFilterKey}
          data={dataOptions}
          label={label}
          defaultOption={defaultOption}
          helperText={helperText}
          variant={variant}
          theme={props.theme} />
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
   * The loading indicator
   */
  loading: PropTypes.boolean,
  /**
   * Option to show/hide the clear selection option
   */
  clearSelected: PropTypes.boolean
}

BaseSelectInput.defaultProps = {
  loading: false,
  selectType: 'Single'
}

export default BaseSelectInput

// Single Select Input
const BaseSingleSelectInput = ({ dataFilterKey, data, defaultOption, label, helperText, variant, clearSelected, theme }) => {
  const classes = useStyles()
  const labelSlug = formatToSlug(label)

  const { state, updateDataFilter } = useContext(DataFilterContext)

  const findSelectedOption = data && data.find(item => item === defaultOption)

  const [selectedOption, setSelectedOption] = useState(findSelectedOption)

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
      updateDataFilter({ ...state, [dataFilterKey]: ZERO_OPTIONS })
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
        // IconComponent={() => <KeyboardArrowDownIcon className="MuiSvgIcon-root MuiSelect-icon" />}
        // value={selectedIndex}
        value={(state[dataFilterKey] === ZERO_OPTIONS) ? '' : selectedOption}
        onChange={handleChange}
        displayEmpty
        label={label}
        input={theme || ''} // first attempt at overloading functions by passing a theme component it completely overrides all mui styles
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
               key={`${ item }_${ i }`}
               value={item}>
               {item}
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
      setSelectedOptions(data)
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
        value={selectedOptions.length > 0 ? selectedOptions : []}
        renderValue={selected => selected && selected.join(', ')}
        input={theme || ''}
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
            (item, i) => <MenuItem key={`${ item }_${ i }`} value={item}>
              <Checkbox
                checked={selectedOptions.includes(item)} />
              <ListItemText primary={item} />
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
