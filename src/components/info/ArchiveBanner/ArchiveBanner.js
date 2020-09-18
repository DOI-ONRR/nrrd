import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'

import GlossaryTerm from '../../GlossaryTerm/GlossaryTerm'

import { IconArchiveImg } from '../../images'

// TODO: update styles, should be able to utilize main theme
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '--grayPale',
    borderLeft: '10px solid gray',
    padding: '1.125em .5em .5em .5em',
    marginBottom: '2rem',
  },
  content: {
    margin: '0 0 1rem 0',
    color: '--blackLight',
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
