import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    overflow: 'auto',
    alignItems: 'stretch',
    backgroundColor: theme.palette.common.white,
    minHeight: 50,
  },
  rootSecondary: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    overflow: 'auto',
    position: 'relative',
    top: -1,
    minHeight: 71,
  },
}))
/**
 * The toolbar is used to contain various inputs for the user to access. It is
 * currently used on [Explore Data](https://revenuedata.doi.gov/explore) and [Query Data](https://revenuedata.doi.gov/query-data).
 */
const BaseToolbar = ({ isSecondary, children, style, ...restProps }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Toolbar
      classes={{
        root: (isSecondary) ? classes.rootSecondary : classes.root,
      }}
      style={style}
      {...restProps}>
      {children}
    </Toolbar>
  )
}

export default BaseToolbar

BaseToolbar.Preview = {
  group: 'Toolbars',
  demos: [
    {
      title: 'Example',
      code: '<BaseToolbar>' +
        '<BaseButtonInput>Click me</BaseButtonInput>' +
        '<BaseSelectInput label="Simple Items" data={["item1", "item2", "item3"]} />' +
        '<BaseSwitch label={"Enable access"} selectType={"Single"} />' +
        '</BaseToolbar>',
    }
  ]
}
