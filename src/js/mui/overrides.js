// https://material-ui.com/customization/globals/
const palette = require('./palette')
const typography = require('./typography')

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
    },
    footer: {
      color: typography.body2.color,
      fontSize: typography.body2.fontSize,
      fontWeight: typography.fontWeightBold
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
  },
  MuiFormLabel: {
    root: {
      color: typography.body2.color,
      fontSize: typography.body2.fontSize,
      '&.Mui-focused': {
        color: palette.text.secondary,
      },
    }
  },
  MuiFormHelperText: {
    root: {
      color: typography.body2.color,
      fontSize: typography.body2.fontSize
    }
  }
})
