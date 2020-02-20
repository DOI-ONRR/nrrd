import React from 'react'
import { Breadcrumbs } from '@material-ui/core'
import { Link } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  breadcrumb: {
    color: theme.palette.blue.mid,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

const Breadcrumb = ({ to, children, ...rest }) => {
  const classes = useStyles()
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link to={to} className={classes.breadcrumb} {...rest}>
        {children}
      </Link>
      <React.Fragment>{' '}</React.Fragment>
    </Breadcrumbs>
  )
}

export default Breadcrumb
