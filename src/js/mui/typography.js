// https://material-ui.com/system/typography/#typography

require('typeface-lato')

module.exports = Object.freeze({
  fontSize: 18,
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
    lineHeight: '2.875rem',
    fontWeight: '600',
  },
  h2: {
    margin: '2rem 0 1rem 0',
    fontSize: '1.625rem',
    lineHeight: '2.25rem',
    fontWeight: '600',
  },
  h3: {
    margin: '2rem 0 .5rem 0',
    fontSize: '1.375rem',
    lineHeight: '2rem',
    fontWeight: '600',
  },
  h4: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '1.21rem',
    lineHeight: '1.235',
    fontWeight: '600',
  },
  h5: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  h6: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '.875rem',
    fontWeight: '600',
  },
})
