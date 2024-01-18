import React from 'react'
import { Box, Link } from '@material-ui/core'
import { makeStyles, withStyles, useTheme } from '@material-ui/styles'

import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import MuiTypography from '@material-ui/core/Typography'

import AssignmentIcon from '@material-ui/icons/Assignment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import BarChartIcon from '@material-ui/icons/BarChart'
import PieChartIcon from '@material-ui/icons/PieChart'

const reportsStyles = makeStyles(theme => ({
  lavendar: {
    backgroundColor: '#dcd2df'
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
  },
  primaryText: {
    color: theme.palette.text.secondary
  },
  formulaContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  formula: {
    padding: '1rem',
    border: '2px solid #000',
    backgroundColor: theme.palette.background.default,
    textAlign: 'center'
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

const ExpansionPanel = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles(theme => ({
  root: {
    display: 'inline-flex',
    color: theme.palette.primary[50],
    paddingLeft: 0,
    marginBottom: -1,
    minHeight: 36,
    '&$expanded': {
      minHeight: 36,
    },
  },
  content: {
    flexGrow: 0,
    margin: 0,
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {},
}))(MuiExpansionPanelSummary)

const Typography = withStyles({
  body1: {
    fontSize: 'inherit'
  }
})(MuiTypography)

const ExpansionPanelDetails = withStyles({
  root: {
    paddingLeft: 0,
    display: 'block'
  },
})(MuiExpansionPanelDetails)

const SalesDataDiagram = () => {
  const theme = useTheme()
  const expandIconClasses = expandStyles()
  const miscClasses = reportsStyles(theme)
  return (
    <>
      <Box mt={'1.5rem'} position={'relative'}>
        <Box position={'absolute'}>
          <AssignmentIcon fontSize='large' classes={clipboard()}/>
        </Box>
        <Box className={miscClasses.lavendar} borderLeft={'3px solid #000000'} py={'0.5rem'} ml={'50px'} pl={'60px'}>
          <div><b>Reporters submit royalty reporting</b></div>
          <div>Reporters use ONRR’s royalty reporting system, eCommerce, to report royalty revenues on Federal oil and gas, using the electronic Report of Sales and
        Royalty and Remittance Form (ONRR–2014).</div>
          <ExpansionPanel className={miscClasses.lavendar}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Box className={miscClasses.primaryText}>Additional details for royalty reporting</Box>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Box>Royalty revenues are based on the amount and value of production removed or sold from the lease.  Federal royalty rates are lease-specific and generally
              depend on the location of the oil or gas lease. The location of the lease also determines the applicable statutory requirements.
              To determine the royalty value owed by a lessee, the following equation is used:</Box>
              <Box mt={'1rem'}>To determine the royalty value owed by a lessee, the following equation is used:</Box>
              <Box mt={'1rem'} className={miscClasses.formulaContainer}>
                <Box className={miscClasses.formula}>
                  <Typography>Royalty Value = </Typography>
                  <Typography>(Volume sold * Sales price * Royalty rate) - Deductions</Typography>
                </Box>
              </Box>
              <Box>
                <Typography>Citations:</Typography>
                <ul style={{margin: '0'}}>
                  <li><Link href='https://www.ecfr.gov/current/title-30/part-1210/subpart-B'>ONRR Royalty Reports for Oil and Gas: 30 CFR Part 2010 Subpart B</Link></li>
                  <li><Link href='https://onrr.gov/document/2014.pdf'>ONRR 2014 Form</Link></li>
                  <li><Link href='https://www.onrr.gov/references/handbooks/minerals-revenue-reporter-handbook'>Minerals Revenue Reporter Handbook</Link></li>
                  <li><Link href='https://www.onrr.gov/references/valuation?tabs=valuation-regulations'>Valuation Regulations</Link></li>
                </ul>
              </Box>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Box>
      </Box>
      <Box position={'relative'}>
        <Box position={'absolute'} left={18}>
          <Box className={miscClasses.diagramCirle}></Box>
        </Box>
        <Box className={miscClasses.lavendar} borderLeft={'3px solid #000000'} py={'0.5rem'} borderTop={'1rem solid white'} ml={'50px'} pl={'60px'}>
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
        <Box className={miscClasses.lavendar} borderLeft={'3px solid #000000'} py={'0.5rem'} borderTop={'1rem solid white'} ml={'50px'} pl={'60px'}>
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
