import React, { Fragment, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { GlossaryContext } from '../../../glossaryContext'

import GlossaryIcon from '-!svg-react-loader!../../../img/svg/icon-question-circle.svg'

// GlossaryTerm Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  glossaryTerm: {
    borderBottom: `1px dotted ${theme.palette.common.black}`,
    cursor: 'pointer',
    '&:hover': {
      borderBottom: `1px solid ${theme.palette.common.black}`,
    }
  },
  iconQuestion: {
    width: '16px',
    height: '16px',
    marginLeft: theme.spacing(0.2)
  }
}))

const GlossaryTerm = ({ termKey, children }) => {
  
  const classes = useStyles()
  const { dispatch } = useContext(GlossaryContext)

  const getTerm = () => {
    if (termKey) {
      return termKey
    }
    else if (Array.isArray(children)) {
      return children[0]
    }
    return children
  }

  return (
    <Fragment>
      <span className={classes.glossaryTerm} title="Click to define" tabIndex="0" 
      onClick={() => dispatch({ type: 'GLOSSARY_TERM_SELECTED', glossaryTerm: getTerm(), glossaryOpen: true })}>
        {children} <GlossaryIcon className={classes.iconQuestion} />
      </span>
    </Fragment>
  )
}

export default GlossaryTerm
