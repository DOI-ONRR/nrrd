import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
  root: {
    with: '100%'
  }
}))
/**
 * Accordions are collapsible panels that provide users with the ability to expand
 * and collapse content as needed. They can simplify the interface by hiding
 * content until it is needed.
 *
 * With so much data, hiding some is essential. This is especially true for mobile
 * where some content shown by default in the desktop view becomes hidden.
 *
 * This component leverages the material-ui component [Expansion Panels](https://material-ui.com/components/expansion-panels/)
 */
const Accordion = props => {
  /**
    * This is a method
    * @public
    */
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  let { id, children, text } = props

  text = (typeof text === 'string') ? text.split(',') : text

  /**
   * This is a method
   *
   * @public
   */
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
