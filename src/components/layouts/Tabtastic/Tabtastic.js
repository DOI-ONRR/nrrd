import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  tabPanelContainer: {
    position: 'relative',
    top: '-1px',
    borderTop: '1px solid #5c737f',
  }
}))

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${ index }`}
      aria-labelledby={`full-width-tab-${ index }`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
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
  console.log('Tabtastic props: ', props)
  const classes = useStyles()

  const { children } = props
  const [selected, setSelected] = useState(props.selected || '')
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
        textColor="primary"
        variant="fullWidth"
        aria-label="Revenue, Disbursements, and Production Tabs"
      >
        { children &&
          React.Children.map(children, (item, index) => (
            <Tab disableRipple key={index} label={item.props.label} {...a11yProps(index)} index={index} />
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
