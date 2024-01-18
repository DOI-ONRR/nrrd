import React from 'react'
import { Box, Link, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import AssignmentIcon from '@material-ui/icons/Assignment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import BarChartIcon from '@material-ui/icons/BarChart'
import PieChartIcon from '@material-ui/icons/PieChart'

const reportsStyles = makeStyles(() => ({
  lavendar: {
    backgroundColor: '#dcd2df',
    marginLeft: '50px',
    paddingLeft: '60px'
  },
  diagramCirle: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '100px',
    verticalAlign: 'middle',
    padding: '30px',
    border: '3px solid black',
    backgroundColor: '#ffffff'
  },
  minty: {
    backgroundColor: '#c2d0bd'
  },
  slate: {
    backgroundColor: '#d3dfe6'
  }
}))

const clipboard = makeStyles(() => ({
  root: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '100px',
    verticalAlign: 'middle',
    padding: '30px',
    border: '3px solid black',
    backgroundColor: '#ffffff'
  }
}))

const expandStyles = makeStyles(() => ({
  root: {
    verticalAlign: 'bottom',
    paddingTop: '5px'
  }
}))

const SalesDataDiagram = () => {
  const expandIconClasses = expandStyles()
  const miscClasses = reportsStyles()
  return (
    <>
      <Box mt={'1.5rem'} position={'relative'}>
        <Box position={'absolute'}>
          <AssignmentIcon fontSize='large' classes={clipboard()}/>
        </Box>
        <Box className={miscClasses.lavendar} borderLeft={'3px solid #000000'} py={'0.5rem'}>
          <div><b>Reporters submit royalty reporting</b></div>
          <div>Reporters use ONRR’s royalty reporting system, eCommerce, to report royalty revenues on Federal oil and gas, using the electronic Report of Sales and
        Royalty and Remittance Form (ONRR–2014).</div>
          <Box fontSize={'0.975rem'}>
            <Link href='#' onClick={'preventDefault'}>Additional details for royalty reporting</Link>
            <ExpandMoreIcon classes={expandIconClasses}/>
          </Box>
        </Box>
      </Box>
      <Box position={'relative'}>
        <Box position={'absolute'} left={18}>
          <Box className={miscClasses.diagramCirle}></Box>
        </Box>
        <Box className={miscClasses.lavendar} borderLeft={'3px solid #000000'} py={'0.5rem'} borderTop={'1rem solid white'}>
          <Box fontWeight={'bold'}>Calculate federal royalty value with adjustments for royalty relief and/or quality gravity bank</Box>
          <Box fontSize={'0.975rem'}>
            <Link href='#' onClick={'preventDefault'}>Additional details for calculation</Link>
            <ExpandMoreIcon classes={expandIconClasses}/>
          </Box>
        </Box>
      </Box>
      <Box position={'relative'}>
        <Box position={'absolute'} left={18}>
          <Box className={miscClasses.diagramCirle}></Box>
        </Box>
        <Box className={miscClasses.lavendar} borderLeft={'3px solid #000000'} py={'0.5rem'} borderTop={'1rem solid white'}>
          <Box fontWeight={'bold'}>Deduct regulatory allowances</Box>
          <Box fontSize={'0.975rem'}>
            <Link href='#' onClick={'preventDefault'}>Additional details for allowances</Link>
            <ExpandMoreIcon classes={expandIconClasses}/>
          </Box>
        </Box>
      </Box>

      <Box position={'relative'}>
        <Box position={'absolute'}>
          <BarChartIcon fontSize='large' classes={clipboard()}/>
        </Box>
        <Box className={miscClasses.minty} borderLeft={'3px solid #000000'} py={'0.5rem'} ml={'50px'} pl={'60px'} borderTop={'1rem solid white'}>
          <div><b>ONRR aggregates sales data</b></div>
          <div>ONRR collects the royalty reporting data from payors across federal lands. ONRR aggregates it to develop this sales dataset, which is publicly available.</div>
          <Box fontSize={'0.975rem'}>
            <Link href='#' onClick={'preventDefault'}>Citations for ONRR data processes</Link>
            <ExpandMoreIcon classes={expandIconClasses}/>
          </Box>
        </Box>
      </Box>

      <Box position={'relative'}>
        <Box position={'absolute'}>
          <PieChartIcon fontSize='large' classes={clipboard()}/>
        </Box>
        <Box className={miscClasses.slate} borderLeft={'3px solid #000000'} py={'0.5rem'} ml={'50px'} pl={'60px'} borderTop={'1rem solid white'}>
          <div><b>Calculation of Effective Royalty Rate</b></div>
          <div>The Effective Royalty Rate (ERR) accounts for royalty relief, deductions, and other adjustments before the royalty value is divided by the sales value.
            The ERR is an equation defined by the Office of Inspector General (OIG). ONRR does not use the ERR in any of its processes.</div>
          <Box fontSize={'0.975rem'}>
            <Link href='#' onClick={'preventDefault'}>Additional details for Effective Royalty Rate</Link>
            <ExpandMoreIcon classes={expandIconClasses}/>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default SalesDataDiagram
