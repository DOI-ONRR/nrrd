import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'

import { StoreContext } from '../../../store'

const useStyles = makeStyles(theme => ({
  root: {},
  mapMenuRoot: {
    position: 'relative',
    top: -2,
    border: `1px solid ${ theme.palette.grey['300'] }`,
    height: 50,
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    background: 'white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .15)',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 150,
    zIndex: 99,
    fontSize: theme.typography.body2,
    '& .MuiTypography-root': {
      fontSize: '1.2rem',
      lineHeight: '1.2rem',
    },
    '& *': {
      margin: 0,
    },
    '& nav, & nav > div': {
      paddingTop: 0,
      paddingBottom: 0,
    }
  }
}))

const MapSelectControl = props => {
  const { options, label, payload, ...rest } = props

  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, i) => {
    setSelectedIndex(i)
    setAnchorEl(i)
    // TODO: finish setting up how the payload gets handled
    dispatch(payload)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div {...rest} className={classes.mapMenuRoot}>
      <List component="nav" aria-label={`${ label } data menu`}>
        <ListItem
          button
          aria-haspopup="true"
          aria-controls={`${ label }-data-menu`}
          aria-label={`${ label } data menu`}
          onClick={handleClickListItem}
        >
          <ListItemText primary={label} secondary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id={`${ label }-data-menu`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

MapSelectControl.propTypes = {
  /** The options used for the select dropdown */
  options: PropTypes.array.isRequired,
  /** Aria label, used to apply to all aria elements */
  label: PropTypes.string.isRequired,
  /** Store dispatch, used to send dispatch with payload to store provider */
  payload: PropTypes.object,
}

export default MapSelectControl
