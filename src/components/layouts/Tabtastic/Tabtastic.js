import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate, location } from '@reach/router'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Tabs, Tab } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  tabsRoot: {},
  tabsFlexContainer: {
    '@media (max-width: 500px)': {
      display: 'block',
    },
  },
  tabRoot: {
    background: theme.palette.primary.main,
    borderTop: `5px solid ${ theme.palette.primary.main }`,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.primary.dark,
    textTransform: 'capitalize',
    minHeight: 60,
    fonnnntSize: theme.typography.h4.fontSize,
    '& span:hover': {
      textDecoration: 'underline',
    },
    '@media (max-width: 500px)': {
      marginLeft: 0,
      width: '100%',
      display: 'block',
      minWidth: '100%',
      '-moz-box-shadow': 'inset  0 -10px 10px -15px grey',
      '-webkit-box-shadow': 'inset  0 -10px 10px -15px grey',
      'box-shadow': 'inset  0 -10px 10px -15px grey',
    },
  },
  tabSelected: {
    borderTop: `5px solid ${ theme.palette.primary.dark }`,
    borderBottom: `1px solid ${ theme.palette.background.default }`,
    borderLeft: `1px solid ${ theme.palette.primary.dark }`,
    borderRight: `1px solid ${ theme.palette.primary.dark }`,
    fontWeight: 'bold',
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.background.default,
    zIndex: 10,
  },
  tabPanelContainer: {
    position: 'relative',
    top: '-1px',
    borderTop: '1px solid #5c737f',
  },
  tabPanelBox: {
    '@media (max-width: 426px)': {
      padding: 0,
    },
  },
}))

function TabPanel (props) {
  const { children, value, index, ...other } = props
  const classes = useStyles()

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${ index }`}
      aria-labelledby={`full-width-tab-${ index }`}
      {...other}
    >
      {value === index && <Box p={3} className={classes.tabPanelBox}>{children}</Box>}
    </Typography>
  )
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${ index }`,
    'aria-controls': `full-width-tabpanel-${ index }`,
  }
}

const Tabtastic = props => {
  const classes = useStyles()

  const urlParams = new URLSearchParams(props.selected)
  const selectedParams = urlParams.get('tab')

  const { children } = props
  const [selected, setSelected] = useState(selectedParams || '')
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (children && selected) {
      const childIndex = children.findIndex(child => formatTabLabel(child.props.label.toLowerCase()) === selected)
      setSelectedIndex(childIndex)
    }
  }, [selected, selectedIndex])

  // format tab label and prepend string, format to replace any blank spaces with dash, then to lower case
  const formatTabLabel = label => {
    return `tab-${ label.replace(/\s+/g, '-').toLowerCase() }`
  }

  const handleChange = (event, newValue) => {
    setSelectedIndex(newValue)
    const selectedChild = props.children[newValue]
    const formattedLabel = formatTabLabel(selectedChild.props.label)

    setSelected(formattedLabel)

    navigate(`?tab=${ formattedLabel }`)
  }

  return (
    <Fragment>
      <Tabs
        value={selectedIndex}
        onChange={handleChange}
        indicatorColor="primary"
        variant="fullWidth"
        aria-label="Revenue, Disbursements, and Production Tabs"
        classes={{
          root: classes.tabsRoot,
          flexContainer: classes.tabsFlexContainer
        }}
      >
        { children &&
          React.Children.map(children, (item, index) => (
            <Tab
              disableRipple
              key={index}
              label={item.props.label}
              {...a11yProps(index)}
              index={index}
              classes={{
                root: classes.tabRoot,
                selected: classes.tabSelected
              }} />
          ))
        }
      </Tabs>
      <Box className={classes.tabPanelContainer}>
        { children &&
          React.Children.map(children, (child, index) => (
            <TabPanel key={index} value={selectedIndex} index={index}>
              {child.props.children}
            </TabPanel>
          ))
        }
      </Box>
    </Fragment>
  )
}

export const TabtasticTab = props => {
  return (
    <Box {...props} />
  )
}

TabtasticTab.propTypes = {
  label: PropTypes.string.isRequired
}

Tabtastic.propTypes = {
  children: PropTypes.node
}

export default Tabtastic
