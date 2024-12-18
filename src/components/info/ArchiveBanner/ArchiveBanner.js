import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'

import GlossaryTerm from '../../GlossaryTerm/GlossaryTerm'

import { IconArchiveImg } from '../../images'

// TODO: update styles, should be able to utilize main theme
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey['100'],
    borderLeft: `10px solid ${ theme.palette.info.dark }`,
    padding: '1.125em .5em .5em .5em',
    marginBottom: '2rem',
  },
  content: {
    margin: '0 0 1rem 0',
    color: theme.palette.grey['900'],
    fontSize: '0.8125rem',
    fontWeight: '300',
    lineHeight: '1.1875rem',
    marginBottom: '0.625rem',
    padding: '0px',
    '> svg': {
      verticalAlign: 'bottom',
    }
  }
}))
/**
 * This banner is used to mark content on our site as archived as part of United
 * States Extracted Industries Transparency Initiative (USEITI).
 */
const ArchiveBanner = () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <div className={classes.root}>
      <p className={classes.content}>
        <IconArchiveImg /> This content was created as part of <GlossaryTerm>USEITI</GlossaryTerm> and is no longer being updated.
      </p>
    </div>
  )
}

export default ArchiveBanner

ArchiveBanner.Preview = {
  group: 'Informational',
  demos: [
    {
      title: 'Example',
      code: '<ArchiveBanner />',
    }
  ]
}
