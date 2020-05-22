import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'

import { StickyWrapper } from '../../utils/StickyWrapper'
import useEventListener from '../../../js/use-event-listener'
import utils from '../../../js/utils'
import Link from '../../Link'

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
    // '& li.active': {
    //   borderBottom: `2px solid ${ theme.palette.links.default }`,
    //   background: theme.palette.grey[100],
    // },
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
    scrollOffset: parseInt(props.scrollOffset) || 250,
    items: menuItems || [],
    mobileActive: false
  })

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      // createSubMenu()
    }, 1000)

    return () => clearTimeout(timer)
  }, [(typeof window !== 'undefined') ? window.location.pathname : ''])

  // handler
  const handler = useCallback(() => {
    const subMenuLinks = document.querySelectorAll('#page-scrollto-subnav li a')

    if (subMenuLinks) {
      handleScroll(subMenuLinks)
    }
  }, [setSubMenu])

  useEventListener('scroll', handler)

  // handleScroll
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

  // create sub menu
  const createSubMenu = () => {
    const mainElem = document.getElementsByTagName('main')

    const subMenuItems = []
    const h3Items = mainElem && Array.from(mainElem[0].querySelectorAll('h3'))
    h3Items.forEach(item => subMenuItems.push(item.innerHTML))

    setSubMenu({
      ...subMenu,
      items: subMenuItems,
      mobileActive: document.documentElement.clientWidth <= 767
    })
  }

  return (
    <Box className={classes.root}>
      <StickyWrapper enabled={true} top={90} bottomBoundary={0} innerZ="1000" activeClass="sticky">
        <Paper elevation={1} square>
          <Container maxWidth="lg">
            <MenuList id="page-scrollto-subnav">
              <MenuItem key={0}>
                <Link href="/explore#" title="Top">
                      Top
                </Link>
              </MenuItem>
              { subMenu.items &&
                    subMenu.items.map((item, i) => <MenuItem key={i + 1}><Link href={`/explore#${ utils.formatToSlug(item) }`} title={item}>{item}</Link></MenuItem>)
              }
            </MenuList>
          </Container>
        </Paper>
      </StickyWrapper>
    </Box>
  )
}

export default PageSubMenu
