import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const useStyles = makeStyles(theme => ({
}))

const CardTitle = props => {

  console.log('CardTitle props: ', props)

  const card = props.card
  const cardType= props.cardType

  let cardTitle
  
  switch (card.regionType) {
    case 'State':
      cardTitle = `${ card.name }, ${ DFC.USA }`
      break
    case 'County':
      cardTitle = `${ card.county } ${ card.regionType }, ${ card.abbr }`
      break
    case 'Offshore': 
      cardTitle = 'Offshore yo'
      break
    default:
      cardTitle = card.name
      break
  }

  return (
    <Box component="span">
      {cardTitle}
    </Box>
  )
}

export default CardTitle