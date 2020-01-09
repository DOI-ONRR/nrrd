import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import MuiTab from '@material-ui/core/Tab'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import { RevenueByLocationLink } from '../RevenueByLocationLink'

const useStyles = makeStyles(theme => ({
  root: {},
  tabPanelContainer: {
    position: 'relative',
    top: '-1px',
    borderTop: '1px solid #5c737f'
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
      <Box p={3}>{children}</Box>
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
  const theme = useTheme()

  const { children } = props
  const [selected, setSelected] = useState(props.selected || '')
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (props.children && selected) {
      const childIndex = props.children.findIndex(child => child.props.tabId === selected)
      setSelectedIndex(childIndex)
    }
  }, setSelectedIndex)

  const handleChange = (event, newValue) => {
    setSelectedIndex(newValue)

    const child = props.children.find(child => child.props.tabIndex === newValue)
    setSelected(child.props.tabId)
    navigate(`?tab=${ child.props.tabId }`)
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box mb={15}>
        <Grid container spacing={0} styles={{ 'padding-bottom': 0 }}>
          <Grid item xs={12} md={8}>
            <Tabs
              value={selectedIndex}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="Revenue, Disbursements, and Production Tabs"
            >
              { children &&
                children.map((item, index) => (
                  <MuiTab disableRipple key={item.props.tabId} label={item.props.tabName} {...a11yProps(item.props.tabId)} />
                ))
              }
            </Tabs>
          </Grid>
          <Grid item xs={12} md={4}>
            <RevenueByLocationLink />
          </Grid>
        </Grid>

        <Box
          className={classes.tabPanelContainer}
        >
          { children &&
            React.Children.map(children, (child, index) => {
              return (
                <TabPanel value={child.props.tabIndex} index={selectedIndex} dir={theme.direction}>
                  <TabContainer {...child.props.children.props} />
                </TabPanel>
              )
            })
          }
        </Box>
      </Box>
    </Container>
  )
}

export const Tab = props => {
  return (
    <MuiTab disableRipple label={props.name} {...a11yProps(props.tabId)} />
  )
}

export const TabContainer = props => {
  const classes = useStyles()

  return (
    <Box component="section" className={classes.root}>
      <Box>
        <Typography variant="h2">
          {props.tabPanelTitle}
        </Typography>
      </Box>
      <Box component="span">
        <Typography variant="body1">
          {props.tabPanelInfo}
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item md={8}>
          {props.tabPanelContentLeft}
        </Grid>
        <Grid item md={4}>
          {props.tabPanelContentRight}
        </Grid>
        <Grid item md={12}>
          {props.tabPanelContentChildren}
        </Grid>
        <Grid item md={12}>
          {props.tabPanelContentBottom}
        </Grid>
      </Grid>
    </Box>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

Tab.propTypes = {
  /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
}

TabContainer.propTypes = {}

Tabordion.propTypes = {}

export default Tabordion
