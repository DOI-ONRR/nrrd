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

import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded'

const WhatsNew = props => {
  return (
    <Box pt={5} pb={5}>
      <Box component="h2" m={0}>What's new</Box>
      <Typography variant="body1">
        In our latest release on March 30, 2020, we made the following changes:
      </Typography>
      <List component="ul" aria-label="whats new list">
        <ListItem component="li">
          <ListItemIcon>
            <FiberManualRecordRoundedIcon style={{ fontSize: 10 }} />
          </ListItemIcon>
          <ListItemText>
            Updated{' '}
            <Link href='https://revenuedata.doi.gov/downloads/federal-production'>
              fiscal year production data through 2019
            </Link>
          </ListItemText>
        </ListItem>
      </List>
      <List component="ul" aria-label="whats new list">
        <ListItem component="li">
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
      <Typography variant="body1">
            Review our{' '}
        <Link href='https://github.com/ONRR/doi-extractives-data/releases'>
              full release details
        </Link>.
      </Typography>
    </Box>

  )
}

export default WhatsNew
