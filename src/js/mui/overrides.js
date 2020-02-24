// https://material-ui.com/customization/globals/
const palette = require('./palette')

module.exports = Object.freeze({
  MuiTableCell: {
    head: {
      borderBottomColor: palette.secondary.main,
      borderBottomWidth: '3px'
    }
  },
  MuiToggleButton: {
    root: {
      '&.Mui-selected': {
        color: 'white',
        backgroundColor: '#5c737f',
      },
    }
  },
})
