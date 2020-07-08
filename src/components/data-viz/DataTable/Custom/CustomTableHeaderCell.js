import React, { useContext } from 'react'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import {
  GroupBySelectInput,
  BreakoutBySelectInput
} from '../../../inputs'
import {
  DATA_TYPE,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  GROUP_BY,
  BREAKOUT_BY
} from '../../../../constants'

import { DataFilterContext } from '../../../../stores/data-filter-store'

const useStyles = makeStyles(theme => ({
  cell: {
    borderRight: `1px solid ${ theme.palette.divider }`,
    backgroundColor: 'white',
    paddingTop: '2px;',
    paddingBottom: '2px;'
  }
}))

const CustomTableHeaderCell = ({ getMessage, ...restProps }) => {
  const theme = useTheme()
  const styles = useStyles(theme)
  const { state } = useContext(DataFilterContext)

  return (
    <Table.StubHeaderCell classes={styles}>
      {state[GROUP_BY] === restProps.column.name
        ? <GroupBySelectInput />
        : <>{state[BREAKOUT_BY] === restProps.column.name
          ? <BreakoutBySelectInput />
          : <>{restProps.children}</>
        }</>
      }
    </Table.StubHeaderCell>
  )
}

export default CustomTableHeaderCell
