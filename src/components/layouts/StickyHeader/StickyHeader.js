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
      '& .is-shrunk > div:first-child': {
        height: 0,
        transition: 'height .2s ease',
      },
      '& .is-shrunk > div:last-child > header > div': {
        height: 60,
        minHeight: 'inherit',
        overflow: 'hidden',
        transition: 'height .1s ease',
      },
      '& .is-shrunk > div:last-child .header-logo': {
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
  const [shrunk, setShrunk] = useState(false)

  const size = useWindowSize()

  useEffect(() => {
    const handler = () => {
      setShrunk(isShrunk => {
        if (
          !isShrunk && (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60)
        ) {
          return true
        }

        if (
          isShrunk &&
            document.body.scrollTop < 10 &&
            document.documentElement.scrollTop < 10
        ) {
          return false
        }

        return isShrunk
      })
    }

    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [size.width])

  return (
    <StickyHeaderContainer>
      <div className={shrunk ? 'is-shrunk' : 'not-shrunk'}>
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
