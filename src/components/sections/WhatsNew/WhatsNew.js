import React from 'react'
import Link from '../../../components/Link'

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded'

const useStyles = makeStyles(theme => ({
  listRoot: {
    fontSize: theme.typography.body2.fontSize,
    '& li span': {
      fontSize: theme.typography.body2.fontSize,
    },
  },
}))

const WhatsNew = props => {
  const classes = useStyles()
  return (
    <Box fontWeight="normal">
      <Box component="h2" m={0}>What's new</Box>
      <Typography variant="body2">
        In our latest release on March 30, 2020, we made the following changes:
      </Typography>
      <List component="ul" aria-label="whats new list" classes={{ root: classes.listRoot }}>
        <ListItem component="li" disableGutters>
          <ListItemIcon>
            <FiberManualRecordRoundedIcon style={{ fontSize: 10 }} />
          </ListItemIcon>
          <ListItemText classes={{ root: classes.listRoot }}>
            Updated{' '}
            <Link href='https://revenuedata.doi.gov/downloads/federal-production'>
              fiscal year production data through 2019
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem component="li" disableGutters>
          <ListItemIcon>
            <FiberManualRecordRoundedIcon style={{ fontSize: 10 }} />
          </ListItemIcon>
          <ListItemText>
            Added{' '}
            <Link href='/how-it-works/gomesa/#revenue-sharing'>
              2020 GOMESA disbursements to states and local governments
            </Link>
          </ListItemText>
        </ListItem>
      </List>
      <Typography variant="body2">
            Review our{' '}
        <Link href='https://github.com/ONRR/doi-extractives-data/releases'>
              full release details
        </Link>.
      </Typography>
    </Box>

  )
}

export default WhatsNew
