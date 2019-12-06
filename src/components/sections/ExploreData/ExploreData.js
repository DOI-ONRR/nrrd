import React, { Fragment, useState } from "react";
//import { Link } from "gatsby"

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";

import { graphql } from "gatsby";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Map from "../../data-viz/Map";
import StateCard from "../../layouts/StateCard";

export const STATIC_QUERY = graphql`
  {
    onrr {
      commodity(distinct_on: fund_type) {
        fund_type
      }
    }
  }
`;

const FISCAL_REVENUE_QUERY = gql`
  query FiscalRevenue($year: Int!) {
    fiscal_revenue_summary(where: { fiscal_year: { _eq: $year } }) {
      fiscal_year
      state_or_area
      sum
    }
  }
`;

const CACHE_QUERY = gql`
  {
    selectedYear @client
  }
`;

/*
fiscal_revenue_summary(order_by: {fiscal_year: desc, state_or_area: asc}, where: {fiscal_year: {_eq: 2019}}) {
    fiscal_year
    state_or_area
    sum
  }
}`
*/

//const filter=false
const FooBar = props => {
  const classes = useStyles();
  const { data, client } = useQuery(CACHE_QUERY);
  console.debug(data);
  console.debug(
    "==============================================================================++++++GOTCACHE?"
  );

  //    console.debug(client)
  //    const { loading, error, data} = useQuery(FISCAL_REVENUE_QUERY)
  let year = 2019;
  if (data) {
    year = data.selectedYear;
  }
  return (
    <Slider
      defaultValue={year}
      aria-labelledby="discrete-slider"
      valueLabelDisplay="auto"
      step={1}
      valueLabelDisplay="on"
      marks={[{ value: 2003, label: "2003" }, { value: 2019, label: "2019" }]}
      onChange={(e, yr) => {
        props.onYear(yr);
      }}
      min={2003}
      max={2019}
      className={classes.sliderRoot}
    />
  );

  //return(<div><div>FOO</div><div>{data && data.selectedYear}</div></div>)
};

const ExploreData = () => {
  const classes = useStyles();
  const [cards, setCards] = useState([]);
  const [year, setYear] = useState(2018);
  const [count, setCount] = useState(0);
  // const {cache, client} = useQuery(CACHE_QUERY)
  // client.writeData({ data: { selectedYear: 2014 } })
  // console.debug(cache)
  //    if(cache) {

  //	console.debug(cache)

  //}

  const onLink = state => {
    setCards(cards => {
      if (
        cards.filter(item => item.fips == state.properties.FIPS).length == 0
      ) {
        cards.push({
          fips: state.properties.FIPS,
          abbrev: state.properties.abbr,
          name: state.properties.name
        });
      }
      return cards;
    });
    setCount(count => count + 1);
    console.debug("CARDS:", cards);
    console.debug("COUNT:", count);
  };
  const onYear = selected => {
    client.writeData({ data: { selectedYear: selected } });

    setYear(selected);
  };

  const closeCard = fips => {
    setCards(cards => {
      return cards.filter(item => item.fips !== fips);
    });
  };

  const { loading, error, data, client } = useQuery(FISCAL_REVENUE_QUERY, {
    variables: { year }
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (data) {
    let mapData = data.fiscal_revenue_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ]);
    console.debug(
      "DWGH=======================================================",
      client
    );
    let timeout = 500;
    return (
      <Fragment>
        <Grid container className={classes.root} spacing={2}>
          <Grid item sm={12} md={6}>
            <Box mt={2} mb={5}>
              <Fade in={true} timeout={timeout}>
                <Typography variant="h4">Fiscal Year {year} Revenue</Typography>
              </Fade>
            </Box>
          </Grid>
          <Grid item sm={12} md={6}>
            <Box mt={4} mb={5}>
              {/* Year Slider */}
              <Fade in={true} timeout={timeout}>
                <FooBar
                  onYear={selected => {
                    onYear(selected);
                  }}
                />
              </Fade>
              {/* <Typography id="discrete-slider" gutterBottom>
                Years
              </Typography> */}
            </Box>
          </Grid>
        </Grid>

        <Container maxWidth="lg">
          <Fade in={true} timeout={timeout}>
            <div className={classes.mapContainer}>
              <Container className={classes.cardContainer}>
                {cards.map((state, i) => {
                  return (
                    <StateCard
                      key={i}
                      fips={state.fips}
                      abbrev={state.abbrev}
                      name={state.name}
                      closeCard={fips => {
                        closeCard(fips);
                      }}
                    />
                  );
                })}
              </Container>

              <Map
                mapFeatures="states"
                mapData={mapData}
                onClick={(d, fips, foo, bar) => {
                  onLink(d);
                }}
              />
            </div>
          </Fade>
        </Container>
      </Fragment>
    );
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
};
export default ExploreData;

const useStyles = makeStyles(theme => ({
  section: {
    marginTop: theme.spacing(2),
    height: "600px"
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
    marginTop: "5rem"
  },
  mapContainer: {
    position: "relative",
    minWidth: "280px",
    flexBasis: "100%",
    height: "600px",
    order: "3"
  },

  cardContainer: {
    width: "280px",
    position: "absolute",
    right: "20px"
  },

  sliderRoot: {
    width: `100%`
  }
}));
