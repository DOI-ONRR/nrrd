import React from 'react'
import { withPrefix } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
import {
  InputAdornment,
  OutlinedInput
} from '@material-ui/core'
// import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline',
    flexWrap: 'wrap',
    color: 'white',
  },
  searchBox: {
    backgroundColor: 'rgba(41, 75, 99, .5)',
    marginLeft: '16px',
    color: 'white',
    width: '14ch',
    transition: theme.transitions.create('width'),
    '&:hover': {
      backgroundColor: 'rgba(41, 75, 99, 1)',
    }
  },
  searchBoxMobile: {
    backgroundColor: 'rgba(41, 75, 99, .5)',
    margin: theme.spacing(2), 
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
    color: 'white',
  },
  inputFocused: {
    border: theme.palette.primary.dark,
    boxShadow: '0 0 4px 1px rgb(60, 61, 62, .75)',
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '25ch',
      '&:focus': {
        width: '20ch'
      }
    }
  },
  searchIcon: {
    color: 'white',
  }
}))

const SearchSite = props => {
  const classes = useStyles()

  let searchPath = '/search-results/'

  // eslint-disable-next-line no-undef
  if (typeof props.location !== 'undefined' && props.location) {
    // eslint-disable-next-line no-undef
    searchPath = props.location.origin + withPrefix(searchPath)
  }
  else {
    searchPath = withPrefix(searchPath)
  }

  return (
    <>
      <form action={searchPath} className={classes.root}>
        <OutlinedInput
          id="search-input"
          margin="dense"
          title="search input"
          type="search"
          classes={{
            root: (props.isMobile) ? classes.searchBoxMobile : classes.searchBox,
            focused: classes.inputFocused
          }}
          placeholder={props.isMobile ? '' : 'Search...'}
          name="q"
          role="search"
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon className={classes.searchIcon} />
            </InputAdornment>
          }
        />
      </form>
    </>
  )
}

export default SearchSite
