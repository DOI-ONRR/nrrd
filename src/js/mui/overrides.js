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
  }
})