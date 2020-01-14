import React from 'react'
import Explore from './Explore'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

const Disbursements = props => {
  return (
    <Explore
      title="disbursements"
	    contentLeft={
        <>
          <ExploreDataLink
            to="/explore/#federal-disbursements"
            icon="data"
          >
			      Disbursements trends
		      </ExploreDataLink>
          <ExploreDataLink
				  to="/query-data/?dataType=Disbursements"
				  icon="filter">
            Disbursements in detail
			    </ExploreDataLink>
		    </>
		  }
		  contentCenter={
			  <ExploreDataLink
          to="/how-it-works/#disbursements"
          icon="works">
          How disbursements work
			  </ExploreDataLink>
      }

      contentRight={
        <ExploreDataLink
          to="/downloads/#disbursements"
          icon="download">
          Downloads and documentation
        </ExploreDataLink>
      }
    />
  )
}

export default Disbursements
