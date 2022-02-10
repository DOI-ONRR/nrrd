import React from 'react'
import Explore from './Explore'
import Link from '../../../components/Link'

const ExploreProduction = props => {
  return (
    <Explore
      title="production"
      contentLeft={
        <>
          <Link
            href="/explore/?dataType=Production"
            linkType="ExploreData"
            mt={0}>
            Explore production data
          </Link>
          <Link
            href="/query-data/?dataType=Production"
            linkType="FilterTable"
            mt={0}>
            Query production data
          </Link>
        </>
      }
      contentCenter={
        <Link
          href="/how-revenue-works#the-production-process"
          linkType="HowWorks"
          mt={0}>
          How production works
        </Link>
      }
      contentRight={
        <Link
          href="/downloads/#Production"
          linkType="DownloadData"
          mt={0}>
          Downloads and documentation
        </Link>
      }
    />
  )
}

export default ExploreProduction
