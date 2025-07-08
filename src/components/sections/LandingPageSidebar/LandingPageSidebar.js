import React from 'react';
import FyAtAGlance from '../FYAtAGlance'
import { FYProductionSummary } from '../FYProductionSummary';
import { FYRevenueSummary } from '../FYRevenueSummary';
import { FYDisbursementsSummary } from '../FYDisbursementsSummary'
import { LPMonthlyFactSheet } from '../LPMonthlyFactsheet'
import { WhatsNew } from '../WhatsNew';
import { gql, useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';

const atAGlanceQuery = gql`
  query FYDataAtAGlance {
    productionCurrFy: curr_fy_production_summary_v {
      commodity
      unit_abbr
      volume
    }

    productionPrevFy: prev_fy_production_summary_v {
      commodity
      unit_abbr
      volume
    }

    datasetPeriodInfo: max_fy_month_by_dataset_v {
      fiscalYear: fiscal_year
      fiscalMonth: fiscal_month
      dataset
    }

    fyRevenue: fy_revenue_summary_v {
      fy
      revenue
    }

    fyDisbursements: fy_disbursement_summary_v {
      fy
      disbursement
    }
  }
`

export default function LandingPageSidebar() {
  const { loading, error, data } = useQuery(atAGlanceQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return(
    <>
      <FyAtAGlance />

      <FYProductionSummary 
        currentFYData={ data.productionCurrFy }
        prevFYData={ data.productionPrevFy }
        fyPeriodData={data.datasetPeriodInfo.find((p) => p.dataset === 'production')}/>

      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <FYRevenueSummary
            revenueData={data.fyRevenue}
            fyPeriodData={data.datasetPeriodInfo.find((p) => p.dataset === 'revenue')}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <FYDisbursementsSummary
            disbursementsData={data.fyDisbursements}
            fyPeriodData={data.datasetPeriodInfo.find((p) => p.dataset === 'disbursements')}/>
        </Grid>
      </Grid>

      <LPMonthlyFactSheet />

      <WhatsNew />
    </>
  )
}