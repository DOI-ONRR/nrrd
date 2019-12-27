import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

// import styles from './Accordion.module.scss'

// import IconPlus from '-!svg-react-loader!../../../img/icons/icon-circled-plus.svg'
// import IconMinus from '-!svg-react-loader!../../../img/icons/icon-circled-minus.svg'

const useStyles = makeStyles(theme => ({
  root: {
    with: `100%`
  }
}))

const Accordion = props => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  let { id, children, text } = props

  text = (typeof text === 'string') ? text.split(',') : text

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <div id={id} className={classes.root}>
      <ExpansionPanel expanded={expanded === `panel${ id }`} onChange={handleChange(`panel${ id }`)}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${ id }bh-content`}
          id={`panel${ id }bh-header`}
        >
          <Typography className={classes.heading}>{expanded ? text[1] : text[0]}</Typography>
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

// class Accordion extends React.Component {
//   constructor (props) {
//     super(props)

//     const expandableId = `${ props.id }-expandable-content`
//     const { expanded } = props
//     this.state = {
//       expandableId,
//       expanded,
//     }
//   }

//   toggle () {
//     const { expanded } = this.state
//     this.setState({
//       expanded: !expanded,
//     })
//   }

//   render () {
//     let { id, children, text } = this.props
//     const { expandableId, expanded } = this.state
//     const toggle = () => this.toggle()

//     text = (typeof text === 'string') ? text.split(',') : text

//     return (
//       <div id={id} className={styles.root}>
//         <div class={styles.toggle} is="aria-toggle"
//           aria-controls={expandableId}
//           aria-expanded={expanded}
//           type="button"
//           onClick={toggle}>

//           <span className={styles.plus} >
//             <IconPlus />
//             <span>{text[0]}</span>
//           </span>
//           <span className={styles.minus} >
//             <IconMinus />
//             <span>{text[1]}</span>
//           </span>
//         </div>
//         <div id={expandableId} aria-hidden={!expanded} className={styles.content}>
//           { children }
//         </div>
//       </div>
//     )
//   }
// };

Accordion.propTypes = {
  /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
  /** The content to show when this accordion is expanded. */
  children: PropTypes.node.isRequired,
  /** Initial state of the accordion */
  expanded: PropTypes.bool,
  /** Text to display next to the icon. Collapsed text first then Expanded text */
  text: PropTypes.array,
}

Accordion.defaultProps = {
  expanded: false,
}

export default Accordion
