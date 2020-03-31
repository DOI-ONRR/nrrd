import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Menu,
  MenuItem,
  IconButton
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  addCardButtonContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'right',
    '& button': {
      padding: theme.spacing(0.5),
      color: theme.palette.common.black,
      backgroundColor: theme.palette.common.white,
      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    '@media (max-width: 768px)': {
      textAlign: 'left',
    }
  },
}))

const AddCardButton = props => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (index, item) => event => {
    setAnchorEl(null)
    if (typeof item !== 'undefined') {
      props.onLink(item)
    }
  }

  return (
    <div className={classes.addCardButtonContainer}>
      <IconButton
        aria-label="Add additional location card menu"
        aria-controls="add-additional-location-card-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}>
        <AddIcon />
      </IconButton>
      <Menu
        id="add-additional-location-card-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose(null)}
      >
        {
          props.menuItems.map((item, i) => <MenuItem key={i} onClick={handleClose(i, item)}>{item.label}</MenuItem>)
        }
      </Menu>
    </div>
  )
}

export default AddCardButton

AddCardButton.propTypes = {
  menuItems: PropTypes.array.isRequired
}
