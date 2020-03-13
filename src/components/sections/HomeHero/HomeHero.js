import React from 'react'
import Box from '@material-ui/core/Box'

import GlossaryTerm from '../../GlossaryTerm/GlossaryTerm'

const HomeHero = () => {
  return (
    <Box component="h2" pb={5} fontWeight="normal" style={{ lineHeight: '2.25rem' }}>
        When companies extract energy and mineral resources on property
        leased from the federal government and Native Americans, they pay{' '}
      <GlossaryTerm termKey="Bonus">bonuses</GlossaryTerm>,{' '}
      <GlossaryTerm>rent</GlossaryTerm>, and{' '}
      <GlossaryTerm termKey="Royalty">royalties</GlossaryTerm>. The
        Office of Natural Resources Revenue (ONRR) collects and{' '}
      <GlossaryTerm termKey="disbursement">disburses</GlossaryTerm>{' '}
        revenue from federal lands and waters to different agencies,
        funds, and local governments for public use. All revenue collected
        from extraction on Native American lands is disbursed to Native
        American tribes, nations, or individuals.
    </Box>
  )
}

export default HomeHero
