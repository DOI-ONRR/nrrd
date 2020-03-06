// https://material-ui.com/customization/globals/
const palette = require('./palette')

module.exports = Object.freeze({
  MuiButton: {
    root: {
      textTransform: 'inherit',
    }
  },
  MuiLink: {
    underlineHover: {
      color: palette.text.secondary,
    },
  },
  MuiTableCell: {
    head: {
      borderBottomColor: palette.secondary.main,
      borderBottomWidth: '3px'
    }
  },
  MuiToggleButton: {
    root: {
      color: palette.primary.dark,
      '&.Mui-selected': {
        color: 'white',
        backgroundColor: '#5c737f',
      },
    },
  },
  MuiListItemIcon: {
    root: {
      color: palette.primary.dark,
      minWidth: 30,
    }
  }
})
