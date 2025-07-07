import React from 'react';
import FyAtAGlance from '../FYAtAGlance'
import { FYProductionSummary } from '../FYProductionSummary';
import { LPMonthlyFactSheet } from '../LPMonthlyFactsheet'
import { WhatsNew } from '../WhatsNew';
import { gql, useQuery } from '@apollo/client';

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

    max_fy_month_by_dataset_v {
      fiscal_month
      dataset
    }
  }
`

export default function LandingPageSidebar() {
  const { loading, error, data } = useQuery(atAGlanceQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data)
  return(
    <>
      <FyAtAGlance />

      <FYProductionSummary 
        currentFYData={ data.productionCurrFy }
        prevFYData={ data.productionPrevFy }/>

      <LPMonthlyFactSheet />

      <WhatsNew />
    </>
  )
}