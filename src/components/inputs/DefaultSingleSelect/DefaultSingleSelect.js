import React from 'react'
import PropTypes from 'prop-types'

import { formatToSlug } from '../../../js/utils'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Clear from '@material-ui/icons/Clear'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: '-webkit-fill-available'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const DefaultSingleSelect = ({ handleChange, label, options, currentValue, helperText, infoText, includeClearAll, ...props }) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const labelSlug = formatToSlug(label)

  return (
    <FormControl className={classes.formControl} disabled={(options.length === 0)}>
      <InputLabel id={`${ labelSlug }-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${ labelSlug }-select-label`}
        id={`${ labelSlug }-select`}
        value={currentValue || ''}
        onChange={handleChange}
        displayEmpty
      >
        {includeClearAll &&
          <MenuItem value={'Clear'} disabled={(!currentValue)}>
            <Clear /><ListItemText primary={'Clear selected'} />
          </MenuItem>
        }
        { options.map((item, i) =>
          <MenuItem key={`${ formatToSlug(item.option) }_${ i }`} value={item.value || item.option}><ListItemText primary={item.option} /></MenuItem>)
        }
      </Select>
      {helperText &&
      <FormHelperText>{helperText}</FormHelperText>
      }
      {(options.length === 0 && infoText) &&
        <FormHelperText>{infoText}</FormHelperText>
      }
    </FormControl>
  )
}

export default DefaultSingleSelect

DefaultSingleSelect.propTypes = {
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,
  /**
   * Text that displays below the select box that displays when there are no options available
   */
  infoText: PropTypes.string,
  /**
   * Text that displays on the component
   */
  label: PropTypes.string.isRequired,
  /**
   * Display a clear all option to clear the selected option
   */
  includeClearAll: PropTypes.bool
}
DefaultSingleSelect.defaultProps = {
  includeClearAll: true
}
