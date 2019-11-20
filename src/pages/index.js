import React, { useState}  from "react"
//import { Link } from "gatsby"

import DefaultLayout from "../components/layouts/DefaultLayout"
//import Image from "../components/image"
import SEO from "../components/seo"

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import ExploreData from "../components/sections/ExploreData"

const IndexPage = () => {

    const classes=useStyles();
    
	return (
	    
		<DefaultLayout>
		<SEO title="Home" />
		<Container maxWidth="lg">
		<Typography className={classes.heroContent} variant="h5">
	    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		</Typography>
		<ExploreData/>
	    </Container>
		</DefaultLayout>
	)
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
export default IndexPage



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
