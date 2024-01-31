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

import GlossaryTerm from '../GlossaryTerm/GlossaryTerm'

const reportsStyles = makeStyles(theme => ({
  lavendar: {
    backgroundColor: '#dcd2df'
  },
  lavendarBorder: {
    border: '3px solid #503b5e',
    color: '#503b5e'
  },
  diagramCirle: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '100px',
    verticalAlign: 'middle',
    padding: '30px',
    border: '3px solid #503b5e',
    backgroundColor: '#ffffff'
  },
  minty: {
    backgroundColor: '#c2d0bd'
  },
  mintyBorder: {
    border: '3px solid #3a4730',
    color: '#3a4730'
  },
  slate: {
    backgroundColor: '#d3dfe6'
  },
  slateBorder: {
    border: '3px solid #39474f',
    color: '#39474f'
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

const icon = makeStyles(() => ({
  root: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '100px',
    verticalAlign: 'middle',
    padding: '30px',
    backgroundColor: '#ffffff'
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
  const miscClasses = reportsStyles(theme)
  return (
    <>
      <Box mt={'1.5rem'} position={'relative'}>
        <Box position={'absolute'}>
          <AssignmentIcon fontSize='large' classes={icon()} className={miscClasses.mintyBorder}/>
        </Box>
        <Box className={miscClasses.minty} borderLeft={'3px solid #3a4730'} py={'0.5rem'} ml={'50px'} pl={'60px'}>
          <div><b>Reporters submit royalty reporting</b></div>
          <div>Reporters use ONRR’s royalty reporting system, eCommerce, to report royalty revenues on federal oil and gas, using the electronic Report of Sales and
        Royalty and Remittance Form (ONRR–2014).</div>
          <ExpansionPanel className={miscClasses.minty}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Box className={miscClasses.primaryText}>Additional details for royalty reporting</Box>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Box>
                Royalty revenues are based on the amount and value of production removed or sold from the lease.  Federal royalty rates are lease-specific and generally
                depend on the location of the oil or gas lease. The location of the lease also determines the applicable statutory requirements.
              </Box>
              <Box my={'1rem'}>To determine the royalty due, reporters use the following steps:</Box>
              <Box fontWeight={'bold'}>A. Calculate federal royalty value with adjustments for royalty relief, quality bank, and/or gravity bank</Box>
              <Box>
                Revenues may be modified by various royalty relief programs, as well as quality bank and gravity bank adjustments. These modifications are made prior to
                any allowances taking place and are included in the 2014 reporting. This calculation results in the Royalty Value Prior to Allowances (RVPA).
              </Box>
              <Box fontWeight={'bold'} mt={'1rem'}>B. Deduct regulatory allowances</Box>
              <Box>
              Allowances are deductions lessees can claim against royalty value for the transportation and processing costs of production; application of
              these allowances decreases the royalty payment owed. Federal regulations allow for “reasonable, actual costs” to be deducted. This dataset
              includes Transportation Allowances and Processing Allowances. This calculation results in the Royalty Value Less Allowances (RLVA).
              </Box>
              <Box mt={'1rem'}>
                These steps result in the equation for royalty due:
              </Box>
              <Box my={'1rem'} py={'0.5rem'} className={miscClasses.formulaContainer} style={{ backgroundColor: '#ffffff', border: '2px solid #000000' }}>
                <table>
                  <tbody>
                    <tr>
                      <td>Royalty Due = </td>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td style={{ paddingBottom: '0.25rem', fontSize: '1rem', textAlign: 'center' }}><GlossaryTerm>Royalty Value Prior to Allowances (RVPA)</GlossaryTerm></td>
                            </tr>
                            <tr>
                              <td>
                                <Box height={'0.5rem'}
                                  borderTop={'2px solid #000'}
                                  borderLeft={'2px solid #000'}
                                  borderRight={'2px solid #000'}></Box>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '0.5rem 0' }}>[Sales Volume * Unit Value * Royalty Rate]</td>
                              <td>- Allowances</td>
                            </tr>
                            <tr>
                              <td colSpan={2}>
                                <Box height={'0.5rem'}
                                  borderBottom={'2px solid #000'}
                                  borderLeft={'2px solid #000'}
                                  borderRight={'2px solid #000'}></Box>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2} style={{ paddingTop: '0.25rem', fontSize: '1rem', textAlign: 'center' }}><GlossaryTerm>Royalty Value Less Allowances (RVLA)</GlossaryTerm></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
              <Box>
                <Typography>Citations:</Typography>
                <ul style={{ margin: '0' }}>
                  <li><Link href='https://www.ecfr.gov/current/title-30/part-1210/subpart-B'>ONRR Royalty Reports for Oil and Gas: 30 CFR Part 2010 Subpart B</Link></li>
                  <li><Link href='https://www.ecfr.gov/current/title-30/section-1210.56'>30 CFR Part 1210.56</Link></li>
                  <li><Link href='https://www.ecfr.gov/current/title-30/chapter-XII/subchapter-A/part-1206/subpart-C'>30 CFR Part 1206 (Subpart C for federal oil)</Link></li>
                  <li><Link href='https://www.ecfr.gov/current/title-30/chapter-XII/subchapter-A/part-1206/subpart-D'>30 CFR Part 1206 (Subpart D for federal gas)</Link></li>
                  <li><Link href='https://www.onrr.gov/references/valuation?tabs=valuation-regulations'>Valuation Regulations</Link></li>
                  <li><Link href='https://onrr.gov/references/valuation'>How Valuation Works</Link></li>
                  <li><Link href='https://www.onrr.gov/reporting/revenue?tabs=forms'>Form ONRR 2014</Link></li>
                  <li><Link href='https://www.onrr.gov/references/handbooks/minerals-revenue-reporter-handbook'>Minerals Revenue Reporter Handbook</Link></li>
                  <li><Link href='https://onrr.gov/document/RRM-Chapter.4.pdf'>Handbook discussion on quality bank adjustments (section 4.11)</Link></li>
                  <li><Link href='https://www.onrr.gov/references/reference-lists?tabs=revenue-reporting-references'>ONRR revenue reporting references</Link></li>
                </ul>
              </Box>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Box>
        <Box ml={'50px'} borderLeft={'3px solid #3a4730'} height={'1.5rem'}></Box>
      </Box>

      <Box position={'relative'}>
        <Box position={'absolute'}>
          <BarChartIcon fontSize='large' classes={icon()} className={miscClasses.lavendarBorder}/>
        </Box>
        <Box className={miscClasses.lavendar} borderLeft={'3px solid #503b5e'} py={'0.5rem'} ml={'50px'} pl={'60px'}>
          <div><b>ONRR aggregates sales data</b></div>
          <div>ONRR collects the royalty reporting data from payors across federal lands. ONRR aggregates it to develop this sales dataset,
            which is publicly available.
          </div>
          <ExpansionPanel className={miscClasses.lavendar}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Box className={miscClasses.primaryText}>Citations for ONRR data processes</Box>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Box>
                <Typography>Citations:</Typography>
                <ul style={{ margin: '0' }}>
                  <li><Link href='https://revenuedata.doi.gov/how-revenue-works/#how-our-data-fits-together'>How Revenue Works - How our data fits together</Link></li>
                </ul>
              </Box>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Box>
        <Box ml={'50px'} borderLeft={'3px solid #503b5e'} height={'1.5rem'}></Box>
      </Box>

      <Box position={'relative'}>
        <Box position={'absolute'}>
          <PieChartIcon fontSize='large' classes={icon()} className={miscClasses.slateBorder}/>
        </Box>
        <Box className={miscClasses.slate} borderLeft={'3px solid #39474f'} py={'0.5rem'} ml={'50px'} pl={'60px'}>
          <div><b>Calculation of Effective Royalty Rate</b></div>
          <div>The Effective Royalty Rate (ERR) accounts for royalty relief, deductions, and other adjustments before the royalty value is divided by the sales value.
            The ERR is an equation defined by the Office of Inspector General (OIG). ONRR does not use the ERR in any of its processes.</div>
          <ExpansionPanel className={miscClasses.slate}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Box className={miscClasses.primaryText}>Additional details for Effective Royalty Rate</Box>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Box>
              The Office of Inspector General defined the following equation to calculate ERR:
              </Box>
              <Box mt={'1rem'} className={miscClasses.formulaContainer} display={'table'}>
                <Box className={miscClasses.formula}>
                  <Box display={'table-cell'} px={'0.5rem'} style={{ verticalAlign: 'middle' }}>Effective Royalty Rate = </Box>
                  <Box display={'table-cell'}>
                    <Box borderBottom={'2px solid rgba(0, 0, 0, 0.1)'}
                      p={'0.5rem'}>(Total Royalty Value - Deductions ± Gravity Bank Adjustments)</Box>
                    <Box pt={'0.5rem'}>Total Sales Value</Box>
                  </Box>
                </Box>
              </Box>
              <Box mt={'1rem'}>
                <Typography>Citations:</Typography>
                <ul style={{ margin: '0' }}>
                  <li><Link href='https://www.doioig.gov/reports/inspection-evaluation/us-department-interior-does-not-analyze-effective-royalty-rates'>OIG Report, Appendix 1</Link></li>
                </ul>
              </Box>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Box>
      </Box>
    </>
  )
}

export default SalesDataDiagram
