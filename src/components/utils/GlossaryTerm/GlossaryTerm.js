import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import GlossaryIcon from '-!svg-react-loader!../../../img/svg/icon-question-circle.svg'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  term: {},
  iconQuestion: {
    width: '16px',
    height: '16px',
    marginLeft: theme.spacing(0.2)
  }
}))

const GlossaryTerm = ({ termKey, termkey, children, glossaryTermSelected, glossaryTerm }) => {
  const classes = useStyles()

  const getTerm = () => {
    if (termKey) {
      return termKey
    }
    else if (termkey) {
      return termkey
    }
    else if (Array.isArray(children)) {
      return children[0]
    }
    return children
  }

  return (
    <Fragment>
      <span className={classes.term}>A Glossary Term</span><GlossaryIcon className={classes.iconQuestion} />
      {/* <span className={classes.term} title="Click to define" tabIndex="0"
      onClick={() => glossaryTermSelected(getTerm())}>
      {children}<GlossaryIcon className={classes.iconQuestion} />
      </span> */}
    </Fragment>
  )
}

export default GlossaryTerm
