import React from 'react'
import {
  CardActions,
  Box,
  useTheme,
  makeStyles,
  IconButton,
  Collapse
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}))

/**
 * CollapsibleContent
 *
 */

const CollapsibleContent = ({ children }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box p={2} pt={0} borderTop={1} borderColor={'info.main'}>
          {children}
        </Box>
      </Collapse>
    </>
  )
}

export default CollapsibleContent

export const CollapsibleContentDemos = [
  {
    title: 'Content Only',
    notes: 'These are some notes',
    code: '<CollapsibleContent>Content area</CollapsibleContent>',
  }
]
