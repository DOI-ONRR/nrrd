import React, { useEffect, useState } from 'react'

import {
  Box,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'

import InfoBanner from '../../content-partials/InfoBanner'
import ShutdownBanner from '../../content-partials/ShutdownBanner'
import BrowserBanner from '../BrowserBanner'
import AppToolbar from '../../toolbars/AppToolbar'

import useWindowSize from '../../../js/hooks/useWindowSize'

const StickyHeaderContainer = withStyles(theme =>
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
      '& .is-collapsed > div:first-child': {
        height: 0,
        transition: 'height .2s ease',
      },
      '& .is-collapsed > div:last-child > header > div': {
        height: 60,
        minHeight: 'inherit',
        overflow: 'hidden',
        transition: 'height .1s ease',
      },
      '& .is-collapsed > div:last-child .header-logo': {
        height: 40,
        minHeight: 40,
        transition: 'height .1s ease',
      },
    }
  })
)(Box)

const StickyHeader = ({ data, ...rest }) => {
  const theme = useTheme()
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('xs'))
  const [collapsed, setCollapsed] = useState(!!matchesSmDown)

  const size = useWindowSize()

  useEffect(() => {
    const matches = matchesSmDown
    const handler = () => {
      setCollapsed(isCollapsed => {
        if (
          !isCollapsed && (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60)
        ) {
          return true
        }

        if (
          isCollapsed &&
            document.body.scrollTop < 10 &&
            document.documentElement.scrollTop < 10
        ) {
          return false
        }

        return isCollapsed
      })
    }

    if (matches) {
      setCollapsed(true)
    }
    else {
      window.addEventListener('scroll', handler)
      return () => window.removeEventListener('scroll', handler)
    }
  }, [size.width, matchesSmDown])

  return (
    <StickyHeaderContainer>
      <div className={collapsed ? 'is-collapsed' : 'not-collapsed'}>
        <InfoBanner />
        {data.site.siteMetadata.isShutdown === 'true' &&
          <ShutdownBanner />
        }
        <BrowserBanner />
        <AppToolbar />
      </div>
    </StickyHeaderContainer>
  )
}

export default StickyHeader
