import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@mui/material/Button'



// const rows = [
//   createData(<a href="https://revenuedata.doi.gov/explore/states/AL/">Alabama</a>, <a href="https://revenuedata.doi.gov/explore/states/KS/">Kansas</a>, <a href="https://revenuedata.doi.gov/explore/states/NM/">New Mexico</a>, <a href="https://revenuedata.doi.gov/explore/states/TX/">Texas</a>),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/AK/">Alaska</a>, <a href="https://revenuedata.doi.gov/explore/states/LA/">Louisiana</a>, <a href="https://revenuedata.doi.gov/explore/states/NY/">New York</a>, <a href="https://revenuedata.doi.gov/explore/states/UT/">Utah</a>),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/AZ/">Arizona</a>, <a href="https://revenuedata.doi.gov/explore/states/MD/">Maryland</a>, <a href="https://revenuedata.doi.gov/explore/states/NC/">North Carolina</a>, <a href="https://revenuedata.doi.gov/explore/states/VA/">Virginia</a>),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/AR/">Arkansas</a>, <a href="https://revenuedata.doi.gov/explore/states/MI/">Michigan</a>, <a href="https://revenuedata.doi.gov/explore/states/ND/">North Dakota</a>, <a href="https://revenuedata.doi.gov/explore/states/WA/">Washington</a>),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/CA/">California</a>, <a href="https://revenuedata.doi.gov/explore/states/MN/">Minnesota</a>, <a href="https://revenuedata.doi.gov/explore/states/OH/">Ohio</a>, <a href="https://revenuedata.doi.gov/explore/states/WV/">West Virginia</a>),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/CO/">Colorado</a>, <a href="https://revenuedata.doi.gov/explore/states/MS/">Mississippi</a>, <a href="https://revenuedata.doi.gov/explore/states/OK/">Oklahoma</a>, <a href="https://revenuedata.doi.gov/explore/states/WI/">Wisconsin</a>),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/FL/">Florida</a>, <a href="https://revenuedata.doi.gov/explore/states/MO/">Missouri</a>, <a href="https://revenuedata.doi.gov/explore/states/OR/">Oregon</a>, <a href="https://revenuedata.doi.gov/explore/states/WY/">Wyoming</a>),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/ID/">Idaho</a>, <a href="https://revenuedata.doi.gov/explore/states/MT/">Montana</a>, <a href="https://revenuedata.doi.gov/explore/states/PA/">Pennsylvania</a>, ),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/IL/">Illinois</a>, <a href="https://revenuedata.doi.gov/explore/states/NE/">Nebraska</a>, <a href="https://revenuedata.doi.gov/explore/states/SC/">South Carolina</a>, ),
//   createData(<a href="https://revenuedata.doi.gov/explore/states/IN/">Indiana</a>, <a href="https://revenuedata.doi.gov/explore/states/NV/">Nevada</a>, <a href="https://revenuedata.doi.gov/explore/states/SD/">South Dakota</a>, ),

// const stateData = [
//   [
//       {
//           state: "Alabama",
//           href: "https://revenuedata.doi.gov/explore/states/AL/"
//       }
//   ],
//   [
//       {
//         state: "Alaska"
//         href: "https://revenuedata.doi.gov/explore/states/AK/"
//       }
//   ],
//   [
//       {
//         state: "Arkansas"
//         href: "https://revenuedata.doi.gov/explore/states/AR/"
//       }
//   ],
//   [
//       {
//         state: "California"
//         href: "https://revenuedata.doi.gov/explore/states/CA/"
//       }
//   ],
//   [
//       {
//         state: "Colorado"
//         href: "https://revenuedata.doi.gov/explore/states/CO/"
//       }
//   ],
//   [
//       {
//         state: "Florida"
//         href: "https://revenuedata.doi.gov/explore/states/FL/"
//       }
//   ],
//   [
//       {
//         state: "Idaho"
//         href: "https://revenuedata.doi.gov/explore/states/ID/"
//       }
//   ],
//   [
//       {
//         state: "Illinois"
//         href: "https://revenuedata.doi.gov/explore/states/IL/"
//       }
//   ],
//   [
//       {
//         state: "Indiana"
//         href: "https://revenuedata.doi.gov/explore/states/IN/"
//       }
//   ],
//   [
//       {
//         state: "Kansas"
//         href: "https://revenuedata.doi.gov/explore/states/KS/"
//       }
//   ],
//   [
//       {
//         state: "Louisiana"
//         href: "https://revenuedata.doi.gov/explore/states/LA/"
//       }
//   ],
//   [
//       {
//         state: "Maryland"
//         href: "https://revenuedata.doi.gov/explore/states/MD/"
//       }
//   ],
//   [
//       {
//         state: "Michigan-EndC1"
//         href: "https://revenuedata.doi.gov/explore/states/MI/"
//       }
//   ],
//   [
//       {
//         state: "Minnesota"
//         href: "https://revenuedata.doi.gov/explore/states/MN/"
//       }
//   ],
//   [
//       {
//         state: "Mississippi"
//         href: "https://revenuedata.doi.gov/explore/states/MS/"
//       }
//   ],
//   [
//       {
//         state: "Missouri"
//         href: "https://revenuedata.doi.gov/explore/states/MO/"
//       }
//   ],
//   [
//       {
//         state: "Montana"
//         href: "https://revenuedata.doi.gov/explore/states/MT/"
//       }
//   ],
//   [
//       {
//         state: "Nebraska"
//         href: "https://revenuedata.doi.gov/explore/states/NE/"
//       }
//   ],
//   [
//       {
//         state: "Nevada"
//         href: "https://revenuedata.doi.gov/explore/states/NV/"
//       }
//   ]
// ];


// function FormRow(stateDataRow) {
//     return (
//         <React.Fragment>
//             for (const state in stateDataRow) {
//                 <Grid item xs={4}>
//                    <a href={state.href}>{state.name}</a>
//                 </Grid>
//             }
//         </React.Fragment>
//     );
//   }

  return (
    <div className={classes.root}>
      <div sx={{display:"flex"}}>

        <Button>Hello</Button>
        <Button>Hello</Button>
        <Button>Hello</Button>
        <Button>Hello</Button>
      </div>
        {/* <Grid container spacing={1}>
            for (const row in stateData) {
                <Grid container item xs={12} spacing={3}>
                    <FormRow  stateDataRow={row}/>
                </Grid>
            }
        </Grid> */}
    </div>
  );

export default DatabyStateButtons