import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const stateData = [
  { name: "Alabama", href: "https://revenuedata.doi.gov/explore/states/AL/" },
  { name: "Alaska", href: "https://revenuedata.doi.gov/explore/states/AK/" },   
  { name: "Arkansas", href: "https://revenuedata.doi.gov/explore/states/AR/" },
  { name: "California", href: "https://revenuedata.doi.gov/explore/states/CA/" },
  { name: "Colorado", href: "https://revenuedata.doi.gov/explore/states/CO/" },
  { name: "Florida", href: "https://revenuedata.doi.gov/explore/states/FL/"},
  { name: "Idaho", href: "https://revenuedata.doi.gov/explore/states/ID/" }, 
  { name: "Illinois", href: "https://revenuedata.doi.gov/explore/states/IL/" },
  { name: "Indiana", href: "https://revenuedata.doi.gov/explore/states/IN/" },
  { name: "Kansas", href: "https://revenuedata.doi.gov/explore/states/KS/" },
  { name: "Louisiana", href: "https://revenuedata.doi.gov/explore/states/LA/" },
  { name: "Maryland", href: "https://revenuedata.doi.gov/explore/states/MD/" },
  { name: "Michigan", href: "https://revenuedata.doi.gov/explore/states/MI/" },
  { name: "Minnesota", href: "https://revenuedata.doi.gov/explore/states/MN/" },
  { name: "Mississippi", href: "https://revenuedata.doi.gov/explore/states/MS/" },
  { name: "Missouri", href: "https://revenuedata.doi.gov/explore/states/MO/" },
  { name: "Montana", href: "https://revenuedata.doi.gov/explore/states/MT/" },
  { name: "Nebraska", href: "https://revenuedata.doi.gov/explore/states/NE/" },
  { name: "Nevada", href: "https://revenuedata.doi.gov/explore/states/NV/" },
  { name: "New Mexico", href: "https://revenuedata.doi.gov/explore/states/NM/" },
  { name: "New York", href: "https://revenuedata.doi.gov/explore/states/NY/" },
  { name: "North Carolina", href: "https://revenuedata.doi.gov/explore/states/NC/" },
  { name: "North Dakota", href: "https://revenuedata.doi.gov/explore/states/ND/" },
  { name: "Ohio", href: "https://revenuedata.doi.gov/explore/states/OH/" },
  { name: "Oklahoma", href: "https://revenuedata.doi.gov/explore/states/OK/" },
  { name: "Oregon", href: "https://revenuedata.doi.gov/explore/states/OR/" },
  { name: "Pennsylvania", href: "https://revenuedata.doi.gov/explore/states/PA/" },
  { name: "South Carolina", href: "https://revenuedata.doi.gov/explore/states/SC/" },
  { name: "South Dakota", href: "https://revenuedata.doi.gov/explore/states/SD/" },
  { name: "Texas", href: "https://revenuedata.doi.gov/explore/states/TX/" },
  { name: "Utah", href: "https://revenuedata.doi.gov/explore/states/UT/" },
  { name: "Virginia", href: "https://revenuedata.doi.gov/explore/states/VA/" },
  { name: "Washington", href: "https://revenuedata.doi.gov/explore/states/WA/" },
  { name: "West Virginia", href: "https://revenuedata.doi.gov/explore/states/WV/" },
  { name: "Wisconsin", href: "https://revenuedata.doi.gov/explore/states/WI/" },
  { name: "Wyoming", href: "https://revenuedata.doi.gov/explore/states/WY/" },
];

const useStyles = makeStyles((theme) =>({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
  button: {
    minWidth: '200px',
    marginBottom: theme.spacing(2),
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
  },
  container: {
    marginTop: theme.spacing(20),
  },
}));

const DatabyStateButtons = () => {
  const classes = useStyles ();

  return (
    <div className={classes.root}>
      {stateData.map((state, index) => (
        <Button
          key={index}
          className={classes.button}
          variant="contained"
          color="primary"
          href={state.href}
        >
          {state.name}
        </Button>
      ))}
    </div>
  );
}

export default DatabyStateButtons