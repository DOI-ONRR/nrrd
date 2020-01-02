import React from 'react'
import PropTypes from 'prop-types'
import Hidden from '@material-ui/core/Hidden'
// import MediaQuery from 'react-responsive'

import { makeStyles } from '@material-ui/core/styles'

// import styles from './ProcessGroup.module.scss'

const useStyles = makeStyles(theme => ({
	root: {}
}))

const ProcessGroup = props => {
	const classes = useStyles()
	return (
		<div className={classes.root}>
        {props.children} 		  
		</div>
	)
}

export default ProcessGroup

// class ProcessGroup extends React.Component {
//   render () {
//     return (
//       <div className={classes.root}>
//         {this.props.children}
// 		  </div>
//     )
//   }
// }


// TODO: convert class to functional component
export class ProcessStep extends React.Component {
	state = {
	  expanded: (typeof this.props.expanded === 'string') ? (this.props.expanded === 'true') : this.props.expanded,
	}

	handleClick () {
	  this.setState({ expanded: !this.state.expanded })
	}

	render () {
	  let stepId = this.props.stepId || this.props.stepid
		let stepName = this.props.stepName || this.props.stepname
		const classes = useStyles()
	  return (
	    <div className={classes.processStepContainer}>
	      {stepId &&
					<div className={classes.processStepId}>{stepId}</div>
	      }
	      {stepName &&
					<span className={classes.processStepName}>{stepName}</span>
	      }
	      <Hidden mdDown maxWidth={classes._portraitTabletBreakpointDown}>
	        <button is="aria-toggle"
	          aria-controls="process-step-content"
	          aria-expanded={this.state.expanded}
	          type="button"
	          class={classes.toggleButton}
	          onClick={this.handleClick.bind(this)}>
	          {this.state.expanded
	            ? <icon className="icon icon-chevron-sm-down"></icon>
	            : <icon className="icon icon-chevron-sm-up"></icon>
	          }
	        </button>
	      </Hidden>
	      <Hidden mdDown maxWidth={classes._portraitTabletBreakpointDown}>
	        <div id="process-step-content" className={classes.processStepContent} aria-hidden={!this.state.expanded}>
	          {this.props.children}
	        </div>
	      </Hidden>
	      <Hidden mdUp minDeviceWidth={classes._portraitTabletBreakpointUp}>
	        <div id="process-step-content" className={classes.processStepContent}>
	          {this.props.children}
	        </div>
	      </Hidden>
	    </div>
	  )
	}
}

ProcessStep.propTypes = {
  stepId: PropTypes.string,
  stepName: PropTypes.string,
  expanded: PropTypes.oneOfType([
						  PropTypes.string,
						  PropTypes.bool
  ])
}

ProcessStep.defaultProps = {
  expanded: false,
}
