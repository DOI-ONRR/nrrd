/* eslint-disable no-tabs */
import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'

import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

// import styles from './DidYouKnow.module.scss'

// import MoreIcon from '-!svg-react-loader!../../../img/icons/icon-plus.svg'
// import LessIcon from '-!svg-react-loader!../../../img/icons/icon-min.svg'
// import BullhornIcon from '-!svg-react-loader!../../../img/svg/icon-bullhorn.svg'

const useStyles = makeStyles(theme => ({
  root: {}
}))

const DidYouKnow = props => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const { id, children } = props

  const headerColorStyle = props.color === 'red' ? classes.headingRed : classes.headingRed

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <div id={id} className={classes.root}>
      <Typography variant="h2" id="did-you-know-label" className={`${ headerColorStyle } ${ classes.heading }` }>
        Did you know?
      </Typography>
      <Typography variant="body2" className={classes.content}>
        {props.intro}
      </Typography>
      <ExpansionPanel expanded={expanded === `panel${ id }`} onChange={handleChange(`panel${ id }`)}>
	          <ExpansionPanelSummary
          expandIcon={ expanded ? `Less ${ <RemoveIcon /> }` : `More ${ <AddIcon /> }` }
          aria-controls={`panel${ id }bh-content`}
          id={`panel${ id }bh-header`}
        >
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.content}>
          <Typography>
            {children}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}

// class DidYouKnow extends React.Component {
// 	state = {
// 	  expanded: false,
// 	}

// 	handleClick () {
// 	  this.setState({ expanded: !this.state.expanded })
// 	}

// 	render () {
// 	  let headingColorStyle = (this.props.color === 'red') ? styles.headingRed : styles.headingBlue
// 	  return (
// 	    <div class={styles.root}
// 	      is="aria-toggle"
// 	      aria-expanded={this.state.expanded} >
// 	      <h2 id="did-you-know-label" className={headingColorStyle + ' ' + styles.heading} >Did you know?</h2>
// 	      <p className={styles.content} >
// 	        {this.props.intro}
// 	      </p>
// 	      <div
// 	        id="did-you-know-expanded"
// 	        className={styles.contentExpanded}
// 	        aria-labelledby="did-you-know-label"
// 	        aria-hidden={!this.state.expanded}>
// 	        {this.props.children}
// 	      </div>
// 	      <div className={styles.toggleContainer}>
// 	        <button id='did-you-know-toggle'
// 	          is="aria-toggle"
// 	          aria-controls="did-you-know-expanded"
// 	          aria-expanded={this.state.expanded}
// 	          type="button"
// 	          class={styles.toggleButton}
// 	          onClick={this.handleClick.bind(this)}>
// 	          {this.state.expanded
// 	            ? <span>less <LessIcon /></span>
// 	            :											<span>more <MoreIcon /></span>
// 	          }
// 	        </button>
// 	      </div>
// 	    </div>
// 	  )
// 	}
// }

DidYouKnow.propTypes = {
  /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
  /** The color of the heading. */
  color: PropTypes.string,
  /* Intro text that is always shown */
  intro: PropTypes.string,
}

DidYouKnow.defaultProps = {
  color: 'red',
}

export default DidYouKnow
