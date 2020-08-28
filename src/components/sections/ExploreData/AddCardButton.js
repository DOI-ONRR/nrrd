import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Tooltip
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'

import { ExploreDataContext } from '../../../stores/explore-data-store'

const useStyles = makeStyles(theme => ({
  addCardButtonContainer: {
    marginTop: theme.spacing(2),
    '& > span': {
      flexDirection: 'column',
    },
    '& svg': {
      color: theme.palette.links.default,
    },
    '& button': {
      padding: theme.spacing(0.5),
      backgroundColor: theme.palette.common.white,
      borderRadius: 0,
      fontSize: '1.2rem',
      color: theme.palette.grey[700],
      height: 50,
      minWidth: 50,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .15)',
    },
    '& button:hover': {
      backgroundColor: theme.palette.grey[100],
    },
    '@media (max-width: 768px)': {
      textAlign: 'left',
    }
  },
  tooltipRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  }
}))

const AddCardButton = props => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const { state: pageFilter } = useContext(ExploreDataContext)

  const { cardMenuItems, onLink } = props
  const cards = pageFilter.cards

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (index, item) => event => {
    setAnchorEl(null)
    if (typeof item !== 'undefined') {
      onLink(item)
    }
  }

  return (
    <Box className={classes.addCardButtonContainer}>
      <Tooltip title="Add location" classes={{ tooltip: classes.tooltipRoot }}>
        <IconButton
          aria-label="Add additional location card menu"
          aria-controls="add-additional-location-card-menu"
          aria-haspopup="true"
          onClick={handleMenuClick}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="add-additional-location-card-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose(null)}
      >
        {
          cardMenuItems.map((item, i) => <MenuItem disabled={cards.some(c => c.state === item.name)} key={i} onClick={handleClose(i, item)}>{item.label}</MenuItem>)
        }
      </Menu>
    </Box>
  )
}

export default AddCardButton

AddCardButton.propTypes = {
  cardMenuItems: PropTypes.array
}
