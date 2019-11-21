import React, { Fragment } from "react"
import PropTypes from "prop-types"
import SwipeableViews from "react-swipeable-views"

import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { makeStyles, useTheme } from "@material-ui/styles"

const useStyles = makeStyles(theme => ({
  root: {
    
    marginBottom: theme.spacing(10)
  },
  paper: {
    background: theme.palette.secondary.light,
  }
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


const Tabordion = () => {
  const classes = useStyles()
  const theme = useTheme()

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = index => {
    setValue(index)
  }
  
  return (
    <Container maxWidth="lg" className={classes.root}>

      <Paper square className={classes.paper}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Revenue" {...a11yProps(0)} />
          <Tab label="Disbursments" {...a11yProps(1)} />
          <Tab label="Production" {...a11yProps(2)} />
          <Tab label="Data by State" {...a11yProps(3)} />
        </Tabs>
      </Paper>
     
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <h3>Revenue</h3>
          <p>The amount of money collected by the federal government from energy and mineral extraction on federal lands and waters and Native American lands.</p>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <h3>Disbursements</h3>
          <p>The amount of money the federal government distributed to various funds, agencies, local governments, and Native Americans.</p>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <h3>Production</h3> 
          <p>The volume of major commodities extracted on federal lands and waters and Native American lands.</p>
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <h3>Data by State</h3>
          <p>Select a state for detailed production, revenue, and disbursements data.</p>
        </TabPanel>
      </SwipeableViews>
    </Container>
  )
}

export default Tabordion