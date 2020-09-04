import React, { useContext } from 'react'

import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  MenuItem
} from '@material-ui/core'

import { ExploreDataContext } from '../../../stores/explore-data-store'
import SearchLocationsInput from '../../inputs/SearchLocationsInput'

const useStyles = makeStyles(theme => ({
  root: {},
  addLocationCard: {
    background: `${ theme.palette.grey['100'] }`,
    '& div:nth-child(1)': {
      background: `${ theme.palette.grey['100'] } !important`,
      '& > span': {
        color: `${ theme.palette.common.black } !important`,
      }
    },
    '& .MuiCardContent-root div': {
      textAlign: 'left',
    }
  },
  cardButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& .MuiButton-root': {
      marginRight: theme.spacing(2),
    },
  },
  addCardButtonContainer: {
    marginTop: theme.spacing(2),
    '& button': {
      padding: theme.spacing(0.5),
      color: theme.palette.common.black,
      backgroundColor: theme.palette.common.white,
      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    '@media (max-width: 768px)': {
      textAlign: 'left',
    }
  },
  cardHeader: {
    padding: 10,
    height: 75,
    fontSize: '1.2rem',
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
  },
  cardHeaderContent: {
    fontSize: theme.typography.h3.fontSize,
  },
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
  verticalMenuItems: {
    display: 'flex',
    flexDirection: 'column',
  }
}))

const AddLocationCard = props => {
  const classes = useStyles()
  const { state: pageState } = useContext(ExploreDataContext)

  const { cards } = pageState

  const {
    cardMenuItems,
    onLink
  } = props

  const handleClose = (index, item) => event => {
    if (typeof item !== 'undefined') {
      onLink(item)
    }
  }

  return (
    <Card className={classes.addLocationCard}>
      <CardHeader
        title={props.title}
        classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
        disableTypography
      />
      <CardContent>
        <SearchLocationsInput onLink={onLink} />
      </CardContent>
      <CardActions>
        {cardMenuItems &&
          <Box className={classes.verticalMenuItems}>
            {
              cardMenuItems.map((item, i) =>
                <MenuItem
                  disabled={cards.some(c => c.locationName === item.location_name)}
                  key={i}
                  onClick={handleClose(i, item)}>
                  {item.label}
                </MenuItem>
              )
            }
          </Box>
        }
      </CardActions>
    </Card>
  )
}

export default AddLocationCard

AddLocationCard.propTypes = {
  // Title of location card
  title: PropTypes.string
}
