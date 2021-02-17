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

const GlossaryTerm = ({ children, termKey, isInTable, ...rest }) => {
  const theme = useTheme()
  const styles = useStyles(theme)
  const results = useStaticQuery(graphql`
    query GlossaryTermsQuery {
      mdx(fileAbsolutePath: {regex: "/content-partials/Glossary/"}) {
        frontmatter {
          terms {
            definition
            name
            tags
          }
        }
      }
    }
  `)

  const terms = results.mdx.frontmatter.terms

  if ((termKey && typeof termKey !== 'string') || (!termKey && typeof children !== 'string')) {
    throw new Error('No string found for glossary term comparison. Either set the termKey property to a string or the children of the component must be a string')
  }
  const glossaryTermKey = termKey?.toLowerCase() || children.toLowerCase()

  const termResults = terms.filter(term =>
    (glossaryTermKey.toLowerCase() === term.name.toLowerCase()) || (term.tags && term.tags.findIndex(tag => tag.toLowerCase() === glossaryTermKey.toLowerCase()) > -1))

  if (termResults.length > 1) {
    console.warn(`Found more than 1 definition for the term: ${ children }. Will use the first result returned.`, termResults)
  }

  const TermDisplay = React.forwardRef((props, ref) => (
    <Tooltip
      title={termResults[0].definition}
      classes={{ tooltip: styles.tooltip }}
      enterDelay={100}
      leaveDelay={250}
      enterTouchDelay={100}
      leaveTouchDelay={3000}
      arrow
      placement="top">
      <span {...props} ref={ref}>
        { children }<IconQuestionCircleImg />
      </span>
    </Tooltip>
  ))

  return (
    <>
      {termResults.length > 0
        ? <TermDisplay tabIndex='0' className={styles.term} {...rest} />
        : children
      }
    </>
  )
}

GlossaryTerm.propTypes = {
  /** The children must a be a string that can be used to lookup a glossary definition */
  children: PropTypes.string.isRequired,
}

export default GlossaryTerm

GlossaryTerm.Preview = {
  group: 'Informational',
  demos: [
    {
      title: 'Example',
      code: '<GlossaryTerm>8(g)</GlossaryTerm>',
    }
  ]
}
