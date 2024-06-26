import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// not used import { navigate } from '@reach/router'

import { makeStyles, withStyles, createStyles, useTheme } from '@material-ui/core/styles'
import { Typography, Box, Tabs, Tab } from '@material-ui/core'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const DefaultTab = ({ theme, ...restProps }) => {
  const EnhancedComponent = withStyles(() => {
    return createStyles({
      root: {
        background: theme.palette.primary.main,
        borderTop: `5px solid ${ theme.palette.primary.main }`,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        color: theme.palette.primary.dark,
        textTransform: 'capitalize',
        minHeight: 60,
        fontSize: theme.typography.h4.fontSize,
        '& span:hover': {
          textDecoration: 'underline',
        },
        '@media (max-width: 500px)': {
          marginLeft: 0,
          width: '100%',
          display: 'block',
          minWidth: '100%',
          '-moz-box-shadow': 'inset  0 -10px 10px -15px grey',
          '-webkit-box-shadow': 'inset  0 -10px 10px -15px grey',
          'box-shadow': 'inset  0 -10px 10px -15px grey',
        },
      },
      selected: {
        borderTop: `5px solid ${ theme.palette.primary.dark }`,
        borderBottom: `1px solid ${ theme.palette.background.default }`,
        borderLeft: `1px solid ${ theme.palette.primary.dark }`,
        borderRight: `1px solid ${ theme.palette.primary.dark }`,
        fontWeight: 'bold',
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.background.default,
        zIndex: 10,
      },
    })
  })(Tab)

  return <EnhancedComponent {...restProps} />
}

const ProcessCardTab = ({ theme, ...restProps }) => {
  const EnhancedComponent = withStyles(() => {
    return createStyles({
      root: {
        background: theme.palette.primary.main,
        borderTop: `1px solid ${ theme.palette.primary.dark }`,
        borderRight: `1px solid ${ theme.palette.primary.dark }`,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        color: theme.palette.primary.dark,
        textTransform: 'capitalize',
        minHeight: 60,
        minWidth: 'fit-content',
        fontSize: 16,
        '& span:hover': {
          textDecoration: 'underline',
        },
        '@media (max-width: 500px)': {
          marginLeft: 0,
          width: '100%',
          display: 'block',
          minWidth: '100%',
          '-moz-box-shadow': 'inset  0 -10px 10px -15px grey',
          '-webkit-box-shadow': 'inset  0 -10px 10px -15px grey',
          'box-shadow': 'inset  0 -10px 10px -15px grey',
        },
      },
      selected: {
        borderTop: `5px solid ${ theme.palette.primary.dark }`,
        borderBottom: `1px solid ${ theme.palette.background.default }`,
        borderLeft: `1px solid ${ theme.palette.primary.dark }`,
        borderRight: `1px solid ${ theme.palette.primary.dark }`,
        fontWeight: 'bold',
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.background.default,
        zIndex: 10,
      },
    })
  })(Tab)

  return <EnhancedComponent {...restProps} />
}

const useStyles = makeStyles(theme => ({
  tabsRoot: {},
  tabsFlexContainer: {
    '@media (max-width: 500px)': {
      display: 'block',
    },
  },
  tabRoot: {
    background: theme.palette.primary.main,
    borderTop: `5px solid ${ theme.palette.primary.main }`,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.primary.dark,
    textTransform: 'capitalize',
    minHeight: 60,
    fontSize: theme.typography.h4.fontSize,
    '& span:hover': {
      textDecoration: 'underline',
    },
    '@media (max-width: 500px)': {
      marginLeft: 0,
      width: '100%',
      display: 'block',
      minWidth: '100%',
      '-moz-box-shadow': 'inset  0 -10px 10px -15px grey',
      '-webkit-box-shadow': 'inset  0 -10px 10px -15px grey',
      'box-shadow': 'inset  0 -10px 10px -15px grey',
    },
  },
  tabSelected: {
    borderTop: `5px solid ${ theme.palette.primary.dark }`,
    borderBottom: `1px solid ${ theme.palette.background.default }`,
    borderLeft: `1px solid ${ theme.palette.primary.dark }`,
    borderRight: `1px solid ${ theme.palette.primary.dark }`,
    fontWeight: 'bold',
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.background.default,
    zIndex: 10,
  },
  tabPanelContainer: {
    position: 'relative',
    top: '-1px',
    borderTop: '1px solid #5c737f',
  },
  tabPanelBox: {
    '@media (max-width: 426px)': {
      padding: 0,
    },
  },
}))

const TabPanel = props => {
  const { children, value, index, ...other } = props
  const classes = useStyles()

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${ index }`}
      aria-labelledby={`full-width-tab-${ index }`}
      {...other}
    >
      {value === index && <Box p={3} className={classes.tabPanelBox}>{children}</Box>}
    </Typography>
  )
}

const a11yProps = index => {
  return {
    id: `full-width-tab-${ index }`,
    'aria-controls': `full-width-tabpanel-${ index }`,
  }
}

const Tabtastic = props => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const {
    selectedTab,
    children,
    processCardTabStyle
  } = props

  const urlParams = new URLSearchParams(selectedTab)
  const selectedParams = urlParams.get('tab')

  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)
  const [selected, setSelected] = useState(selectedParams || '')
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (children && selected) {
      const childIndex = children.findIndex(child => formatTabLabel(child.props.label.toLowerCase()) === selected)
      setSelectedIndex(childIndex)
    }
  }, [selected, selectedIndex])

  // set dataType if there is url param
  useEffect(() => {
    if (selectedParams) {
      const name = selectedParams.toString().replace('tab-', '')
      const selectedParamName = name.charAt(0).toUpperCase() + name.slice(1)
      if (updateDataFilter) {
        updateDataFilter({ ...filterState, [DFC.DATA_TYPE]: selectedParamName })
      }
    }
  }, [selectedParams])

  // format tab label and prepend string, format to replace any blank spaces with dash, then to lower case
  const formatTabLabel = label => {
    return `tab-${ label.replace(/\s+/g, '-').toLowerCase() }`
  }

  const handleChange = (event, newValue) => {
    setSelectedIndex(newValue)
    const selectedChild = props.children[newValue]
    const formattedLabel = formatTabLabel(selectedChild.props.label)

    setSelected(formattedLabel)

    if (updateDataFilter) {
      updateDataFilter({ ...filterState, [DFC.DATA_TYPE]: selectedChild.props.label, [DFC.BREAKOUT_BY]: DFC.SOURCE })
      return window?.history.replaceState(null, null, `?tab=${ formattedLabel }`)
    }
  }

  // get labels and create string array for aria labels
  const ariaLabels = children && React.Children.map(children, (item, index) => item.props.label).join(', ')

  const tabs = children && React.Children.map(children, (item, index) => {
    if (item.props.mdxType === 'TabtasticTab') {
      return item
    }
  })

  return (
    <Box data-testid="tabtastic-tabs-container">
      <Tabs
        value={selectedIndex}
        onChange={handleChange}
        indicatorColor="primary"
        variant="fullWidth"
        aria-label={`${ ariaLabels } Tabs`}
        classes={{
          root: classes.tabsRoot,
          flexContainer: classes.tabsFlexContainer
        }}
      >
        { (tabs && processCardTabStyle)
          ? tabs.map((item, index) => (
            <ProcessCardTab
              disableRipple
              key={index}
              label={item.props.label}
              {...a11yProps(index)}
              index={index}
              theme={theme}
            />
          ))
          : tabs.map((item, index) => (
            <DefaultTab
              disableRipple
              key={index}
              label={item.props.label}
              {...a11yProps(index)}
              index={index}
              theme={theme}
            />
          ))
        }
      </Tabs>
      <Box className={classes.tabPanelContainer} data-testid="tabtastic-tabpanel-container">
        { tabs &&
          tabs.map((item, index) => (
            <TabtasticTab label={item.props.label} key={index}>
              <TabPanel key={index} value={selectedIndex} index={index}>
                {item.props.children}
              </TabPanel>
            </TabtasticTab>
          ))
        }
      </Box>
    </Box>
  )
}

export const TabtasticTab = ({ label, children }) => {
  return (
    <div label={label} data-testid="tabtastic-tab-container">
      {children}
    </div>
  )
}

TabtasticTab.propTypes = {
  // tab label
  label: PropTypes.string.isRequired
}

Tabtastic.propTypes = {
  // tab children content
  children: PropTypes.node,
  // if url contains ?tab parameter, this will be the selected tab otherwise the first tab will be selected
  selectedTab: PropTypes.string,
}

export default Tabtastic
