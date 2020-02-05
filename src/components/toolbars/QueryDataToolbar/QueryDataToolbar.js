import React, { useContext, useState, useEffect } from 'react'
import { DataFilterContext } from '../../../stores/data-filter-store'
import { fetchDataFilterFromUrl } from '../../../js/utils'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import {
  makeStyles,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
  test: {
    backgroundColor: 'lightblue',
  },
}))

const QueryDataToolbar = props => {
  const classes = useStyles()
  const [filter, setFilter] = useState(fetchDataFilterFromUrl())
  const { state, updateDataFilter } = useContext(DataFilterContext)

  useEffect(() => {
    updateDataFilter(filter)
  }, [filter])

  const handleChange = (type, value) => {
    console.log(type, value)
    setFilter({ ...filter, [type]: value })
  }
  console.log('state', state)
  return (
    <React.Fragment>
      <Container maxWidth={true} className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={2}>
            <InputLabel id='data-type-label' aria-label='Data type'>Data type:</InputLabel>
          </Grid>
          <Grid item xs={12} sm={10}>
            <FormControl fullWidth={false} >
              <Select
                labelId='data-type-label'
                id='data-type'
                onChange={e => handleChange(DFC.DATA_TYPE, e.target.value)}
                value={filter[DFC.DATA_TYPE]}
                displayEmpty>
                <MenuItem disabled><em>-Select-</em></MenuItem>
                <MenuItem value={1}>Menu Item 1</MenuItem>
                <MenuItem value={2}>Menu Item 2</MenuItem>
                <MenuItem value={3}>Menu Item 3</MenuItem>
              </Select>
            </FormControl>
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
                value={filter[DFC.LAND_CATEGORY]}
                displayEmpty>
                <MenuItem disabled><em>-Select-</em></MenuItem>
                <MenuItem value={4}>Menu Item 1</MenuItem>
                <MenuItem value={5}>Menu Item 2</MenuItem>
                <MenuItem value={6}>Menu Item 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default QueryDataToolbar
