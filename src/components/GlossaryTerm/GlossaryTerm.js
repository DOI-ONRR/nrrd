import React from 'react'
import PropTypes from 'prop-types'

import { useStaticQuery, graphql } from 'gatsby'

import { IconQuestionCircleImg } from '../images'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles(theme => (
  {
    tooltip: {
      backgroundColor: theme.palette.info.dark,
      color: theme.palette.common.white,
      boxShadow: theme.shadows[2],
      fontSize: theme.typography.fontSize,
    },
    arrow: {
      color: theme.palette.info.dark,
    },
    term: {
      borderBottom: '1px dotted',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }
))

const GlossaryTerm = ({ children, ...rest }) => {
  const theme = useTheme()
  const styles = useStyles(theme)
  const results = useStaticQuery(graphql`
    query GlossaryTermsQuery {
      allMdx(filter: {fileAbsolutePath: {regex: "/content-partials/Glossary/"}, mdxAST: {}}) {
        nodes {
          frontmatter {
            terms {
              definition
              name
              tags
            }
          }
        }
      }
    }
  `)

  const terms = results.allMdx.nodes[0].frontmatter.terms

  const termResults = terms.filter(term =>
    (children.toLowerCase() === term.name.toLowerCase()) || (term.tags && term.tags.findIndex(tag => tag.toLowerCase() === children.toLowerCase()) > -1))

  if (termResults.length > 1) {
    console.warn(`Found more than 1 definition for the term: ${ children }. Will use the first result returned.`, termResults)
  }

  if (termResults.length === 0) {
    throw new Error(`Found no definitions for the term: ${ children }`)
  }

  const TermDisplay = React.forwardRef((props, ref) => (
    <span {...props} ref={ref}>
      {`${ children } `}<IconQuestionCircleImg />
    </span>
  ))

  return (
    <Tooltip
      title={termResults[0].definition}
      classes={{ tooltip: styles.tooltip }}
      leaveDelay={200}
      arrow
      placement="top"
      disableTouchListener>
      <TermDisplay tabIndex='0' className={styles.term} {...rest} />
    </Tooltip>

  )
}

GlossaryTerm.propTypes = {
  /** The children must a be a string that can be used to lookup a glossary definition */
  children: PropTypes.string.isRequired,
}

export default GlossaryTerm
