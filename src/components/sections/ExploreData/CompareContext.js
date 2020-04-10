import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import CONSTANTS from '../../../js/constants'
import utils from '../../../js/utils'

// import PageScrollTo from '../../navigation/PageScrollTo'
import AddLocationCard from './AddLocationCard'
import LocationTotal from './LocationTotal'

import { StoreContext } from '../../../store'

import {
  Box,
  Container,
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  compareCards: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: theme.spacing(5),
    overflow: 'auto',
    '& media (max-width: 768px)': {
      display: 'relative',
    },
    '& > div': {
      marginRight: theme.spacing(1),
      minWidth: 275,
    },
    '& > div:last-child': {
      margin: theme.spacing(1),
      maxWidth: '25%',
      width: '100%',
      position: 'relative',
      minWidth: 275,
      '@media (max-width: 768px)': {
        maxWidth: '100%',
      }
    },
  },
}))

// create sub menu
const createSubMenu = () => {
  const mainElem = document.getElementsByTagName('main')
  const h3Items = Array.from(mainElem[0].querySelectorAll('h3'))
  const subMenu = []
  h3Items.forEach(item => subMenu.push(item.innerHTML))

  return subMenu
}


const CompareContext = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const cards = state.cards
  const year = state.year

  let periodData
  let landStatsData

  console.debug("children: ", props.children, props)
  return (
    <Container>
      <Grid container>
        <Grid item md={12}>
          <Box mt={4} mb={2}>
          </Box>
        </Grid> 
      </Grid>

      <Grid container>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h3" color="secondary.dark">{props.title}</Box>
          </Box>
          <Box fontSize="body1.fontSize">
                Add more than one card to compare.  Select states, counties, and offshore regions.
          </Box>
          {/* <Box fontSize="body1.fontSize">
            { cards.length > 0 &&
              <Box>You currently have {cards.length > 0 ? 'the following cards selected.' : 'no cards selected.'}</Box>
            }
          </Box> */}
        </Grid>
      </Grid>


      <Box className={classes.compareCards}>
        {  //props.children 
          cards.map((card, i) => {
            return (
              React.cloneElement(props.children[0], {
                 key:i,
                fips: card.fips,
                abbr: card.abbr,
                name: card.name,
                state: card.state,
                cardTitle: card.name,
                stateAbbr: card.abbr

              })
              
            )
          })
        }
        {/* (cards.length >= 0 && cards.length <= CONSTANTS.MAX_CARDS) ? <AddLocationCard title='Add another card' onLink={onLink} cardMenuItems={cardMenuItems} /> : '' */}
      </Box>
    </Container>
  )
}

export default CompareContext
