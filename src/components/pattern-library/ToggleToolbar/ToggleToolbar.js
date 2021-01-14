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
  let [section] = React.useState()
  const url = (typeof window !== 'undefined') && new URL(window.location.href)
  if (url && url.searchParams.get('type')) {
    section = url.searchParams.get('type')
  }
  else if (url) {
    if (url.pathname.includes('color')) {
      section = 'Color'
    }
    else if (url.pathname.includes('typography')) {
      section = 'Typography'
    }
    else if (url.pathname.includes('iconography')) {
      section = 'Iconography'
    }
    else {
      section = 'Guidelines'
    }
  }

  const handleNavigate = url => {
    navigate(url, { replace: true })
  }

  return (
    <Box mt={2}>
      <Grid container direction="row" justify="center">
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
                  value={label}
                  onClick={() => handleNavigate(relativeUrl)}
                  classes={ { root: classes.rootToggleButton, selected: classes.selectedToggleButton }}>
                  {label}
                </ToggleButton>
              )
            })
          }
        </ToggleButtonGroup>
      </Grid>
    </Box>
  )
}

export default ToggleToolbar
