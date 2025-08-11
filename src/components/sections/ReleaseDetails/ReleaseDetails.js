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
        August 13, 2025 changes:
      </Typography>

      <List className={classes.changeList}>
        <ListItem>
          <ListItemText
            primary={
              <>
                Updated the overall state revenue-sharing caps on <Link href="/how-revenue-works/gomesa/">Gulf of America Outer Continental Shelf Disbursements</Link>.
              </>
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