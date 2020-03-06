import React from 'react'
import { StaticQuery, Link, graphql } from 'gatsby'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import MuiLink from '@material-ui/core/Link'

import logo from '../../../img/DOI-2x.png'
import DownloadIcon from '-!svg-react-loader!../../../img/svg/icon-download-base.svg'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
  },
  footerLink: {
    color: 'white'
  },
  footerDownloadLink: {
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    }
  },
  footerIcon: {
    fill: 'white',
    top: theme.spacing(2),
    marginLeft: theme.spacing(1)
  },
  footerImage: {
    maxWidth: 'calc(100% - 2%)',
  },
}))

const Footer = React.memo(({ data }) => {
  const classes = useStyles()

  return (
    <Box component="footer" className={classes.root}>
      <Container maxWidth="lg">
        <Box component="div" pt={5} pb={10}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <a href="https://doi.gov">
                <img
                  src={logo}
                  className={classes.footerImage}
                  alt="Department of the Interior logo"
                />
              </a>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography style={{ color: '#fff' }} paragraph>
                  Built in the open
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography style={{ color: '#d3dfe6' }} paragraph>
                  This site (
                  <MuiLink
                    className={classes.footerLink}
                    href={`https://github.com/onrr/doi-extractives-data/releases/${ data.site.siteMetadata.version }`}
                    underline="always"
                  >
                    {data.site.siteMetadata.version}
                  </MuiLink>
                  ) is powered by{' '}
                  <Link
                    className={classes.footerLink}
                    to="/downloads"
                  >
                    open data
                  </Link>
                  {' '}and{' '}
                  <MuiLink
                    className={classes.footerLink}
                    href="https://github.com/ONRR/doi-extractives-data/"
                    underline="always"
                  >
                    source code
                  </MuiLink>
                  . We welcome contributions and comments on{' '}
                  <MuiLink
                    className={classes.footerLink}
                    href="https://github.com/ONRR/doi-extractives-data/issues/new"
                    underline="always"
                  >
                    GitHub
                  </MuiLink>
                  . We write about how we work on this site on{' '}
                  <Link
                    to="/blog"
                    className={classes.footerLink}
                  >
                    our team's blog
                  </Link>
                  .
                </Typography>
              </Box>
              <Box mt={7}>
                <Typography style={{ color: '#fff' }} variant="subtitle2">
                  <MuiLink
                    href="https://www.doi.gov/"
                    className={classes.footerLink}
                    underline="hover"
                  >
                    Department of the Interior
                  </MuiLink>{' '}
                  |{' '}
                  <MuiLink
                    to="https://www.doi.gov/privacy"
                    className={classes.footerLink}
                    underline="hover"
                  >
                    Privacy Policy
                  </MuiLink>{' '}
                  |{' '}
                  <MuiLink
                    to="https://www.doi.gov/foia"
                    className={classes.footerLink}
                    underline="hover"
                  >
                    FOIA
                  </MuiLink>{' '}
                  |{' '}
                  <MuiLink
                    to="https://www.usa.gov/"
                    className={classes.footerLink}
                    underline="hover"
                  >
                    USA.gov
                  </MuiLink>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box mb={2}>
                <Typography style={{ color: '#fff' }}>
                  <Link to="/downloads/" className={classes.footerDownloadLink}>
                    Download data{' '}
                    <DownloadIcon className={classes.footerIcon} />
                  </Link>
                </Typography>
              </Box>
              <Divider light />
              <Box>
                <Typography style={{ color: '#d3dfe6' }} paragraph>
                  Office of Natural Resources Revenue,{' '}
                  {data.site.siteMetadata.informationDataManagement.name}
                  <br />
                  {data.site.siteMetadata.informationDataManagement.street}
                  <br />
                  {data.site.siteMetadata.informationDataManagement.city}{' '}
                  {data.site.siteMetadata.informationDataManagement.zip}
                </Typography>
                <Typography style={{ color: '#fff' }} variant="subtitle2">
                  <MuiLink
                    className={classes.footerLink}
                    href={
                      'mailto:' +
                      data.site.siteMetadata.informationDataManagement.email
                    }
                  >
                    {data.site.siteMetadata.informationDataManagement.email}
                  </MuiLink>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
})

export default props => (
  <StaticQuery
    query={graphql`
      query SiteFooterQuery {
        site {
          siteMetadata {
            version
            dataRetrieval {
              name
              email
            }
            informationDataManagement {
              name
              city
              zip
              street
              email
            }
          }
        }
      }
    `}
    render={data => (
      <Footer data={data} {...props} />
    )}
  />
)

Footer.propTypes = {
  version: PropTypes.string.isRequired,
}
