import React from 'react'
import Explore from './Explore'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

const ExploreDisbursements = props => {
  return (
    <Explore
      title="disbursements"
	    contentLeft={
        <>
          <ExploreDataLink
            to="/explore/?dataType=Disbursements"
            icon="data"
          >
			      Explore disbursements data
		      </ExploreDataLink>
          <ExploreDataLink
				  to="/query-data/?dataType=Disbursements"
				  icon="filter">
            Query disbursements data
			    </ExploreDataLink>
		    </>
		  }
		  contentCenter={
			  <ExploreDataLink
          to="/how-revenue-works#understanding-federal-disbursements"
          icon="works">
          How disbursements work
			  </ExploreDataLink>
      }

      contentRight={
        <ExploreDataLink
          to="/downloads/#Disbursements"
          icon="download">
          Downloads and documentation
        </ExploreDataLink>
      }
    />
  )
}

export default ExploreDisbursements
