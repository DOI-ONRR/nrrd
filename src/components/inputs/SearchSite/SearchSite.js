import React, { Fragment } from 'react'
import { withPrefix } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
// import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SearchIcon from '@material-ui/icons/Search'
import OutlinedInput from '@material-ui/core/OutlinedInput'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline',
    flexWrap: 'wrap',
  },
  searchBox: {
    backgroundColor: 'white',
    marginLeft: '16px'
  },
  searchBoxMobile: {
    backgroundColor: 'white',
    marginRight: '30px',
    marginLeft: '16px'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  inputFocused: {
    border: theme.palette.primary.dark,
    boxShadow: '0 0 4px 1px rgba(24, 24, 25, .75)'
  },
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
    <Fragment>
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
          placeholder={props.isMobile ? '' : 'Search'}
          name="q"
          role="search"
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </form>
    </Fragment>
  )
}

export default SearchSite
