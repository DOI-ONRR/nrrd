import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@material-ui/core'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

import { StoreContext } from '../../../store'

const useStyles = makeStyles(theme => ({
  root: {},
  mapMenuRoot: {
    position: 'relative',
    top: -2,
    border: `1px solid ${ theme.palette.grey['300'] }`,
    height: 50,
    minWidth: 150,
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
  },
  menuIcon: {
    color: theme.palette.links.default,
    position: 'absolute',
    right: 0,
    top: -2,
  },
  listItemTextPrimary: {
    color: theme.palette.grey[700],
    fontSize: theme.typography.h5.fontSize,
    marginRight: theme.spacing(0.5),
  },
  listItemTextSecondary: {
    color: theme.palette.grey[900],
    fontWeight: 'bold',
  },
}))

const MapSelectControl = props => {
  const { options, label, payload, selectedOption, ...rest } = props

  const classes = useStyles()
  const theme = useTheme()
  const { state, dispatch } = useContext(StoreContext)

  const findSelectedOption = options.findIndex(item => item === selectedOption)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(findSelectedOption || 0)
  const [checked, setChecked] = React.useState([0])
  const [selectAll, setSelectAll] = useState(true)

  const checkedItemsToDisplay = [...checked]

  useEffect(() => {
    setChecked(options)
  }, [])

  useEffect(() => {
    if (!selectAll) {
      setChecked([])
    }
    else {
      setChecked(options)
    }
  }, [selectAll])

  useEffect(() => {
    setSelectedIndex(findSelectedOption)
  }, [findSelectedOption])

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]
    if (currentIndex === -1) {
      newChecked.push(value)
    }
    else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, i, option) => {
    setSelectedIndex(i)
    setAnchorEl(i)
    // TODO: finish setting up how the payload gets handled
    const keys = Object.keys(payload.payload)
    dispatch({ type: payload.type, payload: { [keys[0]]: option } })

    if (props.checkbox) {
      handleToggle(option)
    }

    handleClose()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toggleSelectAll = () => {
    setSelectAll(!selectAll)
  }

  // aria label formatting, remove any spaces and add a dash from props label
  const labelStr = label.toLowerCase()
  const ariaLabel = labelStr.replace(/[^a-zA-Z0-9.-]+/g, '-')

  // Select menu list with checkboxes
  if (props.checkbox) {
    return (
      <div className={classes.mapMenuRoot}>
        <List component="nav" aria-label={`${ ariaLabel } select menu`}>
          <ListItem
            button
            aria-haspopup="true"
            aria-controls={`${ ariaLabel }-select-menu`}
            aria-label={`${ ariaLabel } select menu`}
            onClick={handleClickListItem}
          >
            { /* Output checked list to comma seperated items with ellipsis at the end */ }
            <ListItemText
              primary={label}
              secondary={selectAll ? 'All' : checkedItemsToDisplay.join(', ').replace(/, ([^,]*)$/, '...') || 'None' }
              classes={{ primary: classes.listItemTextPrimary, secondary: classes.listItemTextSecondary }} />
            <ListItemIcon>
              <KeyboardArrowDownIcon classes={{ root: classes.menuIcon }} />
            </ListItemIcon>
          </ListItem>
        </List>
        <Menu
          id={`${ ariaLabel }-select-menu`}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <List>
            <ListItem key={0} role={undefined} dense button onClick={toggleSelectAll}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectAll}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': 'selectAll' }}
                  style={{ color: theme.palette.links.default }}
                />
              </ListItemIcon>
              <ListItemText id="selectAll" primary={selectAll ? 'Select none' : 'Select all'} />
            </ListItem>
            {options.map((option, index) => {
              const labelId = `checkbox-list-label-${ option }`

              return (
                <ListItem key={index} role={undefined} dense button onClick={handleToggle(option)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(option) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      style={{ color: theme.palette.links.default }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={option} />
                </ListItem>
              )
            })}
          </List>
        </Menu>
      </div>
    )
  }
  else {
    return (
      <div {...rest} className={classes.mapMenuRoot}>
        <List component="nav" aria-label={`${ ariaLabel } select menu`}>
          <ListItem
            button
            aria-haspopup="true"
            aria-controls={`${ ariaLabel }-select-menu`}
            aria-label={`${ ariaLabel } select menu`}
            onClick={handleClickListItem}
          >
            <ListItemText
              primary={label}
              secondary={options[selectedIndex]}
              classes={{ primary: classes.listItemTextPrimary, secondary: classes.listItemTextSecondary }} />
            <ListItemIcon>
              <KeyboardArrowDownIcon classes={{ root: classes.menuIcon }} />
            </ListItemIcon>
          </ListItem>
        </List>
        <Menu
          id={`${ ariaLabel }-select-menu`}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {options.map((option, index) => {
            return (
              <MenuItem
                key={option}
                value={option}
                selected={index === selectedIndex}
                onClick={event => handleMenuItemClick(event, index, option)}
              >
                {option}
              </MenuItem>
            )
          })
          }
        </Menu>
      </div>
    )
  }
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
