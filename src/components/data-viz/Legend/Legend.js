import React from 'react'
import * as d3 from 'd3'

import PropTypes from 'prop-types'

import { withStyles, createStyles, useTheme } from '@material-ui/core/styles'

import GlossaryTerm from '../../GlossaryTerm/GlossaryTerm'
import { formatToDollarInt } from '../../../js/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'

const StyledTableHeadCell = withStyles(theme =>
  createStyles({
    root: {
      fontSize: '1rem',
      fontWeight: 'bold',
      padding: theme.spacing(0.5),
      borderBottom: `1px solid ${ theme.palette.grey[300] }`
    }
  })
)(TableCell)

const StyledTableBodyCell = withStyles(theme =>
  createStyles({
    root: {
      fontSize: '1rem',
      padding: theme.spacing(0.5)
    }
  })
)(TableCell)

const StyledTableRow = withStyles(theme =>
  createStyles({
    root: {
      backgroundColor: 'inherit',
      '&:last-child > td': {
        borderBottom: 'none'
      }
    },
  })
)(TableRow)

const Legend = ({ data, legendLabels, activeNode, ...rest }) => {
  console.log('Legend props: ', data, activeNode, rest)
  const theme = useTheme()

  const formatLabels = d => {
    if (d.match('Native')) {
      d = 'Native American'
    }
    else if (d.match('governments')) {
      d = 'State and local'
    }
    else if (d.match('Land')) {
      d = 'LWCF'
    }
    else if (d.match('Historic')) {
      d = 'HPF'
    }
    return d
  }

  const label = legendLabels[0].toLowerCase()
  // TODO: make this labels or properties dynamic or more generalized
  const activeLabel = activeNode && (activeNode.data[label])

  return (
    <TableContainer>
      <Table aria-label="Chart legend">
        <TableHead>
          <TableRow>
            <StyledTableHeadCell>{legendLabels[0]}</StyledTableHeadCell>
            <StyledTableHeadCell align="right">{legendLabels[1]}</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <StyledTableRow
              key={row[label]}
              style={{ backgroundColor: (activeLabel === row[label]) ? theme.palette.grey[200] : '' }}>
              <StyledTableBodyCell>
                <GlossaryTerm
                  termKey={formatLabels(row[label])}
                  isInTable={true}
                  style={{ whiteSpace: 'inherit' }}>
                  { formatLabels(row[label]) }
                </GlossaryTerm>
              </StyledTableBodyCell>
              <StyledTableBodyCell align="right">
                {formatToDollarInt(row.total)}
              </StyledTableBodyCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Legend

// propTypes
Legend.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired
}
