import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { mdx } from '@mdx-js/react'
import * as CustomComponents from '../../../../.cache/components'
import * as MaterialUI from '@material-ui/core'
import { makeStyles, useTheme, ThemeProvider } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

// Using the theme from the main app for the Live Preview
import theme from '../../../js/mui/theme'

const useStyles = makeStyles(theme => ({
  container: {
    color: 'black',
    marginTop: theme.spacing(5)
  },
  livePreview: {
    border: '1px solid black',
    borderRadius: '4px',
    padding: theme.spacing(2)
  },
  notes: {
    padding: theme.spacing(2)
  }
}))

const CodeBlock = ({ children, className, live, render, title, notes }) => {
  const patternLibraryTheme = useTheme()
  const classes = useStyles(patternLibraryTheme)
  const language = className && className.replace(/language-/, '')

  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  if (live) {
    return (
      <>
        <MaterialUI.Typography variant="h3">{title}</MaterialUI.Typography>
        <MaterialUI.Grid container direction="row" justify="center" alignItems="stretch" className={classes.container}>
          <MaterialUI.Grid xs={9}>
            <LiveProvider
              code={children}
              transformCode={code => '/** @jsx mdx */' + code}
              scope={{ mdx, ...CustomComponents, ...MaterialUI }}
            >
              <MaterialUI.Grid container>
                <MaterialUI.Grid xs={12} className={classes.livePreview}>
                  <ThemeProvider theme={theme}>
                    <LivePreview />
                  </ThemeProvider>
                </MaterialUI.Grid>
                <MaterialUI.Grid container direction="row" justify="flex-end">
                  <ToggleButtonGroup>
                    <ToggleButton onClick={handleExpandClick}>
                      Code
                    </ToggleButton>
                  </ToggleButtonGroup>
                </MaterialUI.Grid>
                <MaterialUI.Grid xs={12}>
                  <MaterialUI.Collapse in={expanded} timeout="auto" unmountOnExit>
                    <LiveEditor style={{ border: '2px solid #9691ae', backgroundColor: '#130749' }} />
                    <LiveError />
                  </MaterialUI.Collapse>
                </MaterialUI.Grid>
              </MaterialUI.Grid>
            </LiveProvider>
          </MaterialUI.Grid>
          <MaterialUI.Grid xs={3} className={classes.notes}>
            <MaterialUI.Typography variant="body">{notes}</MaterialUI.Typography>
          </MaterialUI.Grid>
        </MaterialUI.Grid>
      </>
    )
  }
  if (render) {
    return (
      <div style={{ marginTop: '40px', backgroundColor: 'red' }}>
        <LiveProvider
          code={children}
          transformCode={code => '/** @jsx mdx */' + code}
          scope={{ mdx, ...CustomComponents }}
        >
          <LivePreview />
          <LiveError />
        </LiveProvider>
      </div>
    )
  }
  return (
    <Highlight {...defaultProps} code={children.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
