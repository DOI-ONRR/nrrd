import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  Paper,
  Slide,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core'

import MinimizeIcon from '@material-ui/icons/Minimize'
import CloseIcon from '@material-ui/icons/Close'

import Sparkline from '../../data-viz/Sparkline'

import utils from '../../../js/utils'

import { StoreContext } from '../../../store'

import CONSTANTS from '../../../js/constants'


const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '20px'
  },
  card: {
    width: 285,
    margin: '10px',
    position: 'absolute',
    right: 0,
    transform: 'translate3d(0, 0px, 0px)',
    minHeight: 325,
    '@media (max-width: 768px)': {
      width: '100%',
      height: 'auto',
    },
  },
  cardMinimized: {
    minHeight: 0,
    position: 'absolute',
    bottom: -20,
    width: 285,
    '& .MuiCardContent-root': {
      padding: 0,
    }
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    padding: 10,
    height: 40,
    fontSize: '1.2rem',
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
  },
  cardHeaderContent: {
    fontSize: theme.typography.h4.fontSize,
  },
  close: {
    position: 'relative',
    top: -3,
    right: '10px',
    cursor: 'pointer',
    maxWidth: 20,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  menuButton: {
    marginRight: '4px'
  },
}))

const SummaryCards = props => {
  const classes = useStyles()
  const {state,dispatch } = useContext(StoreContext)
  const cards = state.cards
  
  const year = state.year

  const [minimized, setMinimized] = useState(true)
  const closeCard = item => {
    dispatch({ type: 'CARDS', payload: { cards: cards.filter(item => item.fips !== props.fips) } })

  }

  const minimizeCard = item => {
    setMinimized(!minimized)
  }

  const minimizeIcon = Object.is(props.minimizeIcon, undefined)
    ? false
    : props.minimizeIcon
  const closeIcon = Object.is(props.closeIcon, undefined)
    ? true
    : props.closeIcon


  return (
      <>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <Card className={clsx(classes.card, minimizeIcon && { minimized: !minimized }, { [classes.cardMinimized]: !minimized })}>
       <CardHeader
              title={props.name}
              action={
                <>
                  {minimizeIcon && (
                    <MinimizeIcon
                      className={classes.close}
                      onClick={(e, i) => {
                        minimizeCard(i)
                      }}
                      key={state}
                    />
                  )}
                  {closeIcon && (
                    <CloseIcon
                      className={classes.close}
                      onClick={(e, i) => {
                        closeCard(i)
                      }}
                    />
                  )}
                </>
              }
              classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
              disableTypography
            >
              <Typography variant="h4" color="inherit">
                {props.name}
              </Typography>
            </CardHeader>
       
            <CardContent>
              {props.children}
            </CardContent>
          </Card>
        </Slide>
      </>
    )
}



export default SummaryCards
