import React, { useState, useContext, useEffect } from 'react'

import { formatToSlug } from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import Grid from '@material-ui/core/Grid'

import {
  REVENUE_TYPE,
  COMMODITY,
  LAND_CLASS,
  LAND_CATEGORY,
  US_STATE,
  REVENUE,
  PRODUCTION,
  DISBURSEMENTS,
  DATA_TYPE,
  GROUP_BY,
  BREAKOUT_BY,
  NO_BREAKOUT_BY,
  OFFSHORE_REGION
} from '../../../../constants'

const GROUP_BY_OPTIONS = {
  [REVENUE]: [
    { value: REVENUE_TYPE, option: 'Revenue type' },
    { value: COMMODITY, option: 'Commodity' },
    { value: LAND_CATEGORY, option: 'Land category' },
    { value: LAND_CLASS, option: 'Land class' },
    { value: US_STATE, option: 'State' },
    { value: OFFSHORE_REGION, option: 'Offshore Region' },
  ],
  [PRODUCTION]: [
    { value: COMMODITY, option: 'Commodity' },
    { value: LAND_CATEGORY, option: 'Land category' },
    { value: LAND_CLASS, option: 'Land class' },
    { value: US_STATE, option: 'State' },
    { value: OFFSHORE_REGION, option: 'Offshore Region' },
  ],
  [DISBURSEMENTS]: [],
}

const DataTableGroupingToolbar = () => {
  const { state, updateDataFilter } = useContext(DataFilterContext)

  // This is where all business logic will applied for the grouping options
  const setGroupByOptions = state => {
    let optionList = GROUP_BY_OPTIONS[state[DATA_TYPE]]
    if (!optionList || optionList.length === 0) {
      return
    }

    // Remove any option that only has 1 value selected
    optionList = optionList.filter(item => !(state[item.value] && state[item.value].split(',').length === 1))

    const groupByValue = (optionList.findIndex(item => item.value === state[GROUP_BY]) === -1) ? optionList[0].value : state[GROUP_BY]
    let breakoutByValue = state[BREAKOUT_BY]

    if (breakoutByValue === groupByValue || (breakoutByValue !== NO_BREAKOUT_BY && optionList.findIndex(item => item.value === breakoutByValue) === -1)) {
      const result = optionList.find(item => item.value !== groupByValue)
      breakoutByValue = result && result.value
    }

    setOptions(optionList)
    setGroupBy(groupByValue)
    setBreakoutBy(breakoutByValue)
  }

  const [options, setOptions] = useState()

  const [groupBy, setGroupBy] = useState()
  const handleGroupByChange = event => setGroupBy(event.target.value.toString())

  const [breakoutBy, setBreakoutBy] = useState()
  const handleBreakoutByChange = event => {
    if (event.target.value.includes('Clear')) {
      setBreakoutBy(NO_BREAKOUT_BY)
    }
    else {
      setBreakoutBy(event.target.value.toString())
    }
  }

  useEffect(() => {
    if (groupBy !== state[GROUP_BY] || breakoutBy !== state[BREAKOUT_BY]) {
      updateDataFilter({ [GROUP_BY]: groupBy, [BREAKOUT_BY]: breakoutBy })
    }
  }, [groupBy, breakoutBy])

  useEffect(() => {
    setGroupByOptions(state)
  }, [state])

  return (
    <Grid container spacing={2} alignItems='flex-end'>
      <Grid item xs={12} sm={3}>
        {options &&
          <BaseSingleSelect
            includeClearAll={false}
            handleChange={handleGroupByChange}
            label={'Group by'}
            currentValue={groupBy}
            options={options.filter(item => item.value !== breakoutBy)} />
        }
      </Grid>
      {(options && options.length > 1) &&
        <Grid item xs={12} sm={3}>
          <BaseSingleSelect
            handleChange={handleBreakoutByChange}
            label={'Breakout by'}
            currentValue={(breakoutBy === NO_BREAKOUT_BY) ? undefined : breakoutBy}
            options={options.filter(item => item.value !== groupBy)} />
        </Grid>
      }
    </Grid>
  )
}

export default DataTableGroupingToolbar

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: '-webkit-fill-available'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))
const BaseSingleSelect = ({ handleChange, label, options, currentValue, helperText, infoText, includeClearAll, ...props }) => {
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
