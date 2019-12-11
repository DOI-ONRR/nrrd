// https://material-ui.com/customization/globals/
const { 
  primary,
  secondary,
  grey,
  text 
} = require('./palette')

console.log('palette::', primary)

module.exports = Object.freeze({
  // https://material-ui.com/components/buttons/
  MuiButton: {
    // Name of the rule
    root: {
      backgroundColor: `#1478a6`,
      '&:hover': {
        backgroundColor: `#1478a6`,
      }
    },
    text: {
      // Some CSS
      borderRadius: 5,
      border: `none`,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 2px 5px 2px rgba(0, 0, 0, .2)',
      textTransform: `inherit`,
      fontSize: `1.2rem`,
      '&:hover': {
        textDecoration: `underline`,
      }
    },
  },
  // https://material-ui.com/components/tabs/#tabs
  MuiTabs: {
    root: {
      background: `white`,
      '& .Mui-selected': {
        backgroundColor: `white`,
        color: `#435159 !important`,
        textColor: `#435159`,
        borderTop: `5px solid #435159`,
        borderLeft: `1px solid #435159`,
        borderRight: `1px solid #435159`,
        borderBottom: `none`
      }
    },
    indicator: {
      backgroundColor: `white`,
      border: `none`
    }
  },
  // https://material-ui.com/api/tab/
  MuiTab: {
    root: {
      background: `#f0f6fa`
    },
    wrapper: {
      textTransform: `capitalize`,
      fontSize: `1.2rem`,
      fontWeight: `400`
    },
    fullWidth: {
      borderBottom: `1px solid #435159`
    }
  },
  // https://material-ui.com/api/divider/
  MuiDivider: {
    light: {
      backgroundColor: `#435159`,
      margin: `1rem 0`
    }
  },
  // https://material-ui.com/api/list/
  MuiList: {
    root: {
      marginBottom: `1.2rem`
    }
  },
  // https://material-ui.com/api/list-item-icon/
  MuiListItemIcon: {
    root: {
      minWidth: `25px`,
      color: `#000`
    }
  },
  // https://material-ui.com/api/icon/
  MuiIcon: {
    colorSecondary: `#fff`
  },
  // https://material-ui.com/api/slider/
  MuiSlider: {
    root: {
      color: primary.main,
      height: 8,
      padding: `7px 0`,
    },
    thumb: {
      height: 40,
      width: 64,
      backgroundColor: `#323c42`,
      color: `#fff`,
      border: `none`,
      marginTop: -16,
      marginLeft: -34,
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
        color: `#fff`,
      },
      borderRadius: 0
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 48px)',
      backgroundColor: `none`,
      top: 13,
      '& > span': {
        backgroundColor: `transparent`,
        fontWeight: `bold`,
        color: `#fff !important`,
        fontSize: `1rem`
      }
    },
    track: {
      height: 8,
      borderRadius: 4,
      backgroundColor: grey['400']
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
    markLabel: {
      top: 5,
      backgroundColor: `none`,
      color: `#fff`
    },
    markLabelActive: {
      backgroundColor: `none`
    }
  }
})