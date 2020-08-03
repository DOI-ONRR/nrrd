// https://material-ui.com/customization/globals/
const palette = require('./palette')
const typography = require('./typography')
const { ThemeConsumer } = require('styled-components')

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
  Table: {
    headTable: {
      marginBottom: '0px',
    },
    footTable: {
      marginBottom: '0px',
    }
  },
  MuiTable: {
    root: {
      marginBottom: '25px',
    }
  },
  MuiTableRow: {
    root: {
      backgroundColor: 'white'
    }
  },
  MuiTableCell: {
    head: {
      borderBottomColor: palette.secondary.main,
      borderBottomWidth: '3px',
    },
    footer: {
      color: typography.body2.color,
      fontSize: typography.body2.fontSize,
      fontWeight: typography.fontWeightBold
    }
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
  },
  MuiMenuItem: {
    root: {
      overflow: 'none',
    },
  },
  MuiCheckbox: {
    colorSecondary: {
      color: palette.links.default,
      '&$checked': {
        color: palette.links.default,
      },
    },
  },
  MuiToggleButton: {
    textTransform: 'capitalize',
    root: {
      color: 'black',
      '&$selected': {
        color: 'white',
        backgroundColor: palette.links.default,
      },
    },
    label: {
      textTransform: 'Capitalize',
    },
  },
})
