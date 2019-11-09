import React, { Fragment } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import GlossaryIcon from '-!svg-react-loader!../../../img/svg/icon-question-circle.svg'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  iconQuestion: {
    width: '16px',
    height: '16px',
    marginLeft: theme.spacing(0.2)
  }
}))

const GlossaryTerm = ({ termKey }) => {
  const classes = useStyles()

  return (
    <Fragment>
      {termKey} <GlossaryIcon className={classes.iconQuestion} />
    </Fragment>
  )
}

export default GlossaryTerm
