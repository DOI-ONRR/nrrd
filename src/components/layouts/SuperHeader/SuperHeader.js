import React, { useState } from 'react'

import { Box } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'

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
      transition: 'height .2s ease',
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
        height: 35,
        minHeight: 35,
        transition: 'height .2s ease',
      }
    }
  })
)(Box)

const SuperHeader = ({ data, ...rest }) => {
  const [isActive, setIsActive] = useState(true)

  React.useEffect(() => {
    let scrollPosition = 0

    const pageHeight = document.body.offsetHeight
    const viewportHeight = window.innerHeight

    function handleScroll () {
      const newScrollPosition = window.scrollY

      if (newScrollPosition === scrollPosition) {
        return
      }

      if (newScrollPosition < 0 || newScrollPosition + viewportHeight > pageHeight) {
        return
      }

      const shouldShow = newScrollPosition < scrollPosition
      setIsActive(shouldShow)

      scrollPosition = newScrollPosition
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <SuperHeaderContainer>
      <div className={isActive ? 'isActive' : 'notActive'}>
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
