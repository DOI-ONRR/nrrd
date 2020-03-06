// https://material-ui.com/system/typography/#typography

require('typeface-lato')

module.exports = Object.freeze({
  fontSize: '18',
  fontFamily: 'Lato, "Helvetica Neue", Helvetica, arial, sans-serif',
  fontWeightBold: '600',
  // This overrides CSSBaseline for the body tag
  body2: {
    color: '#000',
    fontSize: '1.125rem',
    lineHeight: '1.6875rem',
  },
  h1: {
    margin: '0 0 1rem 0',
    fontSize: '2.125rem',
    fontWeight: '600',
  },
  h2: {
    margin: '2rem 0 1rem 0',
    fontSize: '1.625rem',
    fontWeight: '600',
  },
  h3: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '1.25rem',
    fontWeight: '600',
  },
  h4: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  h5: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  h6: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '.875rem',
    fontWeight: '600',
  },
})
