/* eslint-disable max-len */
// https://material-ui.com/customization/globals/
const {
  primary,
  secondary,
  grey,
  common,
  ...rest
} = require('./palette')

module.exports = Object.freeze({
  // https://material-ui.com/api/app-bar/
  MuiAppBar: {
    root: {
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.3), 0px 2px 4px -1px rgba(0,0,0,0.14), 0px 2px 4px -1px rgba(0,0,0,0.12)'
    },
    colorPrimary: {
      backgroundColor: common.white
    }
  },
  // https://material-ui.com/components/buttons/
  MuiButton: {
    // Name of the rule
    root: {
      backgroundColor: primary.light,
      '&:hover': {
        backgroundColor: '#0F5A7D',
      }
    },
    text: {
      // Some CSS
      borderRadius: 5,
      border: 'none',
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 2px 5px 2px rgba(0, 0, 0, .2)',
      textTransform: 'inherit',
      fontSize: '1.2rem',
    },
    outlinedPrimary: {
      '&:hover': {
        backgroundColor: primary.main,
        color: common.white,
      },
    }
  },
  // https://material-ui.com/api/button-group/
  MuiButtonGroup: {
    root: {
      backgroundColor: common.white,
      '& .MuiButton-contained': {
        backgroundColor: common.white
      },
      '& .MuiButton-contained:hover': {
        color: primary.main,
      }
    },
    grouped: {
      padding: '10px 14px',
      background: 'inherit',
      margin: '8px 0',
    },
  },
  // https://material-ui.com/api/toggle-button-group/#css
  MuiToggleButtonGroup: {
    root: {},
  },
  MuiToggleButton: {
    label: {
      fontWeight: 'bold',
      textTransform: 'capitalize',
    },
    root: {
      '&.Mui-selected': {
        color: common.white,
        backgroundColor: primary.dark,
      },
      '&.Mui-selected:hover': {
        color: common.white,
        backgroundColor: `${ primary.dark } !important`,
      }
    }
  },
  // https://material-ui.com/api/link/
  MuiLink: {
    root: {
      color: primary.light,
    },
    underlineAlways: {
      textDecoration: 'underline',
      '&:hover': {
        textDecoration: 'none',
      }
    }
  },
  // https://material-ui.com/components/tabs/#tabs
  MuiTabs: {
    root: {
      background: 'white',
      '& .Mui-selected': {
        backgroundColor: 'white',
        color: '#435159 !important',
        textColor: '#435159',
        border: '1px solid #435159',
        borderTop: '5px solid #435159',
        borderBottom: 'none',
        zIndex: 20,
      },
    },
    indicator: {
      backgroundColor: 'white',
      border: 'none',
    },
    flexContainer: {
      '@media (max-width: 425px)': {
        display: 'block',
        marginBottom: 0,
      }
    }
  },
  // https://material-ui.com/api/tab/
  MuiTab: {
    root: {
      background: '#f0f6fa',
      borderTop: '5px solid #f0f6fa',
      marginLeft: '5px',
      marginRight: '5px',
      color: '#435159',
      '& span:hover': {
        textDecoration: 'underline',
      },
      '@media (max-width: 425px)': {
        marginLeft: 0,
        width: '100%',
        display: 'block',
        minWidth: '100%',
        '-moz-box-shadow': 'inset  0 -10px 10px -10px grey',
        '-webkit-box-shadow': 'inset  0 -10px 10px -10px grey',
        'box-shadow': 'inset  0 -10px 10px -10px grey',
      }
    },
    fullWidth: {
      maxWidth: 'auto',
    },
    wrapper: {
      textTransform: 'capitalize',
      fontSize: '1.2rem',
      fontWeight: '400',
    },
  },
  // https://material-ui.com/api/divider/
  MuiDivider: {
    light: {
      backgroundColor: '#435159',
      margin: '1rem 0',
    }
  },
  // https://material-ui.com/api/list/
  MuiList: {
    root: {
      marginBottom: 0,
      color: primary.light,
    }
  },
  MuiListItem: {
    root: {
      '& a span': {
        color: primary.light
      },
      '& a:hover': {
        textDecoration: 'none'
      }
    }
  },
  // https://material-ui.com/api/list-item-icon/
  MuiListItemIcon: {
    root: {
      minWidth: '18px',
      color: '#000',
      marginRight: 0,
    }
  },
  // https://material-ui.com/api/icon/
  MuiIcon: {
    colorSecondary: '#fff'
  },
  // https://material-ui.com/api/paper/
  MuiPaper: {
    root: {
    }
  },
  // https://material-ui.com/api/slider/
  MuiSlider: {
    root: {
      color: '#435159'
    },
    markLabel: {
      fontWeight: 'normal',
    },
    markLabelActive: {
      fontWeight: 'bold',
    },
    track: {
      height: 4,
    },
    mark: {
      height: 4,
      backgroundColor: common.white,
    },
    thumb: {
      marginTop: -4,
    },
    rail: {
      height: 4,
    }
  },
  // https://material-ui.com/api/table-cell/
  MuiTableCell: {
  },
  // https://material-ui.com/api/outlined-input/#outlinedinput-api
  MuiOutlinedInput: {
    root: {
      fontFamily: 'Lato, "Helvetica Neue", Helvetica, arial, sans-serif',
      '& > #search-input::-webkit-search-cancel-button': {
        '-webkit-appearance': 'none',
        height: 15,
        width: 15,
        /*
        * Base64 encoded custom "X" icon
        * Natively 30x30, but downscaled for highres screens
        */
        backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAn0lEQVR42u3UMQrDMBBEUZ9WfQqDmm22EaTyjRMHAlM5K+Y7lb0wnUZPIKHlnutOa+25Z4D++MRBX98MD1V/trSppLKHqj9TTBWKcoUqffbUcbBBEhTjBOV4ja4l4OIAZThEOV6jHO8ARXD+gPPvKMABinGOrnu6gTNUawrcQKNCAQ7QeTxORzle3+sDfjJpPCqhJh7GixZq4rHcc9l5A9qZ+WeBhgEuAAAAAElFTkSuQmCC)',
        backgroundSize: 15,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
      },
    },
  },
  MuiTypography: {
    root: {
      '& + .h3Bar': {
        borderBottom: '2px solid #cde3c3',
        marginBottom: '1em',
        paddingBottom: '.41667rem',
      }
    },
  },
  MuiFormLabel: {
    root: {
      lineHeight: 0.5,
    }
  },
  MuiSelect: {
    root: {
      padding: '15px',
    }
  }
})
