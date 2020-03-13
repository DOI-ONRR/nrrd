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
      cursor: 'pointer'
    }
  }
))

const GlossaryTerm = ({ termKey, children, ...rest }) => {
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
            }
          }
        }
      }
    }
  `)

  const terms = results.allMdx.nodes[0].frontmatter.terms
  const termId = termKey || children

  const termResults = terms.filter(term => termId.toLowerCase() === term.name.toLowerCase())

  if (termResults.length > 1) {
    console.warning(`Found more than 1 definition for the termId: ${ termId }. Will use the first result returned.`, termResults)
  }

  if (termResults.length === 0) {
    throw new Error(`Found no definitions for the termId: ${ termId }.`)
  }

  const TermDisplay = React.forwardRef((props, ref) => (
    <span {...props} ref={ref}>
      {`${ children } `}<IconQuestionCircleImg />
    </span>
  ))

  return (
    <Tooltip title={termResults[0].definition} classes={styles} leaveDelay={200} arrow placement="top">
      <TermDisplay className={styles.term} {...rest} />
    </Tooltip>

  )
}

GlossaryTerm.propTypes = {
  /** If the key for looking up the glossary term is differnt then the children property use this to override */
  termKey: PropTypes.string,
}

export default GlossaryTerm
