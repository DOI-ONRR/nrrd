import React from 'react'
import { useStaticQuery, Link } from 'gatsby'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import logo from '../../../img/DOI-2x.png'
import DownloadIcon from '-!svg-react-loader!../../../img/svg/icon-download-base.svg'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    backgroundColor: '#323c42',
    color: '#d3dfe6' // TODO: clean up styling
  },
  footer: {},
  footerLink: {
    color: theme.palette.common.white
  },
  footerImage: {
    maxWidth: '110px',
    width: '80%',
  },
  footerIcon: {
    fill: theme.palette.common.white
  }
}))

const Footer = props => {
  const classes = useStyles()

  const data = useStaticQuery(graphql`
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
  `)

  return (
    <footer className={`${ classes.root } ${ classes.footer }`}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <a href="https://doi.gov"><img className={classes.footerImage} src={logo} alt="Department of the Interior logo" /></a>
          </Grid>
          <Grid item xs={5}>
            <p className="footer-para_callout footer-para_callout-bigger">Built in the open</p>
            <p className="footer-para">This site (<a href={`https://github.com/onrr/doi-extractives-data/releases/${data.site.siteMetadata.version}`} className={classes.footerLink}>{data.site.siteMetadata.version}</a>)
          is powered by <Link className={classes.footerLink} to="/downloads" className={classes.footerLink}>open data</Link> and <a className={classes.footerLink} href="https://github.com/ONRR/doi-extractives-data/">source code</a>.<br />
          We welcome contributions and comments on <a className={classes.footerLink} href="https://github.com/ONRR/doi-extractives-data/issues/new">GitHub</a>. We write about how we work on this site on <Link className={classes.footerLink} to="/blog" className={classes.footerLink}>our team's blog</Link>.</p>
            <p className="footer-para-small footer-para_last"><a href="https://www.doi.gov/" className={classes.footerLink}>Department of the Interior</a> | <a href="https://www.doi.gov/privacy" className={classes.footerLink}>Privacy Policy</a> | <a href="https://www.doi.gov/foia" className={classes.footerLink}>FOIA</a> | <a href="https://www.usa.gov/" className={classes.footerLink}>USA.gov</a></p>
          </Grid>
          <Grid item xs={5}>
            <p className="footer-para_callout">
              <Link to="/downloads/" className={classes.footerLink}>Download data <DownloadIcon className={classes.footerIcon} /></Link>
            </p>
            <p className="footer-para footer-para-small">
              Office of Natural Resources Revenue, { data.site.siteMetadata.informationDataManagement.name }<br/>
              { data.site.siteMetadata.informationDataManagement.street }<br/>
              { data.site.siteMetadata.informationDataManagement.city } { data.site.siteMetadata.informationDataManagement.zip }<br/>
              <a className={classes.footerLink} href={'mailto:' + data.site.siteMetadata.informationDataManagement.email}>{ data.site.siteMetadata.informationDataManagement.email }</a>
            </p>
          </Grid>
        </Grid>
      </Container>
    </footer>
  )
}

Footer.propTypes = {
  /** The version of the site release. */
  version: PropTypes.string.isRequired,
}
export default Footer
