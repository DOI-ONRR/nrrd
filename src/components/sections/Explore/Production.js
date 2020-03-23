import React from 'react'
import Explore from './Explore'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

const ExploreProduction = props => {
  return (
    <Explore
      title="production"
      contentLeft={
        <>
          <ExploreDataLink to="/explore/#federal-production" icon="data">
            Production trends on federal lands and waters
          </ExploreDataLink>
          <ExploreDataLink to="/query-data/?dataType=Production" icon="filter">
            Production in detail
          </ExploreDataLink>
          <ExploreDataLink
            to="/how-it-works/native-american-production/#production-on-native-american-land"
            icon="data"
          >
            Production trends on Native American lands
          </ExploreDataLink>
        </>
      }
      contentCenter={
        <ExploreDataLink to="/how-it-works/#production_process" icon="works">
          How production works
        </ExploreDataLink>
      }
      contentRight={
        <ExploreDataLink to="/downloads/#production" icon="download">
          Downloads and documentation
        </ExploreDataLink>
      }
    />
  )
}

export default ExploreProduction
