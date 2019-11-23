import React from 'react'
// import Link from '../../utils/temp-link'
import { Link } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'

// import GlossaryTerm from '../../utils/glossary-term.js'
import GlossaryTerm from '../../utils/GlossaryTerm'

// import styles from './ArchiveBanner.module.scss'
import DataArchiveIcon from '-!svg-react-loader!../../../img/svg/icon-archive.svg'

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
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <p className={classes.content}>
        <DataArchiveIcon/> This content was created as part of <GlossaryTerm termKey="EITI Standard">USEITI</GlossaryTerm> and is no longer being updated
        . <Link to="/archive">Learn more about USEITI.</Link>
      </p>
    </div>
  )
}

export default ArchiveBanner
