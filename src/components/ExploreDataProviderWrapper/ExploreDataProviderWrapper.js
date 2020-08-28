import React from 'react'

import { ExploreDataProvider } from '../../stores/explore-data-store'

const ExploreDataProviderWrapper = ({ children, defaults }) => {
  return (
    <ExploreDataProvider defaults={defaults}>
      {children}
    </ExploreDataProvider>
  )
}

export default ExploreDataProviderWrapper
