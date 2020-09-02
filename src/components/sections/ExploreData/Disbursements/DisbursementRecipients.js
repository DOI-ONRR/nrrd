import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import CircleChart from '../../../data-viz/CircleChart/CircleChart'
import QueryLink from '../../../../components/QueryLink'

import utils from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

import CONSTANTS from '../../../../js/constants'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '& .chart-container': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'top',
      '& .chart': {
        width: '100%',
        height: 250
      },
      '& .legend': {
        marginTop: theme.spacing(2),
        height: 'auto',
      },
    },
  }
}))

const APOLLO_QUERY = gql`
  # summary card queries
  query DisbursementRecipientSummary($year: Int!, $period: String!, $state: [String!]) {

    DisbursementRecipientSummary: disbursement_recipient_summary(
      where: { 
        fiscal_year: { _eq: $year }, 
        state_or_area: { _in: $state },
        recipient: {_neq: "Native American tribes and individuals"}
      }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      recipient
      state_or_area
      total
    }
  }
`

const DisbursementRecipients = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const classes = useStyles()

  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year

  const state = props.fipsCode

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: CONSTANTS.FISCAL_YEAR }
  })

  if (loading) {
    return 'Loading ... '
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []

  if (
    data &&
    data.DisbursementRecipientSummary.length > 0) {
    chartData = data

    if (chartData.DisbursementRecipientSummary.length > 1) {
      return (<Box className={classes.root}>
        <Box component="h4" fontWeight="bold">Disbursements by recipient</Box>
        <Box>
          <CircleChart
            key={'DR' + dataSet }
            data={chartData.DisbursementRecipientSummary}
            xAxis='recipient'
            yAxis='total'
            minColor='#FCBA8B'
            maxColor='#B64D00'
            format={ d => {
              return utils.formatToDollarInt(d)
            }}
	          legendLabel={
              d => {
                if (d.match('Native')) {
                  d = 'Native American'
                }
                else if (d.match('governments')) {
			            d = 'State and local'
                }
                else if (d.match('Land')) {
			            d = 'LWCF*'
                }
                else if (d.match('Historic')) {
			            d = 'HPF**'
                }

                return d
              }
            }
            circleTooltip={
              d => {
                const r = []
                r[0] = d.recipient
                r[1] = utils.formatToDollarInt(d.total)
                return r
              }
            } />

          <>{ state === DFC.NATIONWIDE_FEDERAL_FIPS &&
            <Box fontSize='.8rem' fontStyle='italic' mt={1} >* Land and Water Conservation Fund</Box>} </>
          <>{ state === DFC.NATIONWIDE_FEDERAL_FIPS &&
            <Box fontSize='.8rem' fontStyle='italic' >** Historic Perservation Fund</Box>
          }
          </>

          <QueryLink
            groupBy={DFC.RECIPIENT}
            linkType="FilterTable" {...props}
            recipient="Historic Preservation Fund,Land and Water Conservation Fund,Other,Reclamation,State and local governments,U.S. Treasury">
            Query disbursements by recipient
          </QueryLink>
        </Box>
      </Box>
      )
    }
    else if (chartData.DisbursementRecipientSummary.length === 1) {
      return (
        <Box className={classes.boxSection}>
          <Box component="h4" fontWeight="bold">Disbursements by recipients</Box>
          <Box fontSize="subtitle2.fontSize">
          All of  disbursements went to the state</Box>
        </Box>
      )
    }
  }

  return (
    <Box className={classes.root}></Box>
  )
}

export default DisbursementRecipients
