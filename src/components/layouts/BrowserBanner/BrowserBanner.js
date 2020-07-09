import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    border: '1px solid _green',
    margin: '0 0 1rem 0',
    lineHeight: '1.1875rem',
    marginBottom: '0.8rem',
    padding: '0.8em 1.875em',
    textAlign: 'center',
  }
}))

const BrowserBanner = () => {
  const classes = useStyles()

  return (
    <section className={classes.root}>
      <span>
        <p>We try to make this website work for everyone, but some older web browsers don’t display every feature on this site.</p>

        <p>If it looks like something isn't working as it should, try using a different browser, such as Chrome, Edge, or Firefox.</p>
      </span>
    </section>
  )
}

export default BrowserBanner
