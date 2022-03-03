import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink, withPrefix } from 'gatsby'
import { makeStyles, useTheme, Box } from '@material-ui/core'
import {
  IconDownloadXlsImg,
  IconDownloadCsvImg,
  IconDownloadDataImg,
  IconDownloadBaseImg,
  HowWorksLinkIconImg,
  FilterTableIconImg,
  IconExploreDataImg,
  IconUsMapImg
} from '../images'

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.text.secondary,
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'none',
    },
    '& svg': {
      fill: theme.palette.text.secondary,
    }
  },
  headerLink: {
    color: theme.typography.body2.color,
    textDecoration: 'none',
    marginLeft: theme.spacing(4),
    maxHeight: '85%',
    display: 'inline-block',
    '&:hover': {
      textDecoration: 'underline',
    },
    '@media (max-width: 768px)': {
      '& svg': {
        maxWidth: 200,
      },
    },
  },
  headerLinkBold: {
    fontWeight: theme.typography.fontWeightBold,
    textDecoration: 'underline',
  },
  filterTableIcon: {
    '& svg': {
      position: 'relative',
      top: 7,
    }
  },
})
)

const IconLink = ({ icon, children, pl = 0, mt = 2, style, ...rest }) => (
  <Box pl={pl} mt={mt} mb={2} style={style}>
    <BaseLink {...rest}>
      <Box mr={1} display='inline-block'>{icon}</Box>
      <span>{children}</span>
    </BaseLink>
  </Box>
)

const BaseLink = ({ href, disableRouting, className = '', children, linkType, target, ...rest }) => {
  const theme = useTheme()
  const styles = useStyles(theme)

  const currentPathname = typeof window !== 'undefined' ? window.location.pathname : ''

  let url = href

  const pathPrefix = withPrefix('/').slice(0, -1)

  const isRelative = (url.charAt(0) !== '#' && !url.includes('http') && !url.includes('mailto'))
  if (url.includes(pathPrefix) && !disableRouting) {
    url = url.replace(pathPrefix, '')
  }

  let classes

  switch (linkType) {
  case LinkTypeComponents.Header:
    classes = `${ styles.headerLink } ${ className } ${ (currentPathname === withPrefix(href)) && styles.headerLinkBold }`
    break
  case LinkTypeComponents.FilterTable:
  case LinkTypeComponents.ExploreData:
    classes = `${ styles.link } ${ styles.filterTableIcon } ${ className }`
    break
  default:
    classes = `${ styles.link } ${ className }`
    break
  }

  return (
    <React.Fragment>
      {(!disableRouting && isRelative)
        ? <GatsbyLink to={url} className={classes} target={target} {...rest}>
          {children}
        </GatsbyLink>
        : <a href={url} className={classes} {...rest} target={target} data-testid={'AnchorLink'}>
          {children}
        </a>
      }
    </React.Fragment>
  )
}

const LinkTypeComponents = {
  default: ({ style, ...props }) => <BaseLink {...props} style={style}/>,
  Header: ({ style, ...props }) => <BaseLink {...props} linkType={LinkTypeComponents.Header} style={style} />,
  DownloadXls: props => <IconLink icon={<IconDownloadXlsImg data-testid='download excel icon' />} {...props} disableRouting={true} />,
  DownloadCsv: props => <IconLink icon={<IconDownloadCsvImg data-testid='download csv icon' />} {...props} disableRouting={true} />,
  DownloadData: props => <IconLink icon={<IconDownloadDataImg data-testid='download data icon' />} {...props} />,
  DownloadBase: props => <IconLink icon={<IconDownloadBaseImg data-testid='download base icon' />} pl={0} {...props} />,
  HowWorks: props => <IconLink icon={<HowWorksLinkIconImg data-testid='how works icon' />} pl={0} {...props} />,
  FilterTable: props => <IconLink icon={<FilterTableIconImg data-testid='filter table icon' />} linkType={LinkTypeComponents.FilterTable} pl={0} {...props} />,
  ExploreData: props => <IconLink icon={<IconExploreDataImg data-testid='explore data icon' />} linkType={LinkTypeComponents.ExploreData} {...props} />,
  Location: props => <IconLink icon={<IconUsMapImg data-testid='us map icon' />} {...props} />
}

const regexXlsx = RegExp('.xlsx$')
const regexCsv = RegExp('.csv$')
const regexDownloadData = RegExp('^(.*)/downloads/[a-zA-Z0-9#]+')

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

  if (regexDownloadData.test(props.href)) {
    return LinkTypeComponents.DownloadData(props)
  }

  return LinkTypeComponents.default(props)
}

/**
 * The Link component includes logic to determine if we need to use the Gatsby Link.
 * By using Gatsby Link we leverage the internal routing table and the ability to prefetch
 * relative links. By default all relative URLs will use Gatsby.  However, files that need
 * to be downloaded or anchor links do not use Gatsby Link.
 *
 * We also determine a link type by default to assign the appropriate icon. You
 * can also specify the property: "linkType". Values currently available: 'DownloadXls',
 * 'DownloadCsv', 'DownloadData', 'DownloadBase', 'FilterTable', 'ExploreData',
 * 'Header', 'HowWorks', 'default', or ‘Location.’
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
  linkType: PropTypes.oneOf(['DownloadXls', 'DownloadCsv', 'DownloadData', 'DownloadBase', 'FilterTable', 'ExploreData', 'Header', 'HowWorks', 'default', 'Location']),
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

Link.Preview = {
  group: 'Inputs',
  demos: [
    {
      title: 'External Link',
      code: '<Link href="https://revenuedata.doi.gov/">External Link</Link>',
    },
    {
      title: 'Relative Link',
      code: '<Link href="/relative">Relative link</Link>',
    },
    {
      title: 'DownloadData Link',
      code: '<Link href="./downloads/production">DownloadData</Link>',
      notes: 'The appropriate icon is displayed based on a match of the relative url'
    },
    {
      title: 'Specify link type example',
      code: '<Link linkType="DownloadXls" href="./downloads/production">Force link type</Link>',
      notes: 'The appropriate icon is displayed based on the link type property specified'
    }
  ]
}
