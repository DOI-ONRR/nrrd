import React from 'react'
import Explore from './Explore'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

const ExploreProduction = props => {
  return (
    <Explore
      title="production"
      contentLeft={
        <>
          <ExploreDataLink to="/explore/?dataType=Production" icon="data">
            Explore production data
          </ExploreDataLink>
          <ExploreDataLink to="/query-data/?dataType=Production" icon="filter">
            Query production data
          </ExploreDataLink>
          {/* <ExploreDataLink
            to="/how-revenue-works/native-american-production/#production-on-native-american-land"
            icon="data"
          >
            Production trends on Native American lands
          </ExploreDataLink> */}
        </>
      }
      contentCenter={
        <ExploreDataLink to="/how-revenue-works#the-production-process" icon="works">
          How production works
        </ExploreDataLink>
      }
      contentRight={
        <ExploreDataLink to="/downloads/#Production" icon="download">
          Downloads and documentation
        </ExploreDataLink>
      }
    />
  )
}

export default ExploreProduction
