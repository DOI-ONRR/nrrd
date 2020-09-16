import React from 'react'
import Explore from './Explore'
import Link from '../../../components/Link'

const ExploreRevenue = props => {
  return (
    <Explore
      title="revenue"
      contentLeft={
        <>
          <Link
            href="/explore/#revenue"
            linkType="ExploreData"
            mt={0}>
            Explore revenue data
          </Link>
          <Link
            href="/query-data/?dataType=Revenue"
            linkType="FilterTable"
            mt={0}>
            Query revenue data
          </Link>
        </>
      }
      contentCenter={
        <Link
          href="/how-revenue-works#understanding-federal-revenues"
          linkType="HowWorks"
          mt={0}>
          How revenue works
        </Link>
      }
      contentRight={
        <Link
          href="/downloads/#Revenue"
          linkType="DownloadData"
          mt={0}>
          Downloads and documentation
        </Link>
      }
    />
  )
}

export default ExploreRevenue
