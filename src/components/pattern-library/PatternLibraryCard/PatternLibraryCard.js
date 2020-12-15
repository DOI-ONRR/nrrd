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

const useStyles = makeStyles(theme => ({
  cardHeaderRoot: {
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

const PatternLibraryCardNotes = () => {
  return (
    <div>PatternLibraryCardNotes</div>
  )
}

const PatternLibraryCard = ({ title, notes, context, children }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [expandedNotes, setExpandedNotes] = React.useState(false)
  const handleExpandNotesClick = () => setExpandedNotes(!expandedNotes)

  console.log(notes)
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
          onClick={handleExpandNotesClick} hj
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
          disabled={!context}
        >
          Context
        </Button>
        {notes &&
          <Collapse in={expandedNotes} timeout="auto" unmountOnExit></Collapse>
        }
      </CardActions>
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
