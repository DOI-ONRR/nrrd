import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'

import {
  animateScroll as scroll,
  scroller,
  Link
} from 'react-scroll'

import { StickyWrapper } from '../../utils/StickyWrapper'
import useEventListener from '../../../js/use-event-listener'
import utils from '../../../js/utils'
// import Link from '../../Link'

import {
  Box,
  Container,
  Grid,
  MenuList,
  MenuItem,
  Paper
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    color: theme.palette.links.default,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(0),
    width: '100%',
    '& ul': {
      display: 'flex',
      padding: 0,
      whiteSpace: 'nowrap',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      MsOverflowStyle: '-ms-autohiding-scrollbar',
    },
    '& li a': {
      fontWeight: 'bold',
      textDecoration: 'none',
    },
    '& li.active:first-child': {
      border: 'none',
      background: 'none',
    },
    '& li a.active': {
      borderBottom: `2px solid ${ theme.palette.links.default }`,
      background: theme.palette.grey[100],
    },
  },
  subMenuLink: {
    color: theme.palette.links.default,
  },
  activeLink: {
    '&:first-child': {
      border: 'none',
      background: 'none',
    },
    borderBottom: `2px solid ${ theme.palette.links.default }`,
    background: theme.palette.grey[100],
  },
}))

// Page ScrollTo
const PageSubMenu = ({ menuItems, ...props }) => {
  const classes = useStyles()

  const [subMenu, setSubMenu] = useState({
    scrollOffset: parseInt(props.scrollOffset) || -150,
    items: menuItems || [],
    mobileActive: false
  })

  // handler
  const handler = useCallback(() => {
    const subMenuLinks = document.querySelectorAll('#page-scrollto-subnav li a')

    if (subMenuLinks) {
      handleScroll(subMenuLinks)
    }
  }, [subMenu])

  useEventListener('scroll', handler)

  const handleScroll = subMenuLinks => {
    const fromTop = window.scrollY

    subMenuLinks.forEach((link, index) => {
      const section = document.querySelector(link.hash || 'body')

      if (!section) return

      const sectionCalcPos = section.offsetTop - subMenu.scrollOffset

      if (
        sectionCalcPos <= fromTop &&
        sectionCalcPos + section.offsetHeight > fromTop
      ) {
        link.offsetParent.classList.add(classes.activeLink)
      }
      else {
        link.offsetParent.classList.remove(classes.activeLink)
      }
    })
  }

  const scrollTo = element => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -150
    })
  }

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    })
  }

  return (
    <Box className={classes.root}>
      <StickyWrapper enabled={true} top={0} bottomBoundary={0} innerZ="1000" activeClass="sticky">
        <Paper elevation={1} square>
          <Container maxWidth="lg">
            <MenuList id="page-scrollto-subnav">
              <MenuItem key={0}>
                <a className={classes.subMenuLink} title="Top" onClick={scrollToTop}>
                  Top
                </a>
              </MenuItem>
              { subMenu.items &&
                subMenu.items.map((item, i) =>
                  <MenuItem key={i + 1}>
                    <a
                      href={`#${ utils.formatToSlug(item) }`}
                      onClick={() => scrollTo(utils.formatToSlug(item))}
                      className={classes.subMenuLink}
                      title={item}>
                      {item}
                    </a>
                  </MenuItem>
                )
              }
            </MenuList>
          </Container>
        </Paper>
      </StickyWrapper>
    </Box>
  )
}

export default PageSubMenu
