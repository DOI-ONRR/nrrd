import React from 'react'

import { useStaticQuery, graphql } from 'gatsby'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { ThemeProvider } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import PatternLibraryCard from '../PatternLibraryCard'
import CodeBlock from '../CodeBlock'
import PropsTable from '../PropsTable'
import ToggleToolbar from '../ToggleToolbar'
import theme from '../../../js/mui/theme'
import * as ALL_COMPONENTS from '../../../../.cache/components'

const ComponentDisplay = ({ children }) => {
  const results = useStaticQuery(graphql`
    query {
      allComponentMetadata(sort: {fields: displayName, order: ASC}) {
        nodes {
          displayName
          description {
            text
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

  const groups = [...(new Set(Object.keys(ALL_COMPONENTS).map(c => ALL_COMPONENTS[c]?.Preview?.group).filter(g => g !== undefined)))]
  const url = (typeof window !== 'undefined') && new URL(window.location.href)
  const type = url?.searchParams?.get('type') || groups[0]
  const componentsInGroup = Object.keys(ALL_COMPONENTS).filter(c =>
    (ALL_COMPONENTS[c]?.Preview?.group === type && ALL_COMPONENTS[c]?.name !== undefined) ||
    (ALL_COMPONENTS[c]?.type?.Preview?.group === type && ALL_COMPONENTS[c]?.type?.name !== undefined))

  const components = results.allComponentMetadata.nodes.filter(item =>
    componentsInGroup.includes(item.displayName) &&
    !item.parent.relativePath.includes('DataTable/Custom'))

  // not used   const content = (Array.isArray(children)) ? children : [children]

  // const getNotes = key => content.filter(child => child?.props.noteKeys?.includes(key))

  const ComponentContextDisplay = ({ demos }) => {
    return (
      <>
        {demos.map((demo, i) => <CodeBlock key={`code-block-${ i }`} live={true} title={demo.title} notes={demo.notes}>{demo.code}</CodeBlock>)}
      </>
    )
  }

  return (
    <>
      {(typeof window !== 'undefined') &&
      <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={2}>
        <Grid item xs={12}>
          <ToggleToolbar buttons={groups.map(g => ({ [g]: `/patterns/components/?type=${ g }` })) } sectionSelected={type} />
        </Grid>
        {
          components.map((item, i) => {
            const demos = ALL_COMPONENTS[`${ item.displayName }`]?.Preview?.demos || ALL_COMPONENTS[`${ item.displayName }`]?.type?.Preview?.demos
            if (!demos) {
              return undefined
            }
            const preview = demos && demos[0]
            console.log(preview)
            // const notes = getNotes(key)
            return (
              <Grid id={item.displayName} item key={i} xs={12}>
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
                    {item.description.text}
                  </Box>
                </PatternLibraryCard>
              </Grid>
            )
          })
        }
      </Grid>
      }
    </>
  )
}

export default ComponentDisplay
