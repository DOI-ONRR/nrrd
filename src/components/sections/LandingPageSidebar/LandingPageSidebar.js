import React from 'react';
import FyAtAGlance from '../FYAtAGlance'
import { FYProductionSummary } from '../FYProductionSummary';
import { LPMonthlyFactSheet } from '../LPMonthlyFactsheet'
import { WhatsNew } from '../WhatsNew';

export default function LandingPageSidebar() {
  return(
    <>
      <FyAtAGlance />

      <FYProductionSummary />

      <LPMonthlyFactSheet />

      <WhatsNew />
    </>
  )
}