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
  const theme = useTheme()
  const classes = useStyles(theme)

  console.log(theme.palette.info.dark)

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
    code: '<DidYouKnowCard>Content for did you know</DidYouKnowCard>'
  },
  {
    title: 'Change title',
    code: '<DidYouKnowCard title={"New Title Used"}>Content for did you know</DidYouKnowCard>',
    notes: 'You can specify a property called title to change the title'
  },
  {
    title: 'Collapsible Content',
    code: '<DidYouKnowCard>Content for did you know<CollapsibleContent>Colapsible content area</CollapsibleContent></DidYouKnowCard>',
    notes: 'You can use any content including other components'
  },
  {
    title: 'Content sized to width of parent',
    code: '<Box width="200px"><DidYouKnowCard>Content for did you know<CollapsibleContent>Colapsible content area</CollapsibleContent></DidYouKnowCard></Box>',
    notes: 'By using the Box component you can apply styling such as width.'
  }
]
