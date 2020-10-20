import React, { useState } from 'react'
import PropTypes from 'prop-types'
import path from 'path'

import { MDXRenderer } from 'gatsby-plugin-mdx'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import PropsTable from '../components/pattern-library/PropsTable'
import CodeBlock from '../components/pattern-library/CodeBlock'
import * as ALL_DEMOS from '../../.cache/components-all'

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

const DevelopSection = ({ item }) => {
  const classes = useStyles()
  return (
    <>
      <Typography variant="body1">
            Source: <span className={classes.pathToFile}>{item.parent.relativePath}</span>
      </Typography>
      <MDXRenderer>{item.description.childMdx.body}</MDXRenderer>
      <PropsTable componentProps={item.childrenComponentProp || []} />
    </>
  )
}

const DesignSection = ({ item }) => {
  const demos = ALL_DEMOS[`${ item.displayName }Demos`]

  return (
    <>
      <MDXRenderer>{item.description.childMdx.body}</MDXRenderer>
      <Divider />
      <Typography variant="h2">Demos</Typography>
      {demos
        ? demos.map((demo, i) => <CodeBlock key={`code-block-${ i }`} live={true} title={demo.title} notes={demo.notes}>{demo.code}</CodeBlock>)
        : <div>No demos created for this component.</div>
      }
    </>
  )
}

const PatternLibraryComponentPage = React.memo(({ pageContext: { componentMetadata } }) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const [section, setSection] = React.useState('usage')
  return (
    <Box mb={5} mt={5} >
      <Typography variant="h1" id={componentMetadata.displayName}>{componentMetadata.displayName}</Typography>
      <ToggleButtonGroup
        classes={ { root: classes.rootToggleButtonGroup, grouped: classes.groupedToggleButtonGroup } }
        value={section}
        aria-label="button group for switching between component usage and developer notes">
        <ToggleButton value='usage' onClick={() => setSection('usage')} classes={ { root: classes.rootToggleButton, selected: classes.selectedToggleButton }}>
          Usage
        </ToggleButton>
        <ToggleButton value='api' onClick={() => setSection('api')} classes={ { root: classes.rootToggleButton, selected: classes.selectedToggleButton }}>
          API
        </ToggleButton>
      </ToggleButtonGroup>
      {section === 'usage' &&
        <DesignSection item={{ ...componentMetadata }} />
      }
      {section === 'api' &&
        <DevelopSection item={{ ...componentMetadata }} />
      }
    </Box>
  )
})

export default PatternLibraryComponentPage
