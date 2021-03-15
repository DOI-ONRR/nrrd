import React from 'react'
import * as d3 from 'd3'

import PropTypes from 'prop-types'

import { withStyles, createStyles, useTheme } from '@material-ui/core/styles'

import GlossaryTerm from '../../GlossaryTerm/GlossaryTerm'
import { Rect } from '../svg/Rect'

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

const Legend = ({
  data,
  root,
  activeNode,
  legendLabels,
  format,
  formatLegendLabels,
  xAxis,
  yAxis,
  colorScale,
  ...rest
}) => {
  console.log('Legend props: ', data, root)
  const theme = useTheme()

  const legendData = root.filter((node, i) => i > 0)
  const activeLabel = activeNode && (activeNode.data[xAxis])

  console.log('legendData: ', legendData)

  return (
    <TableContainer>
      <Table aria-label="Chart legend table">
        <TableHead>
          <TableRow>
            <StyledTableHeadCell colspan={2}>{legendLabels[0]}</StyledTableHeadCell>
            <StyledTableHeadCell align="right">{legendLabels[1]}</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {legendData.map((row, i) => (
            <StyledTableRow
              key={row.data[xAxis]}
              style={{ backgroundColor: (activeLabel === row.data[xAxis]) ? theme.palette.grey[200] : '' }}>
              <StyledTableBodyCell style={{ verticalAlign: 'top' }}>
                <Rect
                  width={20}
                  height={20}
                  styles={{ fill: colorScale(i), marginTop: 5 }}
                />
              </StyledTableBodyCell>
              <StyledTableBodyCell>
                <GlossaryTerm
                  termKey={formatLegendLabels(row.data[xAxis])}
                  isInTable={true}
                  style={{ whiteSpace: 'inherit' }}>
                  { formatLegendLabels(row.data[xAxis]) }
                </GlossaryTerm>
              </StyledTableBodyCell>
              <StyledTableBodyCell align="right">
                {format(row.data[yAxis])}
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
  data: PropTypes.func.isRequired,
  labels: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string])
}
