import React, { useState}  from "react"
//import { Link } from "gatsby"

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider';

import { graphql } from 'gatsby';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import  Map  from '../../data-viz/Map'
import StateCard from '../../layouts/StateCard'

export const STATIC_QUERY=graphql`
{  onrr {   
    commodity(distinct_on: fund_type) {
         fund_type
    } 
  }
}`

const APOLLO_QUERY=gql`
query FiscalRevenue($year: Int!) {


fiscal_revenue_summary( where: {fiscal_year: {_eq: $year}}) {
    fiscal_year
    state_or_area
    sum
  }
}
`

/*
fiscal_revenue_summary(order_by: {fiscal_year: desc, state_or_area: asc}, where: {fiscal_year: {_eq: 2019}}) {
    fiscal_year
    state_or_area
    sum
  }
}`
*/

//const filter=false;


const ExploreData = () => {
   // console.debug(commodity);
    
    const classes = useStyles()
    const [cards, setCards]=useState([]);
    const [year, setYear]=useState(2018);
    const [count, setCount]=useState(0);

    console.debug(year);
     const onLink = (state) => {
	 console.debug(state);

	 setCards((cards)=>{cards.push({fips: state.properties.FIPS, abbrev: state.properties.abbr, name: state.properties.name}); return cards});
	setCount(count=>count+1);
	console.debug("CARDS:",cards);
	console.debug("COUNT:",count);

    }
    const onYear = (selected) => {
	setYear(selected);
    }
	
    const { loading, error, data } = useQuery(APOLLO_QUERY,{ variables: { year }});
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
    if(data) {
	let mapData=data.fiscal_revenue_summary.map( (item,i)=> [item.state_or_area, item.sum] );
	console.debug(mapData)
	return (
		<Container maxWidth="lg">
		<Typography id="discrete-slider" gutterBottom>
        Years
      </Typography>
      <Slider
        defaultValue={2018}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
            marks
	    onChange={(e,yr)=>{ console.debug(yr); onYear(yr)}}
        min={2008}
        max={2019}
      />
	    

		<div className={classes.mapContainer}>		  
		<Container className={classes.cardContainer}>
		{cards.map((state,i) =>{ console.debug("FIPS",state.fips)
					 return <StateCard key={i} fips={state.fips} abbrev={state.abbrev} name={state.name}  />})}
	    
	    </Container>
		
		<Map mapFeatures='states'
	    mapData={mapData}
	    onClick={(d,fips,foo,bar) => {
		console.debug("MAP CLICKED");
		console.debug(d)
		console.debug(fips)
		console.debug(foo,bar)
		onLink(d)
		
	    }}		     />
		</div>
	    </Container>
	)
    }	
    /*
    return (
    
  <DefaultLayout>
    <SEO title="Home" />
	    <Container maxWidth="lg">
	    {console.debug(data)}
	    <Typography className={classes.heroContent} variant="h5">
	    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	    </Typography>
	    -	<section className={classes.root}>

	      <Container className={classes.cardContainer}>
	    {cards.map((fips,i) =>{ console.debug("FIPS",fips)
				    return <StateCard key={i} fips={fips}  />})}
	
				  </Container>

	    </section>
	</Container>
	    
  </DefaultLayout>


     )
*/
}
export default ExploreData


const useStyles = makeStyles(theme => ({
  section: {
      marginTop: theme.spacing(2),
      height: '600px'
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
    marginTop: '5rem'
  },
    mapContainer: {
	minWidth:'280px',
	flexBasis:'100%',		    
	height: '600px',
	    order:'3'
	    
    },
    
    cardContainer: {
	width:'280px',
	position:'absolute',
	right: '20px'
	
    }
    
}))
