import React, { useContext } from 'react'
import clsx from 'clsx'

import { DataFilterContext } from '../../../stores/data-filter-store'

import {
  DATA_TYPES,
  DATA_TYPE,
  COMMODITY
} from '../../../constants'
import BaseSelectInput from '../../inputs/BaseSelectInput'
import WithDataFilterQuery from '../../inputs/withDataFilterQuery'
import BaseToolbar from '../BaseToolbar'
import DataTableGroupingToolbar from '../../data-viz/DataTable/DataTableGroupingToolbar'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@material-ui/core/Button'
import FilterList from '@material-ui/icons/FilterList'

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    [theme.breakpoints.up('sm')]: {
      width: 350,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    backgroundColor: theme.palette.primary.main,
  },
}))

const QueryTableToolbar = () => {
  const { state } = useContext(DataFilterContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }
  const classes = useStyles()

  const [dataFilterToolbarOpen, setDataFilterToolbarOpen] = React.useState(false)

  const toggleDataFilterToolbar = open => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setDataFilterToolbarOpen(open)
  }

  const [dataGroupingToolbarOpen, setDataGroupingToolbarOpen] = React.useState(false)

  const toggleDataGroupingToolbar = open => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setDataGroupingToolbarOpen(open)
  }
  return (
    <>
      <BaseToolbar>
        <BaseSelectInput label='Data type' data={DATA_TYPES.map((item, index) => ({ option: item, default: (index === 0) }))} dataFilterKey={DATA_TYPE} />
        <Button
          variant="contained"
          color="primary"
          aria-label="open data filters"
          onClick={toggleDataFilterToolbar(!dataFilterToolbarOpen)}
          onKeyDown={toggleDataFilterToolbar(!dataFilterToolbarOpen)}
          startIcon={<FilterList />}
          className={clsx(classes.menuButton)}
          disabled={!state.dataType}
        >
          Filter Data
        </Button>
        <Button
          variant="contained"
          color="primary"
          aria-label="open grouping"
          onClick={toggleDataGroupingToolbar(!dataGroupingToolbarOpen)}
          onKeyDown={toggleDataGroupingToolbar(!dataGroupingToolbarOpen)}
          startIcon={<FilterList />}
          className={clsx(classes.menuButton)}
          disabled={!state.dataType}
        >
          Group Data
        </Button>
      </BaseToolbar>
      { dataFilterToolbarOpen &&
        <RevenueMainToolbar />
      }
      { dataGroupingToolbarOpen &&
        <RevenueGroupingToolbar />
      }
    </>
  )
}

export default QueryTableToolbar

const RevenueMainToolbar = () => {
  return (
    <BaseToolbar>RevenueMainToolbar</BaseToolbar>
  )
}


const RevenueGroupingToolbar = () => {
  return (
    <BaseToolbar><DataTableGroupingToolbar /></BaseToolbar>
  )
}

/* {WithDataFilterQuery(BaseSelectInput, COMMODITY, { selectType: 'Single', label: 'Commodity' })} */
