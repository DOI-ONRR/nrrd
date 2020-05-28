import React from 'react'
import PropTypes from 'prop-types'

import {
  InputBase
} from '@material-ui/core'

import {
  withStyles,
  createStyles
} from '@material-ui/core/styles'

import BaseSelectInput from '../BaseSelectInput'

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
      backgroundColor: theme.palette.background.paper,
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

const MapToolbarSelect = ({ dataFilterKey, data, defaultOption, helperText, label, selectType }) => {
  // try useTheme for overriding styles
  return (
    <BaseSelectInput
      dataFilterKey={dataFilterKey}
      dataOptions={data}
      defaultOption={defaultOption}
      helperText={helperText}
      label={label}
      selectType={selectType}
      variant='outlined'
      theme={<BaseInput />}
    />
  )
}

export default MapToolbarSelect

MapToolbarSelect.propTypes = {
  /**
   * The data filter key used for data filter context
   */
  dataFilterKey: PropTypes.string.isRequired,
  /**
   * The data option, an array of options for input
   */
  data: PropTypes.array.isRequired,
  /**
   * Text that display as the default option of input
   */
  defaultOption: PropTypes.string,
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,
  /**
   * Text that displays on the component
   */
  label: PropTypes.string.isRequired,
}
