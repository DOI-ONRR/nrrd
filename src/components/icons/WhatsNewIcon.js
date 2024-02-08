import React from 'react'
import NewReleasesIcon from '@material-ui/icons/NewReleases'
import makeStyles from '@material-ui/styles/makeStyles'

const iconStyles = makeStyles(() => ({
  root: {
    verticalAlign: 'text-top'
  }
}))

const WhatsNewIcon = () => {
  const classes = iconStyles()
  return (
    <NewReleasesIcon classes={classes} />
  )
}

export default WhatsNewIcon
