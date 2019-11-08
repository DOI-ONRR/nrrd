import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import { graphql } from 'gatsby';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { MapSection } from '../components/sections/MapSection'

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


const IndexPage = ({
    data: {
	onrr: {commodity}
    }
}) => {
    console.debug(commodity);
    const { loading, error, data } = useQuery(APOLLO_QUERY);
    console.debug(data);


    return (
    
  <Layout>
	    <SEO title="Home" />
	    {/*	    <MapSection 
	info="Federal revenue by state and offshore region for fiscal year 2019"
	states={this.props.data.states_data.states}
	offshore_regions={this.props.data.offshore_data.offshore_regions}
	mapFeatures="states"
	mapTitle="Revenue"
	mapJson="/maps/land/us-topology.json"
	mapOffshoreJson="/maps/offshore/offshore.json"
	mapJsonObject={{us:mapJson, offshore:mapOffshoreJson}}
	onClick={ (d,i) => {
	    let state=fipsAbbrev[d.id] || d.id;
	    let url="/explore/"+state
	    if(state.match(/offshore/)) {
		url="/explore/"+state;
	    }
	    url=withPrefixGatsby(url);
	    window.location.href = url;
	    
	} }
	    />
	     */}
	    
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
	<p>Now go build something great.</p>

	{commodity.map((item,i)=>{
	    return  (<p key={i}>{item.fund_type}</p>)
	})}
	{loading && <p>Loading data...</p>}
	{error && <p>Error: ${error.message}</p>}
	{data && data.commodity &&
	 data.commodity.map((fund,y)=>(<span key={y}>{fund.fund_type}</span>))
	}
	
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)
}
export default IndexPage
