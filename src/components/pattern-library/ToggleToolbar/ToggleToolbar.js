import React from 'react'
import PropTypes from 'prop-types'

import { navigate } from 'gatsby'
import slugify from 'slugify'

import { MDXRenderer } from 'gatsby-plugin-mdx'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

const useStyles = makeStyles(theme => ({
  pathToFile: {
    color: theme.palette.primary.main
  },
  rootToggleButtonGroup: {
    borderRadius: '5px',
    marginBottom: '20px'
  },
  groupedToggleButtonGroup: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
  },
  rootToggleButton: {
    height: '100%',
    fontSize: theme.typography.h2.fontSize,
  },
  selectedToggleButton: {
  }
}))

const ToggleToolbar = ({ buttons, ...rest }) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const [section] = React.useState(slugify(window?.location.pathname))

  return (
    <Grid container direction="row" justify="center" >
      <ToggleButtonGroup
        classes={ { root: classes.rootToggleButtonGroup, grouped: classes.groupedToggleButtonGroup } }
        value={section}
        aria-label="button group for switching between sections">
        {
          buttons.map(button => {
            const label = Object.keys(button)[0]
            const relativeUrl = button[label]
            return (
              <ToggleButton
                key={label}
                value={slugify(relativeUrl)}
                onClick={() => navigate(relativeUrl)}
                classes={ { root: classes.rootToggleButton, selected: classes.selectedToggleButton }}>
                {label}
              </ToggleButton>
            )
          })
        }
      </ToggleButtonGroup>
    </Grid>
  )
}

export default ToggleToolbar
