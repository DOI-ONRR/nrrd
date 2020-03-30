import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink, withPrefix } from 'gatsby'
import { makeStyles, useTheme, Box } from '@material-ui/core'
import { IconDownloadXlsImg, IconDownloadCsvImg, IconDownloadDataImg, IconDownloadBaseImg } from '../images'

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.text.secondary,
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'none',
    }
  },
  headerLink: {
    color: theme.typography.body2.color,
    textDecoration: 'none',
    marginLeft: theme.spacing(2),
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  headerLinkBold: {
    fontWeight: theme.typography.fontWeightBold
  },
})
)

const IconLink = ({ icon, children, pl = 4, ...props }) => (
  <Box pl={0} mt={2} mb={2}>
    <BaseLink {...props} disableRouting>
      <Box mr={1} display='inline-block'>{icon}</Box>
      <span>{children}</span>
    </BaseLink>
  </Box>
)

const BaseLink = ({ href, disableRouting, className = '', children, ...props }) => {
  const theme = useTheme()
  const styles = useStyles(theme)

  const currentPathname = typeof window !== 'undefined' ? window.location.pathname : ''

  let url = href

  const isRelative = (url.charAt(0) !== '#' && !url.includes('http') && !url.includes('mailto'))
  url = isRelative ? withPrefix(url) : url

  const classes = (props.linkType === LinkTypeComponents.Header)
    ? `${ styles.headerLink } ${ className } ${ (currentPathname === href) && styles.headerLinkBold }`
    : `${ styles.link } ${ className }`

  return (
    <React.Fragment>
      {(!disableRouting && isRelative)
        ? <GatsbyLink to={url} className={classes} {...props} >
          {children}
        </GatsbyLink>
        : <a href={url} className={classes} {...props}>
          {children}
        </a>
      }
    </React.Fragment>
  )
}

const LinkTypeComponents = {
  default: props => <BaseLink {...props} />,
  Header: props => <BaseLink {...props} linkType={LinkTypeComponents.Header} />,
  DownloadXls: props => <IconLink icon={<IconDownloadXlsImg />} {...props} />,
  DownloadCsv: props => <IconLink icon={<IconDownloadCsvImg />} {...props} />,
  DownloadData: props => <IconLink icon={<IconDownloadDataImg />} {...props} />,
  DownloadBase: props => <IconLink icon={<IconDownloadBaseImg />} pl={0} {...props} />
}

const regexXlsx = RegExp('.xlsx$')
const regexCsv = RegExp('.csv$')
const regexDownloadData = RegExp('^/downloads/[a-zA-Z0-9]+')

const getLinkComponent = ({ linkType, ...props }) => {
  if (linkType) {
    return LinkTypeComponents[linkType](props)
  }
  if (regexXlsx.test(props.href)) {
    return LinkTypeComponents.DownloadXls(props)
  }
  if (regexCsv.test(props.href)) {
    return LinkTypeComponents.DownloadCsv(props)
  }

  if (props.linkType === 'DownloadBase') {
    return LinkTypeComponents.DownloadBase(props)
  }
  else if (regexDownloadData.test(props.href)) {
    return LinkTypeComponents.DownloadData(props)
  }

  return LinkTypeComponents.default(props)
}

/**
 * This Link component includes logic to determine if we need to use the Gatsby Link. By using Gatsby Link we leverage the
 * internal routing table and the ability to prefetch relative links.
 * By default all relative urls will use Gatsby, however files that need to be downloaded or anchor links do not use Gatsby Link.
 *
 * We also determine a link type by default to assign the appropriate icon.
 */
const Link = props => getLinkComponent(props)

Link.propTypes = {
  /** The url string for the link. */
  href: PropTypes.string.isRequired,
  /**
   * Will prepend the appropriate icon and the use a default routing option for that type. For example download file types do not use routing by default.
   *
   * By default we determine the appropriate link type but you can specify a type if you want to override it.
   */
  linkType: PropTypes.oneOf(['DownloadXls', 'DownloadCsv', 'DownloadData', 'DownloadBase', 'Header', 'default']),
  /**
   * Used to flag a relative link that we may not want to use Gatsby Routing for. An example is download files.
   *
   * By default we determine the appropriate routing but you can use this flag if you want to override it.
   */
  disableRouting: PropTypes.bool
}

Link.defaultProps = {
  disableRouting: false,
}

export default Link
