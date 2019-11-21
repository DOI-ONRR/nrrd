// https://material-ui.com/customization/globals/
require("./palette")

module.exports = Object.freeze({
  // https://material-ui.com/components/buttons/
  MuiButton: {
    // Name of the rule
    text: {
      // Some CSS
      background: `linear-gradient(45deg, rgb(64, 80, 88) 30%, #5c737f 90%)`,
      borderRadius: 5,
      border: `none`,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 2px 5px 2px rgba(0, 0, 0, .2)',
    },
  },
  // https://material-ui.com/components/tabs/#tabs
  MuiTabs: {
    root: {
      background: "#fafafa",
      '& .Mui-selected': {
        backgroundColor: `rgb(64, 80, 88)`,
        color: `white !important`,
        textColor: `white`
      }
    },
    indicator: {
      backgroundColor: `none`
    }
  }
})