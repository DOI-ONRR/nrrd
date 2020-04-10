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
    '& li.active': {
      borderBottom: `2px solid ${ theme.palette.links.default }`,
      background: theme.palette.grey[100],
    },
  },
}))

// Page ScrollTo
const PageSubMenu = ({ menuItems, ...props }) => {
  const classes = useStyles()

  const [subMenu, setSubMenu] = useState({
    scrollOffset: parseInt(props.scrollOffset) || 0,
    items: menuItems || [],
    mobileActive: false
  })

  useLayoutEffect(() => {
    createSubMenu()
  }, [])

  // handler
  const handler = useCallback(() => {
    const subMenuLinks = document.querySelectorAll('#page-scrollto-subnav li a')

    if (subMenuLinks) {
      handleScroll(subMenuLinks)
    }
  }, [])

  useEventListener('scroll', handler)

  // handleScroll
  const handleScroll = subMenuLinks => {
    const fromTop = window.scrollY

    subMenuLinks.forEach((link, index) => {
      const section = document.querySelector(link.hash || 'body')

      if (!section) return

      if (
        section.offsetTop <= fromTop &&
        section.offsetTop + section.offsetHeight > fromTop
      ) {
        link.offsetParent.classList.add('active')
      }
      else {
        link.offsetParent.classList.remove('active')
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
    <Container>
      <Grid container>
        <Grid item md={12}>
          <Box className={classes.root}>
            <StickyWrapper enabled={true} top={78} bottomBoundary={0} innerZ="1000" activeClass="sticky">
              <Paper elevation={1} square>
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
              </Paper>
            </StickyWrapper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default PageSubMenu
