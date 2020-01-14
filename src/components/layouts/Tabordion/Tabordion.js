import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import MuiTabs from '@material-ui/core/Tabs'
import MuiTab from '@material-ui/core/Tab'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  tabPanelContainer: {
    position: 'relative',
    top: '-1px',
    borderTop: '1px solid #5c737f',
    paddingTop: theme.spacing(2)
  }
}))

function MuiTabPanel (props) {
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

const Tabordion = props => {
  const classes = useStyles()

  const { children } = props
  const [tabs, setTabs] = useState([])
  const [tabPanels, setTabPanels] = useState([])
  const [selected, setSelected] = useState(props.selected || '')
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    children.forEach(element => {
      if (element.props.mdxType === 'Tab') {
        setTabs(tabs => tabs.concat(element))
      }
      else {
        setTabPanels(tabPanels => tabPanels.concat(element))
      }
    })
  }, [])

  useEffect(() => {
    if (props.children && selected) {
      const childIndex = props.children.findIndex(child => child.props.id === selected)
      setSelectedIndex(childIndex)
    }
  }, [selected, setSelectedIndex])

  const handleChange = (event, newValue) => {
    setSelectedIndex(newValue)
    const selectedChild = props.children[newValue]

    setSelected(selectedChild.props.id)
    navigate(`?tab=${ selectedChild.props.id }`)
  }

  return (
    <Fragment>

      <MuiTabs
        value={selectedIndex}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="Revenue, Disbursements, and Production Tabs"
      >
        { tabs &&
          tabs.map((item, index) => (
            <MuiTab disableRipple key={item.props.id} label={item.props.label} {...a11yProps(item.props.id)} index={index} />
          ))
        }
      </MuiTabs>
      <Box
        className={classes.tabPanelContainer}
      >
        { tabPanels &&
          tabPanels.map((item, index) => (
            <MuiTabPanel key={index} value={selectedIndex} index={index}>{item.props.children}</MuiTabPanel>
          ))
        }
      </Box>
    </Fragment>
  )
}

export const Tab = props => {
  props.index = 0
  return (
    <MuiTab disableRipple label={props.label} {...a11yProps(props.id)} index={props.index} />
  )
}

export const TabPanel = props => {
  return (
    <MuiTabPanel {...props}>{props.children}</MuiTabPanel>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
}

Tab.propTypes = {
  /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

Tabordion.propTypes = {
  children: PropTypes.node
}

export default Tabordion
