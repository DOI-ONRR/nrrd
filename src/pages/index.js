import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import SwipeableViews from 'react-swipeable-views'

import DefaultLayout from "../components/layouts/DefaultLayout"
import { WhatsNew } from '../components/sections/WhatsNew'
import Image from "../components/image"
import SEO from "../components/seo"

import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import { graphql } from 'gatsby';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';


export const STATIC_QUERY=graphql`
{  onrr {   
    commodity(distinct_on: fund_type) {
         fund_type
    } 
  }
}`

const APOLLO_QUERY=gql`
{  
 commodity(distinct_on: fund_type) {
    fund_type
  }

}`

const useStyles = makeStyles(theme => ({
  section: {
    marginTop: theme.spacing(0)
  },
  fluid: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  },
  heroContent: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
    fontWeight: 300,
    marginTop: 0
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


const IndexPage = ({
  data: {
	onrr: {commodity}
    }
}) => {
    console.debug(commodity);
    const { loading, error, data } = useQuery(APOLLO_QUERY);
    console.debug(data);
    const classes = useStyles()
    const theme = useTheme();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue)
    }

    const handleChangeIndex = index => {
      setValue(index)
    }

    return (
    
  <DefaultLayout>
    <SEO
      title="Home | Natural Resources Revenue Data"
      meta={[
        // title
        {
          name: 'og:title',
          content: 'Home | Natural Resources Revenue Data'
        },
        {
          name: 'twitter:title',
          content: 'Home | Natural Resources Revenue Data'
        }
      ]}
    />
    <Container maxWidth="lg">
      <h3 className="h3-bar">&nbsp;</h3>
      <Typography className={classes.heroContent} variant="h5">
      When companies extract energy and mineral resources on property leased from the federal government and Native Americans, they pay bonuses, rent, and royalties. The Office of Natural Resources Revenue (ONRR) collects and disburses revenue from federal lands and waters to different agencies, funds, and local governments for public use. All revenue collected from extraction on Native American lands is disbursed to Native American tribes, nations, or individuals.
      </Typography>
    </Container>
    <Container maxWidth="lg">
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
          <h3>Data by state</h3>
          <p>Select a state for detailed production, revenue, and disbursements data.</p>
        </TabPanel>
      </SwipeableViews>
    </Container>
    <Container className={classes.fluid} maxWidth={false}>
      <WhatsNew />
    </Container>
    {/* <Container maxWidth="lg">
      {commodity.map((item,i)=>{
        return  (<p key={i}>{item.fund_type}</p>)
      })}
      {loading && <p>Loading data...</p>}
      {error && <p>Error: ${error.message}</p>}
      {data && data.commodity &&
      data.commodity.map((fund,y)=>(<span key={y}>{fund.fund_type}</span>))
      }
    </Container> */}

  </DefaultLayout>
  )
}
export default IndexPage
