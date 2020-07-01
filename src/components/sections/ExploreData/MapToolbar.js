import React, { useContext, useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from '@reach/router'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Hidden,
  Menu,
  MenuList,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@material-ui/core'

import MapIcon from '@material-ui/icons/Map'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AddIcon from '@material-ui/icons/Add'

// import MapSelectControl from './MapSelectControl'
// import MapToolbarSelect from '../../inputs/MapToolbarDataTypeSelect'
// import MapControlSwitch from '../../inputs/MapControlSwitch'
import MapControlToggle from '../../inputs/MapControlToggle'
import CONSTANTS from '../../../js/constants'

import {
  DataTypeSelectInput,
  PeriodSelectInput,
  CommoditySelectInput,
  OffshoreRegionSwitchInput
} from '../../inputs'

// import OffshoreSwitch from '../../inputs/OffshoreSwitch'

import { StoreContext } from '../../../store'
import { DataFilterContext } from '../../../stores/data-filter-store'

import {
  COMMODITY,
  COUNTIES,
  COUNTY,
  DATA_FILTER_CONSTANTS as DFC,
  DATA_TYPE,
  DISBURSEMENT,
  PERIOD,
  PRODUCTION,
  REVENUE,
  US_STATE,
  OFFSHORE_REGIONS
} from '../../../constants'

const useStyles = makeStyles(theme => ({
  toolbar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: 0,
    zIndex: 250,
    background: theme.palette.background.paper,
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    '@media (max-width: 1120px)': {
      position: 'relative',
      width: '100%',
      background: theme.palette.common.white,
      zIndex: 89,
    },
    '& h2': {
      marginTop: theme.spacing(1),
      fontSize: '1rem',
      lineHeight: 'inherit',
    },
    '& label': {
      marginTop: 0,
    },
    '& label span': {
      margin: 0,
      '@media (max-width: 1120px)': {
        fontSize: '.85rem',
        lineHeight: '.85rem',
      }
    },
  },
  toolbarControls: {
    display: 'flex',
    justifyContent: 'flex-start',
    transition: 'height .4s ease',
    background: 'transparent',
    '@media (max-width: 768px)': {
      justifyContent: 'flex-start',
      width: '100%',
      overflowX: 'auto',
    },
  },
  toolbarPageControls: {
    display: 'flex',
    marginTop: theme.spacing(0.5),
  },
  mapExploreMenu: {
    position: 'absolute',
    right: 10,
    top: 12,
    zIndex: 99,
    '@media (max-width: 1120px)': {
      position: 'relative',
      width: '100%',
      top: 'inherit',
      right: 'inherit',
    },
    '& svg': {
      color: theme.palette.links.default,
    },
    '& button': {
      color: theme.palette.grey[700],
      border: `1px solid ${ theme.palette.grey[300] }`,
      backgroundColor: theme.palette.common.white,
      borderRadius: 0,
      fontSize: theme.typography.h4.fontSize,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .15)',
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: theme.spacing(0.5),
      height: 50,
      minWidth: 50,
    },
    '& button:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    }
  },
  mapMenuRoot: {
    position: 'relative',
    top: -2,
    border: `1px solid ${ theme.palette.grey['300'] }`,
    height: 60,
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 0,
    background: 'white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .15)',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 150,
    zIndex: 99,
    fontSize: theme.typography.body2,
    '& .MuiTypography-root': {
      fontSize: '1.2rem',
      lineHeight: '1.2rem',
    },
    '& *': {
      margin: 0,
      height: '100%',
    },
    '& nav, & nav > div': {
      paddingTop: 0,
      paddingBottom: 0,
      height: '100%',
    }
  },
  mobileToolbar: {
    position: 'relative',
    zIndex: 99,
    boxShadow: '0 3px 6px 0 hsla(0,0%,57%,.23)',
    overflowX: 'auto',
    height: 60,
    '& div': {
      height: 60,
    },
    '@media (max-width: 320px)': {
      overflowY: 'hidden',
    },
  },
  botNavRoot: {
    color: theme.palette.grey[700],
    height: 60,
  },
  botNavSelected: {
    color: theme.palette.links.default,
    '& svg': {
      fill: theme.palette.links.default,
    }
  },
  botNavNotSelected: {
    color: theme.palette.grey[700],
    '& svg': {
      fill: theme.palette.grey[700],
    }
  },
  tooltipRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  mapControls: {
    // border: '2px solid deeppink',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeft: `1px solid ${ theme.palette.grey[400] }`,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    '& fieldset:first-child': {
      marginTop: 0,
    },
    '& fieldset:last-child': {
      marginTop: theme.spacing(3),
    },
    '& div:first-child': {
      marginTop: 0,
      marginRight: theme.spacing(4),
    },
  }
}))

const MAP_TOOLBAR_OPTIONS = {
  [DATA_TYPE]: [
    { value: REVENUE, option: 'Revenue' },
    { value: PRODUCTION, option: 'Production' },
    { value: DISBURSEMENT, option: 'Disbursements' },
  ],
  [PERIOD]: [
    { value: CONSTANTS.FISCAL_YEAR, option: 'Fiscal year' },
    // { value: CONSTANTS.CALENDAR_YEAR, option: 'Calendar year' },
    // { value: CONSTANTS.MONTHLY, option: 'Monthly' }
  ],
  [COUNTIES]: [
    { value: US_STATE, option: 'State' },
    { value: COUNTY, option: 'County' }
  ],
  [OFFSHORE_REGIONS]: [
    { value: false, option: '' },
    { value: true, option: '' }
  ]
}

// Map explore menu speed dial
// const MapExploreMenu = props => {
//   const classes = useStyles()
//   const [anchorEl, setAnchorEl] = useState(null)

//   const theme = useTheme()
//   const matchesMdLgUp = useMediaQuery('(max-width:1120px)')

//   const handleMenuClick = event => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = index => event => {
//     setAnchorEl(null)
//     navigate(props.linkUrls[index])
//   }

//   return (
//     <div className={classes.mapExploreMenu}>
//       {!matchesMdLgUp &&
//         <>
//           <Tooltip title='Explore more' classes={{ tooltip: classes.tooltipRoot }}>
//             <IconButton
//               aria-label='Other ways to explore data'
//               aria-controls='other-ways-to-explore-data'
//               aria-haspopup='true'
//               onClick={handleMenuClick}>
//               <MoreVertIcon />
//             </IconButton>
//           </Tooltip>
//           <Menu
//             id='other-ways-to-explore-data'
//             anchorEl={anchorEl}
//             keepMounted
//             open={Boolean(anchorEl)}
//             onClose={handleClose(null)}
//           >
//             {
//               props.linkLabels.map((item, i) => <MenuItem key={i} onClick={handleClose(i)}>{item}</MenuItem>)
//             }
//           </Menu>
//         </>
//       }
//       {matchesMdLgUp &&
//       <>
//         <Paper>
//           <MenuList>
//             {
//               props.linkLabels.map((item, i) => <MenuItem key={i} onClick={handleClose(i)}>{item}</MenuItem>)
//             }
//           </MenuList>
//         </Paper>
//       </>
//       }
//     </div>
//   )
// }

// Map toolbar
const MapToolbar = props => {
  const { cardMenuItems, onLink } = props

  // const data = useStaticQuery(graphql`
  //   query CommodityQuery {
  //     onrr {
  //       production_commodity: fiscal_production_summary(where: {commodity: {_neq: ""}}, distinct_on: commodity) {
  //         commodity
  //       }
  //       revenue_commodity: revenue_commodity_summary(where: {commodity: {_neq: ""}}, distinct_on: commodity) {
  //         commodity
  //       }
  //     }
  //   }
  // `)

  // const productionCommodityOptions = data.onrr.production_commodity.map(item => item.commodity)
  // const revenueCommodityOptions = data.onrr.revenue_commodity.map(item => item.commodity)
  const classes = useStyles()

  const theme = useTheme()
  // const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const matchesMdLgUp = useMediaQuery('(max-width:1120px)')

  const [navValue, setNavValue] = useState(null)
  const [menu, setMenu] = useState({
    showMapTools: false,
    showSearch: false,
    showExplore: false,
  })

  const { state: filterState } = useContext(DataFilterContext)
  const { state: pageState } = useContext(StoreContext)

  const cards = pageState.cards

  // add locations
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (index, item) => event => {
    setAnchorEl(null)
    if (typeof item !== 'undefined') {
      onLink(item)
    }
  }

  const {
    dataType,
    period,
    commodity,
    counties,
    offshoreRegion
  } = filterState

  return (
    <>
      { matchesMdLgUp &&
        <Box className={classes.mobileToolbar}>
          <BottomNavigation
            value={navValue}
            onChange={(event, newValue) => {
              setNavValue(newValue)
              switch (newValue) {
              case 0:
                setMenu({ ...menu, showMapTools: !menu.showMapTools, showSearch: false, showExplore: false })
                !menu.showMapTools || setNavValue(null)
                break
              case 1:
                setAnchorEl(newValue)
                setMenu({ ...menu, showSearch: !menu.showSearch, showExplore: false, showMapTools: false })
                !menu.showSearch || setNavValue(null)
                break
              case 2:
                setMenu({ ...menu, showExplore: !menu.showExplore, showMapTools: false, showSearch: false })
                !menu.showExplore || setNavValue(null)
                break
              default:
                break
              }
            }}
            showLabels
            className={classes.root}
          >
            <BottomNavigationAction
              label='Map tools'
              icon={<MapIcon />}
              classes={{
                root: classes.botNavRoot,
                selected: classes.botNavSelected
              }} />

            <BottomNavigationAction
              label='Add locations'
              icon={<AddIcon />}
              classes={{
                root: classes.botNavRoot,
                selected: classes.botNavSelected
              }} />

            <BottomNavigationAction
              label='Explore more'
              icon={<MoreVertIcon />}
              classes={{
                root: classes.botNavRoot,
                selected: classes.botNavSelected
              }} />
          </BottomNavigation>
        </Box>
      }

      <Box className={classes.toolbar}>
        {(menu.showMapTools || !matchesMdLgUp) &&
          /* Map toolbar selections */
          <Box className={classes.toolbarControls}>
            <Box className={classes.toolbarPageControls}>
              <DataTypeSelectInput
                dataFilterKey={dataType}
                data={MAP_TOOLBAR_OPTIONS[DATA_TYPE]}
                defaultSelected={ dataType || REVENUE }
                label='Data type'
                selectType='Single'
                showClearSelected={false} />

              <PeriodSelectInput
                dataFilterKey={PERIOD}
                data={MAP_TOOLBAR_OPTIONS[PERIOD]}
                defaultSelected='Fiscal year'
                label='Period'
                selectType='Single'
                showClearSelected={false} />

              {(dataType === 'Revenue') &&
              <CommoditySelectInput
                dataFilterKey={COMMODITY}
                data={revenueCommodityOptions}
                defaultSelected={commodity}
                defaultSelectAll={typeof commodity === 'undefined'}
                label='Commodity'
                selectType='Multi'
                helperText='' />
              }

              {(dataType === 'Production') &&
              <CommoditySelectInput
                dataFilterKey={COMMODITY}
                data={productionCommodityOptions}
                defaultSelected={commodity || 'Oil (bbl)'}
                label='Commodity'
                selectType='Single'
                showClearSelected={false} />
              }
            </Box>

            <Box className={classes.mapControls}>
              <MapControlToggle
                dataFilterKey={COUNTIES}
                defaultSelected={counties || US_STATE}
                data={MAP_TOOLBAR_OPTIONS[COUNTIES]}
                label="Map level toggle" />

              <OffshoreRegionSwitchInput
                dataFilterKey={OFFSHORE_REGIONS}
                data={MAP_TOOLBAR_OPTIONS[OFFSHORE_REGIONS]}
                defaultSelected={offshoreRegion}
                label='Show offshore'
                helperText=''
                disabled={dataType === 'Disbursements'}
                selectType='Single' />

            </Box>
          </Box>
        }

        {/* add Nationwide Federal and Native American cards menu */}
        {menu.showSearch &&
          <Box>
            {cardMenuItems &&
              cardMenuItems.map((item, i) => <MenuItem disabled={cards.some(c => c.abbr === item.name)} key={i} onClick={handleClose(i, item)}>{item.label}</MenuItem>)
            }
          </Box>
        }

        { /* other ways to explore menu */ }
        {(menu.showExplore || !matchesMdLgUp) &&
            <Box>
              {dataType === REVENUE &&
                  <MapExploreMenu
                    linkLabels={['Query revenue data', 'Downloads & Documentation', 'How revenue works', 'Revenue by company']}
                    linkUrls={['/query-data/?dataType=Revenue', '/downloads/#Revenue', '/how-revenue-works/#revenues', '/how-revenue-works/federal-revenue-by-company/2018/']}
                  />
              }
              {dataType === DISBURSEMENT &&
                  <MapExploreMenu
                    linkLabels={['Query disbursements data', 'Downloads & Documentation', 'How disbursements works']}
                    linkUrls={['/query-data/?dataType=Disbursements', '/downloads/#Disbursements', '/how-revenue-works/#understanding-federal-disbursements']}
                  />
              }
              {dataType === PRODUCTION &&
                  <MapExploreMenu
                    linkLabels={['Query production data', 'Downloads & Documentation', 'How production works']}
                    linkUrls={['/query-data/?dataType=Production', '/downloads/#Production', '/how-revenue-works/#the-production-process']}
                  />
              }
            </Box>
        }
      </Box>
    </>
  )
}

export default MapToolbar
