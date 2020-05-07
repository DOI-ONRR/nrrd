import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

const LINE_DASHES = ['1,0', '5,5', '10,10', '20,10,5,5,5,10']

const useStyles = makeStyles(theme => ({
  chipLabelLine: {
    display: 'block',
    height: 6,
  },
}))

const ChipLabelSVG = props => {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" height="100px">
      <line className="line" x1="0" x2="175" y1="0" y2="0" stroke="black" strokeWidth="15" strokeDasharray={props.strokeDasharray} />
    </svg>
  )
}

const ChipLabel = props => {
  const classes = useStyles()
  const { labelIndex, label } = props

  return (
    <>
      <Box component="span">{label}</Box>
      <Box component="span" className={classes.chipLabelLine}>
        <ChipLabelSVG labelIndex={labelIndex} strokeDasharray={LINE_DASHES[labelIndex]} />
      </Box>
    </>
  )
}

export default ChipLabel
