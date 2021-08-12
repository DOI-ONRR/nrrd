import React from 'react'
// not used import * as d3 from 'd3'

import PropTypes from 'prop-types'

import { withStyles, createStyles, useTheme } from '@material-ui/core/styles'

import GlossaryTerm from '../../GlossaryTerm/GlossaryTerm'
import Rect from '../svg/Rect'

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
  activeNode,
  legendHeaders,
  legendFormat = d => d,
  legendLabelFormat = d => d,
  legendReverse = false,
  legendTotal = false,
  legendType,
  xAxis,
  yAxis,
  xDomain,
  yOrderBy,
  yGroupBy,
  colorScale,
  ...rest
}) => {
  // console.log('Legend data: ', data)
  const theme = useTheme()
  const activeKey = (activeNode && activeNode.key) && activeNode.key
  const legendData = legendReverse ? data.reverse() : data
  let total
  let legendKey
  let rowTotal

  const legendObj = legendData[legendData.length - 1]
  if (legendObj) {
    legendKey = Object.keys(legendObj).filter(item => item === 'total')
    rowTotal = (yAxis !== legendKey) ? legendKey : yAxis
  }

  // legend total
  if (legendTotal) {
    total = legendData.filter(item => !isNaN(item.total)).reduce((acc, key) => acc + key[rowTotal], 0)
  }

  return (
    <TableContainer>
      <Table size="small" aria-label="Chart legend table">
        {legendHeaders && legendHeaders.length > 0 &&
        <TableHead>
          <TableRow>
            <StyledTableHeadCell colSpan={2} width="50%">{legendHeaders[0]}</StyledTableHeadCell>
            <StyledTableHeadCell align="right">{legendHeaders[1]}</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        }
        <TableBody>
          {legendData.map((row, i) => {
            return (
              <StyledTableRow
                key={`lstr__${ i }`}
                style={{ backgroundColor: (activeKey === row[xAxis]) ? theme.palette.grey[200] : '' }}>
                <StyledTableBodyCell style={{ verticalAlign: 'middle', width: '5%' }}>
                  <Rect
                    width={20}
                    height={20}
                    styles={{ fill: (legendType === 'circle') ? colorScale(i + 2) : colorScale(i), marginTop: 0 }}
                  />
                </StyledTableBodyCell>
                <StyledTableBodyCell>
                  <GlossaryTerm
                    termKey={legendLabelFormat(row[xAxis]) || ''}
                    isInTable={true}
                    style={{ whiteSpace: 'inherit' }}>
                    { legendLabelFormat(row[xAxis]) || '' }
                  </GlossaryTerm>
                </StyledTableBodyCell>
                <StyledTableBodyCell align="right">
                  {row[rowTotal] === '-' ? row[rowTotal] : legendFormat(row[rowTotal])}
                </StyledTableBodyCell>
              </StyledTableRow>
            )
          }
          )}
          { legendTotal &&
              <StyledTableRow>
                <StyledTableBodyCell colSpan={2} style={{ fontWeight: 'bold' }}>
                  Total
                </StyledTableBodyCell>
                <StyledTableBodyCell align="right" style={{ fontWeight: 'bold' }}>
                  {legendFormat(total)}
                </StyledTableBodyCell>
              </StyledTableRow>
          }
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
