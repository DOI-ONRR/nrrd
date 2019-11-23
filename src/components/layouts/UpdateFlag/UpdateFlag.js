import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
// import styles from './UpdateFlag.module.scss'

const useStyles = makeStyles(theme => ({
  root: {}
}))

const UpdateFlag = ({ date }) => {
  const classes = useStyles()
  return (
    <span className={classes.root}>Updated {date}</span>
  )
}

UpdateFlag.propTypes = {
	 /** The date to display */
  date: PropTypes.string,
}

UpdateFlag.defaultProps = {
  date: 'recently',
}

export default UpdateFlag
