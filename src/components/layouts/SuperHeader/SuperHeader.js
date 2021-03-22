import React from 'react'

import { Box } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'

import useWindowScroll from '../../../js/hooks/useWindowScroll'

import InfoBanner from '../../content-partials/InfoBanner'
import ShutdownBanner from '../../content-partials/ShutdownBanner'
import BrowserBanner from '../BrowserBanner'
import AppToolbar from '../../toolbars/AppToolbar'

const SuperHeaderContainer = withStyles(theme =>
  createStyles({
    root: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100vw',
      zIndex: '1002',
      maxWidth: '100%',
      transition: 'height .1s ease',
      '& .notActive > div:first-child': {
        height: 0,
        transition: 'height .2s ease',
      },
      '& .notActive > div:last-child > header > div': {
        height: 60,
        minHeight: 'inherit',
        transition: 'height .2s ease',
      },
      '& .notActive > div:last-child .header-logo': {
        height: 40,
        minHeight: 40,
        transition: 'height .2s ease',
      }
    }
  })
)(Box)

const SuperHeader = ({ data, ...rest }) => {
  const isScrollActive = useWindowScroll()
  return (
    <SuperHeaderContainer>
      <div className={isScrollActive ? 'isActive' : 'notActive'}>
        <InfoBanner />
        {data.site.siteMetadata.isShutdown === 'true' &&
          <ShutdownBanner />
        }
        <BrowserBanner />
        <AppToolbar />
      </div>
    </SuperHeaderContainer>
  )
}

export default SuperHeader
