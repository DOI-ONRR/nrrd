import React from 'react';
import { LPMonthlyFactSheet } from '../LPMonthlyFactsheet'
import { WhatsNew } from '../WhatsNew';
import { gql, useQuery } from '@apollo/client';
import { ReleaseDetails } from '../ReleaseDetails';

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

  console.log(data);
  return(
    <>
      { data != null &&
        <WhatsNew data={data} />
      }

      <LPMonthlyFactSheet />      

      <ReleaseDetails />
    </>
  )
}