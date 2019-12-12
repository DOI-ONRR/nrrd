// https://material-ui.com/customization/globals/
const { 
  primary,
  secondary,
  grey,
  text 
} = require('./palette')

console.log('palette::', primary)

module.exports = Object.freeze({
  // https://material-ui.com/api/app-bar/
  MuiAppBar: {
    root: {
      boxShadow: `0px 2px 4px -1px rgba(0,0,0,0.3), 0px 2px 4px -1px rgba(0,0,0,0.14), 0px 2px 4px -1px rgba(0,0,0,0.12)`
    }
  },
  // https://material-ui.com/components/buttons/
  MuiButton: {
    // Name of the rule
    root: {
      backgroundColor: primary.light,
      '&:hover': {
        backgroundColor: primary.light,
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
  // https://material-ui.com/api/link/
  MuiLink: {
    root: {
      color: primary.light,
    },
    underlineHover: {
      textDecoration: `underline`,
      '&:hover': {
        textDecoration: `none`
      }
    }
  },
  // https://material-ui.com/components/tabs/#tabs
  MuiTabs: {
    root: {
      background: `white`,
      '& .Mui-selected': {
        backgroundColor: `white`,
        color: `#435159 !important`,
        textColor: `#435159`,
        border: `1px solid #435159`,
        borderTop: `5px solid #435159`,
        borderBottom: `none`,
        zIndex: 20,
      },
    },
    indicator: {
      backgroundColor: `white`,
      border: `none`,
    },
    flexContainer: {
      '@media (max-width: 425px)': {
        display: `block`,
        marginBottom: `1rem`,
      }
    }
  },
  // https://material-ui.com/api/tab/
  MuiTab: {
    root: {
      background: `#f0f6fa`,
      borderTop: `5px solid #f0f6fa`,
      marginLeft: `10px`,
      color: `#435159`,
      '& span:hover': {
        textDecoration: `underline`,
      },
      '@media (max-width: 425px)': {
        marginLeft: 0,
        width: `100%`,
        display: `block`,
      }
    },
    wrapper: {
      textTransform: `capitalize`,
      fontSize: `1.2rem`,
      fontWeight: `400`,
    },
  },
  // https://material-ui.com/api/divider/
  MuiDivider: {
    light: {
      backgroundColor: `#435159`,
      margin: `1rem 0`,
    }
  },
  // https://material-ui.com/api/list/
  MuiList: {
    root: {
      marginBottom: `1.2rem`,
      color: primary.light,
    }
  },
  MuiListItem: {
    root: {
      '& a span': {
        color: primary.light
      },
      '& a:hover': {
        textDecoration: `none`
      }
    }
  },
  // https://material-ui.com/api/list-item-icon/
  MuiListItemIcon: {
    root: {
      minWidth: `18px`,
      color: `#000`,
      marginRight: 0,
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