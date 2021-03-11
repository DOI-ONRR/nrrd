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

const Legend = ({ data, activeNode, ...rest }) => {
  console.log('Legend props: ', data, activeNode, rest)
  const theme = useTheme()

  const legendLabels = d => {
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

  const label = data[data.length - 1].recipient ? 'Recipient' : 'Source'
  // TODO: make this labels or properties dynamic or more generalized
  const activeLabel = activeNode && (activeNode.data.recipient || activeNode.data.source)

  return (
    <TableContainer>
      <Table aria-label="Chart legend">
        <TableHead>
          <TableRow>
            <StyledTableHeadCell>{label}</StyledTableHeadCell>
            <StyledTableHeadCell align="right">Total</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <StyledTableRow
              key={row.recipient || row.source}
              style={{ backgroundColor: (activeLabel === (row.recipient || row.source)) ? theme.palette.grey[200] : '' }}>
              <StyledTableBodyCell>
                <GlossaryTerm
                  termKey={legendLabels(row.recipient || row.source)}
                  isInTable={true}
                  style={{ whiteSpace: 'inherit' }}>
                  { legendLabels(row.recipient || row.source) }
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
}
