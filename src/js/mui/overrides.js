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
    text: {
      // Some CSS
      background: `linear-gradient(45deg, ${primary.dark} 30%, ${primary.light} 90%)`,
      borderRadius: 5,
      border: `none`,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 2px 5px 2px rgba(0, 0, 0, .2)',
      textTransform: `capitalize`,
      fontSize: `1.2rem`
    },
  },
  // https://material-ui.com/components/tabs/#tabs
  MuiTabs: {
    root: {
      background: `${grey["50"]}`,
      '& .Mui-selected': {
        backgroundColor: `rgb(64, 80, 88)`,
        color: `white !important`,
        textColor: `white`
      }
    },
    indicator: {
      backgroundColor: `none`,
    }
  },
  // https://material-ui.com/api/tab/
  MuiTab: {
    wrapper: {
      textTransform: `capitalize`,
      fontSize: `1.2rem`,
      fontWeight: `400`
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