import React from "react"
import PropTypes from "prop-types"
import SwipeableViews from "react-swipeable-views"

import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { makeStyles, useTheme } from "@material-ui/core/styles"

import { RevenueByLocationLink } from "../RevenueByLocationLink"

const useStyles = makeStyles(theme => ({
  root: {},
  tabPanelContainer: {
    position: `relative`,
    top: `-1px`,
    borderTop: `1px solid #5c737f`
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${ index }`,
    'aria-controls': `full-width-tabpanel-${ index }`,
  }
}


const Tabordion = () => {
  const classes = useStyles()
  const theme = useTheme()

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = index => {
    setValue(index)
  }
  
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
              <Tab disableRipple label="Revenue" {...a11yProps(0)} />
              <Tab disableRipple label="Disbursements" {...a11yProps(1)} />
              <Tab disableRipple label="Production" {...a11yProps(2)} />
            </Tabs>
          </Grid>
          <Grid item xs={12} md={4}>
            <RevenueByLocationLink />
          </Grid>
        </Grid>
        

        <Box
          className={classes.tabPanelContainer}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Typography variant="h2">
              Revenue
            </Typography>
            <Typography variant="body1">
              The amount of money collected by the federal government from energy and mineral extraction on federal lands and waters and Native American lands.
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Typography variant="h2">
              Disbursements
            </Typography>
            <Typography variant="body1">
              The amount of money the federal government distributed to various funds, agencies, local governments, and Native Americans.
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Typography variant="h2">
              Production
            </Typography>
            <Typography variant="body1">
            The volume of major commodities extracted on federal lands and waters and Native American lands.
            </Typography>
          </TabPanel>
        </Box>
      </Box>
    </Container>
  )
}

export default Tabordion
