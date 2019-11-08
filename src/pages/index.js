import React from "react"
import { Link } from "gatsby"

import DefaultLayout from "../components/layouts/DefaultLayout"
import Image from "../components/image"
import SEO from "../components/seo"

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

import { graphql } from 'gatsby';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
//import { MapSection } from '../components/sections/MapSection'
import { useApolloClient } from "@apollo/react-hooks";

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
  foo @client


}`

const STATE_QUERY=gql`
{
foo @client
}`

const filter=false;
const useStyles = makeStyles(theme => ({
  section: {
    marginTop: theme.spacing(2)
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
  }
}))

const FooBar = () => {
    
    const { data, client } = useQuery(STATE_QUERY)
    console.debug(data)
    console.debug(client)
    return(<div><div>FOO</div><div>{data && data.foo}</div></div>);
}

const IndexPage = ({
  data: {
	onrr: {commodity}
    }
}) => {
    console.debug(commodity);
    const { loading, error, data, client } = useQuery(APOLLO_QUERY);
    console.debug(data);
    const classes = useStyles()

    const onLink = (e, fund) => {
	console.debug(e);
	e.preventDefault();
	client.writeData({ data: { foo: fund } })

    

    }

    

    
    return (
    
  <DefaultLayout>
    <SEO title="Home" />
	    <Container maxWidth="lg">
	    
      <h3 className="h3-bar">&nbsp;</h3>
	    <Typography className={classes.heroContent} variant="h5">
	    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	    
	</Typography>
	    
	<FooBar />
	 
    </Container>
    <Container maxWidth="lg">
    {commodity.map((item,i)=>{
	return  (<p key={i}><button onClick={(e)=>{onLink(e,item.fund_type)}} >{item.fund_type}</button></p>)
	})}
	{loading && <p>Loading data...</p>}
	{error && <p>Error: ${error.message}</p>}
	{data && data.commodity &&
	 data.commodity.map((fund,y)=>(<span onClick={onLink} key={y}>{fund.fund_type}</span>))
	}
	
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
    </Container>

  </DefaultLayout>
  )
}
export default IndexPage
