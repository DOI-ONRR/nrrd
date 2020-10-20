// https://material-ui.com/customization/globals/
import { text, secondary, primary, links } from './palette'
import typography from './typography'

export default Object.freeze({
  MuiButton: {
    root: {
      textTransform: 'inherit',
    }
  },
  MuiLink: {
    underlineHover: {
      color: text.secondary,
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
      borderBottomColor: secondary.main,
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
      color: primary.dark,
      minWidth: 30,
    }
  },
  MuiFormLabel: {
    root: {
      color: typography.body2.color,
      fontSize: typography.body2.fontSize,
      '&.Mui-focused': {
        color: text.secondary,
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
      color: links.default,
      '&$checked': {
        color: links.default,
      },
    },
  },
  MuiToggleButton: {
    textTransform: 'capitalize',
    root: {
      color: 'black',
      '&$selected': {
        color: 'white',
        backgroundColor: `${ links.default }`,
        outline: '2px solid transparent',
      },
    },
    label: {
      textTransform: 'Capitalize',
    },
  },
})
