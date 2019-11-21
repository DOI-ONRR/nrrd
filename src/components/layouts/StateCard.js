
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close'

import Sparkline from '../data-viz/Sparkline';

import { graphql } from 'gatsby';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const useStyles = makeStyles({
    card: {
	
      width: 275,
      margin: "10px"
    },
    close: {
	position: 'absolute',
	right: '10px'
    },
    
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
    menuButton: {
	marginRight: '4px'
    },
});

const APOLLO_QUERY=gql`
query StateTrend($state: String!) {


fiscal_revenue_summary( where: {state_or_area: {_eq: $state}}) {
    fiscal_year
    state_or_area
    sum
  }
}
`

export default function StateCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
    const closeCard= (item)=>{
	console.debug("CLOOOOOOOOOOOOOOSE",item);
	console.debug(props);
	props.closeCard(props.fips)
	
    }

    let state=props.abbrev
    const { loading, error, data } = useQuery(APOLLO_QUERY,{ variables: { state }});
    let sparkData=[];
    let sparkMin=203;
    let sparkMax=219;
    if(data) {
	console.debug("foo");
	console.debug(data)
	sparkData=data.fiscal_revenue_summary.map((item,i)=>[item.fiscal_year, item.sum]);
	console.debug(sparkData);
	sparkMin=sparkData[0][0];
	sparkMax=sparkData[sparkData.length-1][0];
    }
    return (
	   <Card className={classes.card}>
	     <CardContent>
		 <Toolbar variant="dense">
		   <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
		     <MenuIcon />
		   </IconButton>
		   <Typography variant="h6" color="inherit">
		     {props.name}
		   </Typography>
	    <CloseIcon  className={classes.close} onClick={(e,i)=>{console.debug("eeeee", e); console.debug(i); closeCard(i)}}/>
		 </Toolbar>
	    
	{/*<Typography variant="h5" component="h2">
	    {props.name}
            </Typography>*/}
	    
	    <Typography className={classes.title} color="textSecondary" gutterBottom>
	    Trend ({sparkMin} - {sparkMax} )
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
	    {sparkData && <Sparkline data={sparkData} />}
        </Typography>
        <Typography variant="body2" component="p">
	    
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
	    </Card>

  );
}
