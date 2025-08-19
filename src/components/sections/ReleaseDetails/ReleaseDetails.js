import React from 'react';
import { Box, Typography, Link, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  h3: {
    marginTop: '0.5rem',
    marginBottom: '1rem'
  },
  changes: {
    display: 'block',
    marginTop: '1rem'
  },
  changeList: {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
    '& .MuiListItem-root': {
      display: 'list-item',
      listStyleType: 'inherit',
    },
    '& .MuiListItem-gutters': {
      paddingLeft: '0.5rem',
    },
    '& .MuiListItemText-primary': {
      fontSize: '1rem',
    }
  }
})

export default function ReleaseDetails() {
  const classes = useStyles();

  return (
    <Box mb={4} pt={0.5} pb={2} pl={3} pr={3} borderRadius={10} border={'1px solid #3C3D3E'}>
      <Typography variant='h3' className={classes.h3}>
        Latest release details
      </Typography>

      <Typography variant="inherit" className={classes.changes}>
        August 20, 2025 changes:
      </Typography>

      <List className={classes.changeList}>
        <ListItem>
          <ListItemText
            primary={
              <>
              Added <Link href="downloads/disbursements-by-month/" linkType="default">monthly disbursements data</Link>
              </>
            }
          />
        </ListItem>
        <ListItem>
        <ListItemText
          primary={
            <Link href="/downloads/production-by-month/" linkType="default">
              Added monthly production data
            </Link>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={
            <Link href="downloads/revenue/" linkType="default">
              Added monthly revenue data
            </Link>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={
            <Link href="downloads/production-by-disposition/" linkType="default">
              Added monthly production disposition data
            </Link>
          }
        />
      </ListItem>
            
      </List>

      <Typography variant='inherit'>
        Review our <Link href="https://github.com/ONRR/nrrd/releases">full release details</Link>.
      </Typography>
    </Box>
  )
}