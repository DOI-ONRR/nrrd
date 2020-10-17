import React from 'react'
import {
  Card,
  Box,
  Typography,
  useTheme,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  title: {
    color: 'white',
    marginTop: '0px',
  },
}))

/**
 * The DidYouKnowCard is used in the about section of the website. It is a simple card that can display
 * content. Other components can be added in the content such as a collapsible component that can add more content.
 *
 */
const DidYouKnowCard = ({ children, title = 'Did you know?' }) => {
  console.log(children)
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Box>
      <Card variant='outlined'>
        {title &&
            <Box p={2} bgcolor={'info.dark'}><Typography variant='h4' className={classes.title}>{title}</Typography></Box>
        }
        <Box p={2}>
          { children }
        </Box>
      </Card>
    </Box>
  )
}

export default DidYouKnowCard

export const DidYouKnowCardDemos = [
  {
    title: 'Content only',
    code: '<DidYouKnowCard>Content for did you knowe</DidYouKnowCard>'
  }
]
