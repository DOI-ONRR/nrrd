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
      <Typography variant="h2">What's new</Typography>
      <Typography variant="body1">
            In our latest release on December 18, 2019, we made the following
            changes:
      </Typography>

      <List component="ul" aria-label="whats new list">
        <ListItem component="li">
          <ListItemIcon>
            <FiberManualRecordRoundedIcon style={{ fontSize: 10 }} />
          </ListItemIcon>
          <ListItemText primary="Added monthly disbursements data for October 2019" />
        </ListItem>
        <ListItem component="li">
          <ListItemIcon>
            <FiberManualRecordRoundedIcon style={{ fontSize: 10 }} />
          </ListItemIcon>
          <ListItemText primary="Added monthly production data for August 2019" />
        </ListItem>
        <ListItem component="li">
          <ListItemIcon>
            <FiberManualRecordRoundedIcon style={{ fontSize: 10 }} />
          </ListItemIcon>
          <ListItemText primary="Added monthly revenue data for November 2019" />
        </ListItem>
        <ListItem component="li">
          <ListItemIcon>
            <FiberManualRecordRoundedIcon style={{ fontSize: 10 }} />
          </ListItemIcon>
          <ListItemText>
            Added supporting information about{' '}
            <Link href='/how-it-works/reclamation-fund/'>
              Reclamation Fund disbursements
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
