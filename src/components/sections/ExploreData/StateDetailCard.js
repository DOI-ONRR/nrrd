import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '24%',
  },
  closeIcon: {
    color: 'white',
    position: 'relative',
    top: 10,
    cursor: 'pointer'
  }
}))

const StateDetailCard = props => {
  const classes = useStyles()

  const closeCard = item => {
    props.closeCard(props.fips)
  }

  return (
    <Card className={`${ classes.root } ${ props.cardCountClass }`}>
      <CardHeader
        title={props.cardTitle}
        action={<CloseIcon
          className={classes.closeIcon}
          onClick={(e, i) => {
            closeCard(i)
          }}
        />}
      />
      <CardContent>
        <Typography variant="body1" component="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>
        <Typography variant="body2" component="p">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small" color="primary">Learn More</Button> */}
      </CardActions>
    </Card>
  )
}

export default StateDetailCard
