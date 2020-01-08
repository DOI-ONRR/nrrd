import React, { Fragment, useState, useContext } from "react"
//import { Link } from "gatsby"

import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import Fade from "@material-ui/core/Fade"




import StackedBarChart from "../../data-viz/StackedBarChart"

import { StoreContext } from "../../../store"
import { ThemeConsumer } from "styled-components"

const TotalRevenue = (props) => {

    let data=[
	{"X1": [{"Y1": 11, "Y2": 130, "Y3": 18, "Y4": 20, "Y5": 24,"Y6": 25,"Y7": 27
		}
	       ]},
	{"X2": [{"Y1": 10, "Y2": 14, "Y3": 16, "Y4": 260, "Y5": 24,"Y6": 25,"Y7": 27}]},
	{"X3": [{"Y1": 11, "Y2": 16, "Y3": 180, "Y4": 22, "Y5": 24,"Y6": 25,"Y7": 27}]},
	{"X4": [{"Y1": 14, "Y2": 16, "Y3": 20, "Y4": 24, "Y5": 240,"Y6": 25,"Y7": 27}]},
	{"X5": [{"Y1": 100, "Y2": 12, "Y3": 15, "Y4": 22, "Y5": 24,"Y6": 25,"Y7": 27}]},
	{"X6": [{"Y1": 13, "Y2": 16, "Y3": 19, "Y4": 25, "Y5": 24,"Y6": 25,"Y7": 270}]}
    ];

     return (
    <Box >
      <Grid container spacing={4}>
        <Grid item xs>
	     <StackedBarChart data={data} selected={4}
	     />
         </Grid>
      </Grid>
    </Box>
     )
}

export default TotalRevenue
