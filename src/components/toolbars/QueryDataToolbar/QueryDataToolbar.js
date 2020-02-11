import React, { useContext, useState, useEffect } from 'react'
import { DataFilterContext } from '../../../stores/data-filter-store'
import { fetchDataFilterFromUrl } from '../../../js/utils'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import DataTypeToggle from '../data-filters/DataTypeToggle'

import {
  makeStyles,
  Container,
  Grid,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
  test1: {
    backgroundColor: 'lightblue',
  },
  test2: {
    backgroundColor: 'lightgreen',
  },
  test3: {
    backgroundColor: 'lightred',
  },
}))

const QueryDataToolbar = props => {
  const classes = useStyles()
  const [urlParams] = useState(fetchDataFilterFromUrl())
  const { state, updateDataFilter } = useContext(DataFilterContext)

  useEffect(() => {
    if (Object.keys(urlParams).length > 0) {
      updateDataFilter(urlParams)
    }
  }, [urlParams])

  const handleChange = (type, value) => {
    updateDataFilter({ ...state, [type]: value })
  }

  return (
    <React.Fragment>
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataTypeToggle helperText={'Select a report type!'} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={2}>
            <InputLabel id='land-category-label' aria-label='Land category'>Land category:</InputLabel>
          </Grid>
          <Grid item xs={12} sm={10}>
            <FormControl fullWidth={false} >
              <Select
                labelId='land-category-label'
                id='land-category'
                onChange={e => handleChange(DFC.LAND_CATEGORY, e.target.value)}
                value={state[DFC.LAND_CATEGORY] || ''}
                displayEmpty>
                <MenuItem value={''} disabled><em>-Select-</em></MenuItem>
                <MenuItem value={'Menu Item 4'}>Menu Item 1</MenuItem>
                <MenuItem value={'Menu Item 5'}>Menu Item 2</MenuItem>
                <MenuItem value={'Menu Item 6'}>Menu Item 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default QueryDataToolbar
