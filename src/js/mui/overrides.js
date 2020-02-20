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
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.3), 0px 2px 4px -1px rgba(0,0,0,0.14), 0px 2px 4px -1px rgba(0,0,0,0.12)',
      maxHeight: 130,
      '@media (max-width: 768px)': {
        maxHeight: '75px !important',
      },
    },
    colorPrimary: {
      backgroundColor: common.white
    }
  },
  // https://material-ui.com/components/buttons/
  MuiButton: {
    root: {
      textTransform: 'none',
    },
    // Name of the rule
    backgroundColor: primary.light,
    '&:hover': {
      backgroundColor: '#0F5A7D',
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
    },
    contained: {
      backgroundColor: common.white,
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
      padding: 5,
      background: 'inherit',
      margin: 0,
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
      color: primary.dark,
    },
    root: {
      '&.Mui-selected': {
        color: common.white,
        backgroundColor: primary.dark,
        '& .MuiToggleButton-label': {
          color: common.white,
        },
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
      '@media (max-width: 500px)': {
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
      '@media (max-width: 500px)': {
        marginLeft: 0,
        width: '100%',
        display: 'block',
        minWidth: '100%',
        '-moz-box-shadow': 'inset  0 -10px 10px -15px grey',
        '-webkit-box-shadow': 'inset  0 -10px 10px -15px grey',
        'box-shadow': 'inset  0 -10px 10px -15px grey',
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
    },
    padding: {
      paddingTop: 0,
      paddingBottom: 0,
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
  MuiMenuItem: {
    root: {
      marginBottom: 0,
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
      fontWeight: 'bold',
      top: '28px',
      color: grey['800'],
      fontSize: '1rem',
    },
    markLabelActive: {
      fontWeight: 'bold',
      color: grey['800'],
      background: 'transparent',
      boxShadow: 'none',
    },
    track: {
      height: 4,
      backgroundColor: 'transparent',
    },
    rail: {
      height: 4,
      backgroundColor: grey['500']
    },
    mark: {
      height: 4,
      backgroundColor: common.white,
      width: 0,
    },
    active: {
      boxShadow: 'none',
      transition: 'none',
      borderRadius: 0,
    },
    thumb: {
      marginTop: -4,
      boxShadow: 'none',
      transition: 'none',
      '&:hover': {
        boxShadow: 'none',
        transition: 'none',
      },
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
      },
    },
    valueLabel: {
      width: 60,
      top: -2,
      left: 'calc(-50% + -18px)',
      transform: 'rotate(0deg)',
      fontSize: '1rem',
      cursor: 'pointer',
      '& span': {
        width: 60,
        transform: 'rotate(0)',
        borderRadius: 0,
        textAlign: 'center',
      },
    }
  },
  // https://material-ui.com/api/table-cell/
  MuiTableCell: {
    root: {
      '& > .MuiTypography-root': {
        marginBottom: 0,
      }
    }
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
  },
  // https://material-ui.com/api/container/
  MuiContainer: {
    maxWidthLg: {
      '@media (min-width: 2560px)': {
        maxWidth: 1440,
      }
    }
  }
})
