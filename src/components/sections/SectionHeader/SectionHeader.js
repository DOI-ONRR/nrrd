import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import Link from '../../../components/Link'
import { LocationLink } from '../../../components/layouts/LocationLink'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const useStyles = makeStyles(theme => ({
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 426px)': {
      display: 'block',
    }
  },
  titleLink: {
    fontSize: '1.2rem',
    marginBottom: 0,
    marginLeft: theme.spacing(2.5),
    fontWeight: 'normal',
    height: 24,
    '@media (max-width: 426px)': {
      display: 'block',
      width: '100%',
    },
    '& span': {
      marginRight: 0,
    },
  },
  linkWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
  }
}))

const SectionHeader = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const {
    linkLabel,
    showLinks,
    title
  } = props
  const { dataType } = filterState
  const classes = useStyles()
  // capitalize first letter for query link param
  const niceLabel = linkLabel.charAt(0).toUpperCase() + linkLabel.slice(1) || title.charAt(0).toUpperCase() + title.slice(1)
  let dataTypeLabel
  switch (dataType) {
  case DFC.REVENUE:
    dataTypeLabel = DFC.REVENUE
    break
  case DFC.DISBURSEMENT:
    dataTypeLabel = DFC.DISBURSEMENT
    break
  case DFC.PRODUCTION:
    dataTypeLabel = DFC.PRODUCTION
    break
  default:
    break
  }
  return (
    <>
      <Box color="secondary.main" mb={2} borderBottom={2} pb={1} className={classes.titleBar}>
        <Box component="h3" m={0} color="primary.dark">{title}</Box>
        {showLinks &&
          <Box className={classes.linkWrap}>
            <Box component="span" className={classes.titleLink}>
              <Link
                href={`/query-data?dataType=${ niceLabel }`}
                linkType="FilterTable"
                mt={0}>
                Query {props.linkLabel || props.title} data
              </Link>
            </Box>
            <Box component="span" className={classes.titleLink}>
              <LocationLink
                linkTitle={`${ dataTypeLabel } by location`}
                linkUrl={`/explore?dataType=${ dataTypeLabel }`}
              />
            </Box>
          </Box>
        }
      </Box>
    </>
  )
}

export default SectionHeader

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired
}
