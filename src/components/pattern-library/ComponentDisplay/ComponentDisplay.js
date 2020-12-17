import React from 'react'

import { useStaticQuery, graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { ThemeProvider } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import PatternLibraryCard from '../PatternLibraryCard'
import CodeBlock from '../CodeBlock'
import PropsTable from '../PropsTable'
import theme from '../../../js/mui/theme'
import * as ALL_COMPONENTS from '../../../../.cache/components'
import * as ALL_DEMOS from '../../../../.cache/components-all'

const ComponentDisplay = ({ children }) => {
  const results = useStaticQuery(graphql`
    query {
      allComponentMetadata(sort: {fields: displayName, order: ASC}) {
        nodes {
          displayName
          description {
            childMdx {
              body
            }
          }
          childrenComponentProp {
            name
            docblock
            required
            parentType {
              name
            }
            type {
              value
            }
            defaultValue {
              value
              computed
            }
          }
          parent {
            ... on File {
              relativePath
              absolutePath
            }
          }
        }
      }
    }
  `)
  const url = (typeof window !== 'undefined') && new URL(window.location.href)
  const type = url.searchParams && url.searchParams.get('type')

  const components = results.allComponentMetadata.nodes.filter(item =>
    item.parent.relativePath.includes(`${ type }`) &&
    !item.parent.relativePath.includes('DataTable/Custom'))

  const content = (Array.isArray(children)) ? children : [children]

  const getNotes = key => content.filter(child => child?.props.noteKeys?.includes(key))

  const ComponentContextDisplay = ({ demos }) => {
    return (
      <>
        {demos.map((demo, i) => <CodeBlock key={`code-block-${ i }`} live={true} title={demo.title} notes={demo.notes}>{demo.code}</CodeBlock>)}
      </>
    )
  }

  return (
    <Grid container direction="row" justify="flex-start" alignItems="stretch" spacing={2}>
      {
        components.map((item, i) => {
          const demos = ALL_DEMOS[`${ item.displayName }Demos`]
          console.log(ALL_COMPONENTS)
          if (!demos) {
            return <></>
          }
          const preview = demos && demos[0]

          // const notes = getNotes(key)
          return (
            <Grid item key={i} xs={12} sm={6}>
              <PatternLibraryCard
                title={`${ item.displayName }`}
                notes={(item.childrenComponentProp.length > 0) && <PropsTable componentProps={item.childrenComponentProp} />}
                contexts={demos && <ComponentContextDisplay demos={demos} />}>
                <Box p={2}>
                  {preview
                    ? <ThemeProvider theme={theme}><CodeBlock key={`code-block-${ i }`} render={true}>{preview.code}</CodeBlock></ThemeProvider>
                    : <Box>No preview available</Box>
                  }
                  <Box m={2}><Divider /></Box>
                  <MDXRenderer>{item.description.childMdx.body}</MDXRenderer>

                </Box>
              </PatternLibraryCard>
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default ComponentDisplay
