import React, { Fragment, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { StoreContext } from '../../../store'

import GlossaryIcon from '-!svg-react-loader!../../../img/svg/icon-question-circle.svg'
import { GlossaryContext } from '../../../stores'

// GlossaryTerm Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  glossaryTerm: {
    borderBottom: `1px dotted ${ theme.palette.common.black }`,
    cursor: 'pointer',
    '&:hover': {
      borderBottom: `1px solid ${ theme.palette.common.black }`,
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
  const { dispatch } = useContext(StoreContext)

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
        onClick={() => dispatch({ type: 'GLOSSARY_TERM_SELECTED', payload: { glossaryTerm: getTerm(), glossaryOpen: true } })}>
        {children} <GlossaryIcon className={classes.iconQuestion} />
      </span>
    </Fragment>
  )
}

export default GlossaryTerm
