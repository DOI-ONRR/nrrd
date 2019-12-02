import React, { useEffect, useState } from 'react'
// import ReactDOM from 'react-dom'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Hidden from '@material-ui/core/Hidden'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// import MediaQuery from 'react-responsive'

import utils from '../../../js/utils'

// import styles from './PageToc.module.scss'

import { StickyWrapper } from '../../utils/StickyWrapper'
import { get } from 'https'


const TOC_SUB_ATTRB = 'data-toc-sub'
const TOC_EXCLUDE_ATTRB = 'data-toc-exclude'
const TOC_DISPLAY_AS_ATTRB = 'data-toc-display-as'

const useStyles = makeStyles(theme => ({
	root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(4),
    '& nav > ul': {
      listStyle: `none`,
      padding: 0
    },
    '& nav > ul > li': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    }
  },
  tocContainer: {
    padding: theme.spacing(2)
  },
  tocItem: {
    '& a': {
      textDecoration:  `none`
    }
  },
  tocSub: {
    display: `none`,
    borderLeft: `2px solid #cde3c3`,
  },
  tocSubItemActive: {}
}))


/**
 * This component assumes a single main tag for the page and a single h1 element (which is the title for the menu).
 * The table of contents will be built with h2 and nested h3 elements.
 */
const PageToc = props => {
  const classes = useStyles()

  const [toc, setState] = useState({
    displayTitle: '',
    expanded: false,
    mobileActive: false,
    scrollOffset: parseInt(props.scrollOffset) || 0,
    items: [],
  })

  let isScrolling

  useEffect(() => {
    createToc()
    
    let tocLinks = document.querySelectorAll('#page-toc-nav ul li a')


    if (tocLinks) {
      // Listen for scroll events
      window.addEventListener('scroll', stopScrolling(tocLinks), false)
      
      return () => {
        window.removeEventListener('scroll', stopScrolling())
      } 
    }

	 
  }, [])

  const handleClick = () => {
    if(toc.mobileActive) {
      setState({ ...toc, [toc.expanded]: !toc.expanded })
    }
  }

  const stopScrolling = (tocLinks) => {
	  // Clear our timeout throughout the scroll
	  window.clearTimeout(isScrolling)

	  // Set a timeout to run after scrolling ends
	  isScrolling = setTimeout(function () {
	    // Run the callback
	    handleScroll(tocLinks)
    }, 66)
  }
  
  const handleScroll = (tocLinks) => {

	  let fromTop = window.scrollY
    let activeItemDistance = 10000

	  tocLinks.forEach((link, index) => {
	    let section = document.querySelector((link.hash || 'body'))

	    // You can add an offset number to a element to have the toc menu item activate earlier/later
	    let dataTocOffset = parseInt(section.getAttribute('data-toc-offset')) || 0

	    let computedMarginTop = parseInt(window.getComputedStyle(section).marginTop) || 0

	    let itemCalcPos = (section.offsetTop - computedMarginTop) + toc.scrollOffset - dataTocOffset

	    if (itemCalcPos <= fromTop) {
	    	if (link.getAttribute('data-toc-type') === 'sub') {
	    		let oldCurrent = document.querySelector(('.' + classes.tocSubItemActive))
		    	if (oldCurrent) {
		    		oldCurrent.classList.remove(classes.tocSubItemActive)
		    	}
	    		link.parentNode.classList.add(classes.tocSubItemActive)
	    	}
	    	else {
	    		let oldSubCurrent = document.querySelector(('.' + classes.tocSubItemActive))
		    	if (oldSubCurrent) {
		    		oldSubCurrent.classList.remove(classes.tocSubItemActive)
		    	}
		    	let oldCurrent = document.querySelector(('.' + classes.tocItemActive))
		    	if (oldCurrent) {
		    		oldCurrent.classList.remove(classes.tocItemActive)
		    	}
		      link.parentNode.classList.add(classes.tocItemActive)
	    	}
	    }
	  })
	}

  const createToc = () => {
	  let mainElem = document.getElementsByTagName('main')

	  if (toc.displayTitle === undefined && props.shouldDisplayTitle) {
	    let h1Elem = mainElem && mainElem[0].querySelector('h1')
	    toc.displayTitle = h1Elem && h1Elem.innerText
	  }

	  let allTocElems = mainElem && Array.from(mainElem[0].querySelectorAll('h2,h3'))

	  let excludeClassNames = (typeof props.excludeClassNames === 'string') ? props.excludeClassNames.split(',') : props.excludeClassNames
	  excludeClassNames = excludeClassNames || []
	  excludeClassNames.push(classes.displayTitle)

	  toc.items = elementArrayToTocArray(allTocElems, excludeClassNames, toc.scrollOffset)

	  setState({ ...toc, [toc.mobileActive]: (document.documentElement.clientWidth <= parseInt(classes._portraitTabletBreakpointDown)) })
	}

  return (
    <div className={classes.root}>
      <StickyWrapper bottomBoundary={props.bottomBoundary} innerZ="1000">
        <Paper className={classes.tocContainer}>
          <Hidden mdDown>
            {toc.displayTitle
              ? <h3 className={classes.displayTitle + ' state-page-nav-title'}>{toc.displayTitle}</h3>
              :	<div />
            }
          </Hidden>
          <Hidden mdUp>
            <button id='page-toc-toggle'
              is="aria-toggle"
              aria-controls="page-toc-nav"
              aria-expanded={toc.expanded}
              type="button"
              class={classes.tocButton}
              onClick={handleClick}>
              <div className="">
                <span className="">{toc.displayTitle || 'Table of contents'}</span>
                <span className={`${classes.tocButtonIcon} ${classes.tocButtonIconDown}`}>
                  <icon className="icon icon-chevron-sm-down"></icon>
                </span>
                <span className={`${classes.tocButtonIcon} ${classes.tocButtonIconUp}`}>
                  <icon className="icon icon-chevron-sm-up"></icon>
                </span>
              </div>
            </button>
          </Hidden>

          {toc.items &&
            <nav id="page-toc-nav" aria-hidden={(!toc.expanded && toc.mobileActive)}>
              <ul className={classes.toc}>
                <li className={classes.tocItem}><a className={classes.tocItemActive} href="#" onClick={handleClick}>Top</a></li>
                {
                  toc.items.map((tocItem, index) => {
                    return (
                      <li className={classes.tocItem} key={`${tocItem.id}-toc-item`}>
                        <a href={`#${tocItem.id}`} onClick={handleClick}>
                          { (tocItem.getAttribute('alt') || tocItem.innerText) }
                        </a>
                        {tocItem[TOC_SUB_ATTRB] &&
                          <ul className={classes.tocSub}>
                            {
                              tocItem[TOC_SUB_ATTRB].map((tocSubItem, subIndex) => {
                                return (
                                  <li className={classes.tocSubItem} key={`${subIndex}${tocSubItem.id}-toc-sub-item`}>
                                    <a data-toc-type="sub" href={`#${tocSubItem.id}`} onClick={handleClick}>
                                      { (tocSubItem.getAttribute('alt') || tocSubItem.innerText) }
                                    </a>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        }
                      </li>
                    )
                  })
                }
              </ul>
            </nav>
          }
        </Paper>
      </StickyWrapper>
    </div>
  )
}

export default PageToc


PageToc.propTypes = {
  /** Can pass a default title or it will be resolved by the H1 tag
			Can also use on heading tags to diaply a new label **/
  displayTitle: PropTypes.string,
  /** Can hide title if not needed **/
  shouldDisplayTitle: PropTypes.bool,
  /** This is the query string of the element for the toc to scroll within **/
  bottomBoundary: PropTypes.string,
  /** Adjust wehn the menu item becomes active when scrolling **/
  scrollOffset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** An array of all class names to not use in the toc **/
  excludeClassNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  /** Can use onm heading tags to change the hierarchy of the element **/
  displayAs: PropTypes.string,
}

PageToc.defaultProps = {
  bottomBoundary: 'main',
  shouldDisplayTitle: false,
}

const elemCalcPos = (elem, offset) => {
  // You can add an offset number to a element to have the toc menu item activate earlier/later
  let dataTocOffset = parseInt(elem.getAttribute('data-toc-offset')) || 0

  let computedMarginTop = parseInt(window.getComputedStyle(elem).marginTop) || 0

  return ((elem.offsetTop - computedMarginTop) + offset - dataTocOffset)
}

const elementArrayToTocArray = (elems, excludeClassNames, offset) => {
  const createTocItem = elem => {
    elem.id = elem.id || utils.formatToSlug(elem.innerText)
  }

  const addChild = (elem, parent) => {
    parent[TOC_SUB_ATTRB] = parent[TOC_SUB_ATTRB] || []
    createTocItem(elem)
    parent[TOC_SUB_ATTRB].push(elem)
  }

  let filteredElems = elems

  if (excludeClassNames) {
    excludeClassNames.forEach(className => {
      filteredElems = filteredElems.filter(elem => !elem.classList.contains(className))
    })
  }

  let toc

  if (filteredElems !== undefined && filteredElems.length > 0) {
    toc = []
    let currentTocItem = filteredElems && filteredElems[0]

    // Clear any previous info
    filteredElems.forEach(elem => {
      elem[TOC_SUB_ATTRB] = undefined
    })

    filteredElems.map((elem, index) => {
      let currentElemHierarchyIndex = (elem.getAttribute(TOC_DISPLAY_AS_ATTRB))
        ? parseInt(elem.getAttribute(TOC_DISPLAY_AS_ATTRB)) : parseInt(elem.tagName.slice(-1))

      if (currentElemHierarchyIndex > parseInt(currentTocItem.tagName.slice(-1))) {
        if (elem.getAttribute(TOC_EXCLUDE_ATTRB) !== 'true') {
          addChild(elem, currentTocItem)
        }
      }
      else {
        if (elem.getAttribute(TOC_EXCLUDE_ATTRB) !== 'true') {
          createTocItem(elem)
          currentTocItem = elem

          toc.push(elem)
        }
      }

      // make sure last element is able to be active, given the max scroll value vs pos of last element
      if (filteredElems.length - 1 === index) {
        let scrollMaxY = (document.documentElement.scrollHeight - document.documentElement.clientHeight)
        let maxElemPos = elemCalcPos(elem, offset)

        let elemOffset = maxElemPos - (scrollMaxY - 20)
        if (elemOffset > 0) {
          elem.setAttribute('data-toc-offset', elemOffset)
        }
      }
    })
  }

  return toc
}