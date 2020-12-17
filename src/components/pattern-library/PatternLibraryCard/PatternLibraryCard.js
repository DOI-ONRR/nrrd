import React from 'react'
import PropTypes from 'prop-types'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(theme => ({
  cardHeaderRoot: {
    color: '#fff',
    backgroundColor: '#455a6b',
    '& span': {
      margin: 0,
      textAlign: 'center'
    }
  },
  cardButtonRoot: {
    textTransform: 'capitalize',
    width: '-webkit-fill-available'
  },
  cardActionsRoot: {
    height: '60px'
  },
  cardContentRoot: {
    padding: '0px'
  }
}))

const PatternLibraryCard = ({ title, notes, contexts, children }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [expandedNotes, setExpandedNotes] = React.useState(false)
  const handleExpandNotesClick = () => {
    setExpandedNotes(!expandedNotes)
    setExpandedContext(false)
  }
  const [expandedContexts, setExpandedContext] = React.useState(false)
  const handleExpandContextClick = () => {
    setExpandedContext(!expandedContexts)
    setExpandedNotes(false)
  }

  return (
    <Card>
      <CardHeader
        title={title}
        classes={{
          root: classes.cardHeaderRoot
        }}
      />
      <CardContent
        classes={{
          root: classes.cardContentRoot
        }}
      >
        {children}
      </CardContent>
      <CardActions
        classes={{
          root: classes.cardActionsRoot
        }}
      >
        <Button
          classes={{
            root: classes.cardButtonRoot
          }}
          onClick={handleExpandNotesClick}
          disabled={!notes}
          aria-expanded={expandedNotes}
          aria-label="show notes"
        >
          Notes
        </Button>
        <Divider orientation={'vertical'} />
        <Button
          classes={{
            root: classes.cardButtonRoot
          }}
          onClick={handleExpandContextClick}
          disabled={!contexts}
          aria-expanded={expandedContexts}
          aria-label="show context"
        >
          Context
        </Button>
      </CardActions>
      {notes &&
        <Collapse in={expandedNotes} timeout="auto" unmountOnExit>
          <Box p={2}>
            {notes}
          </Box>
        </Collapse>
      }
      {contexts &&
        <Collapse in={expandedContexts} timeout="auto" unmountOnExit>
          <Box p={2}>
            {contexts}
          </Box>
        </Collapse>
      }
    </Card>
  )
}

PatternLibraryCard.propTypes = {
  /** The title appears on the header for the card */
  title: PropTypes.string.isRequired,
  /** The content appears in the middle section for the card */
  children: PropTypes.any.isRequired
}

export default PatternLibraryCard
