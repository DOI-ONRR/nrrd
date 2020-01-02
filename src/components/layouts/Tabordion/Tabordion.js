import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import MuiTab from '@material-ui/core/Tab'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import TotalRevenue from '../../sections/TotalRevenue'
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

  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // const handleChangeIndex = index => {
  //   setValue(index)
  // }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box mb={15}>
        <Grid container spacing={0} styles={{ 'padding-bottom': 0 }}>
          <Grid item xs={12} md={8}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="Revenue, Disbursements, and Production Tabs"
            >
              { children &&
                children.map((item, index) => (
                  <MuiTab disableRipple key={index} label={item.props.tabName} {...a11yProps(index)} />
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
                <TabPanel value={value} index={index} dir={theme.direction}>
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
    <MuiTab disableRipple label={props.name} {...a11yProps(props.tabIndex)} />
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
