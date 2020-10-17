import React, { useState } from 'react'
import PropTypes from 'prop-types'
import path from 'path'

import { MDXRenderer } from 'gatsby-plugin-mdx'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'

import PropsTable from '../components/pattern-library/PropsTable'
import CodeBlock from '../components/pattern-library/CodeBlock'
import * as ALL_DEMOS from '../../.cache/components-all'

export const useStyles = makeStyles(theme => ({
  pathToFile: {
    color: theme.palette.primary.main
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
  const classes = useStyles()
  const demos = ALL_DEMOS[`${ item.displayName }Demos`]
  console.log(demos)
  return (
    <>
      <Typography variant="h2">Usage</Typography>
      <MDXRenderer>{item.description.childMdx.body}</MDXRenderer>
      {demos ?
        demos.map((demo, i) => <CodeBlock key={`code-block-${ i }`} live={true}>{demo.code}</CodeBlock>)
        :
        <div>No demos created for this component.</div>
      }
    </>
  )
}

const PatternLibraryComponentPage = React.memo(({ pageContext: { componentMetadata } }) => {
  return (
    <div>
      <Typography variant="h2" id={componentMetadata.displayName}>{componentMetadata.displayName}</Typography>
      <DesignSection item={{ ...componentMetadata }} />
      {/* <DevelopSection item={{ ...componentMetadata }} /> */}
    </div>
  )
})

export default PatternLibraryComponentPage
