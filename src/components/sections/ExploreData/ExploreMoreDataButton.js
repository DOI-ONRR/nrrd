import React, { useEffect, useState, useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Button
} from '@material-ui/core'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import {
  animateScroll as scroll,
  scroller
} from 'react-scroll'

import { DataFilterContext } from '../../../stores/data-filter-store'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
    zIndex: 500,
  },
  exploreButtonRoot: {
    background: theme.palette.links.default,
    color: theme.palette.common.white,
    minWidth: 250,
    padding: 4,
    fontSize: theme.typography.h3.fontSize,
    '&:hover': {
      background: theme.palette.links.hover,
    }
  },
  exploreButtonLabel: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    lineHeight: 1.25,
    padding: '5px 16px',
  },
  buttonScrollLabel: {
    fontSize: 14,
    position: 'relative',
  },
  buttonScrollIcon: {
    height: 20,
    '& svg': {
      position: 'relative',
      top: -10,
      fontSize: 40,
    },
  },
}))

const ExploreMoreDataButton = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)

  const dataType = filterState.dataType.toLowerCase()

  const [buttonState, setButtonState] = useState({
    label: `Explore more ${ dataType }`,
    icon: 'down'
  })

  const handler = () => {
    if (window.pageYOffset > 0) {
      setButtonState({ ...buttonState, label: 'Back to map', icon: 'up' })
    }
    else {
      setButtonState({ ...buttonState, label: `Explore more ${ dataType }`, icon: 'down' })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handler)

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [buttonState])

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }

  const scrollTo = () => {
    scroller.scrollTo('exploreDataContent', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -50,
    })
  }

  return (
    <Box className={classes.root}>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        disableRipple
        className={classes.exploreMoreButton}
        classes={{
          root: classes.exploreButtonRoot,
          label: classes.exploreButtonLabel
        }}
        onClick={buttonState.icon === 'down' ? scrollTo : scrollToTop}
      >
        {buttonState.label}
        <span className={classes.buttonScrollLabel}>
          { buttonState.icon === 'down' ? 'Scroll down' : 'Scroll up' }
        </span>
        <span className={classes.buttonScrollIcon}>
          {buttonState.icon === 'down' ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </span>
      </Button>
    </Box>

  )
}

export default ExploreMoreDataButton
