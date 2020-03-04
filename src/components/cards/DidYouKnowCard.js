import React from 'react'
import {
  Card,
  CardActions,
  Box,
  Typography,
  useTheme,
  makeStyles,
  IconButton,
  Collapse
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  title: {
    color: 'white',
    marginTop: '0px',
  },
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

export default ({ children, title = 'Did you know?' }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const mainContent = children.filter(child => child.props.mdxType !== 'CollapsibleContent')
  const moreContent = children.filter(child => child.props.mdxType === 'CollapsibleContent')

  return (
    <Box>
      <Card variant='outlined'>
        {title &&
            <Box p={2} bgcolor={'info.dark'}><Typography variant='h4' className={classes.title}>{title}</Typography></Box>
        }
        <Box p={2}>
          { mainContent }
        </Box>
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
            {moreContent}
          </Box>
        </Collapse>
      </Card>
    </Box>
  )
}
