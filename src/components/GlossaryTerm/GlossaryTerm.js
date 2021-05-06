import React from 'react'
import PropTypes from 'prop-types'

import { useStaticQuery, graphql } from 'gatsby'

import { IconQuestionCircleImg } from '../images'

import { makeStyles, useTheme } from '@material-ui/styles'
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
/**
 * A dotted underline with a trailing question mark icon indicates a term defined
 * in the glossary.  On hover, a tooltip explains the term.  On click, a tooltip
 * explains the term and an orange border surrounds it.
 */
const GlossaryTerm = ({ children, termKey, ...rest }) => {
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

  const glossaryTermArr = children.split(' ')
  const foundTerms = terms.filter(term =>
    (term.tags && term.tags.findIndex(tag => tag.toLowerCase() === glossaryTermArr.find(item => item.toLowerCase() === tag.toLowerCase())) > -1))

  console.log('GlossaryTerm children: ', children)
  console.log('GlossaryTerm glossaryTermArr: ', glossaryTermArr)
  console.log('Glossary terms found yo: ', foundTerms)

  let glossaryTermKey = ''
  if (termKey) {
    glossaryTermKey = (typeof termKey !== 'string') ? termKey.toString() : termKey
  }
  else if (children) {
    glossaryTermKey = (typeof children !== 'string') ? children.toString() : children
  }

  // unit text, grab unit from string looking for units in parens
  const regExp = /\(([^)]+)\)/
  const match = glossaryTermKey.match(regExp)
  const unitTerm = match && match[0]

  let foundGlossaryTermKey = false
  const termResults = terms.filter(term => {
    if ((glossaryTermKey.toLowerCase() === term.name.toLowerCase()) || (term.tags && term.tags.findIndex(tag => tag.toLowerCase() === glossaryTermKey.toLowerCase()) > -1)) {
      foundGlossaryTermKey = true
      return term
    }
    // get term if unit term is found in glossary term key string
    else if (unitTerm && !foundGlossaryTermKey) {
      if ((unitTerm.toLowerCase() === term.name.toLowerCase()) || (term.tags && term.tags.findIndex(tag => tag.toLowerCase() === unitTerm.toLowerCase()) > -1)) {
        return term
      }
    }
  })

  console.log('termResults: ', termResults)

  if (termResults.length > 1) {
    console.warn(`Found more than 1 definition for the term: ${ children }. Will use the first result returned.`, termResults)
  }

  const TermDisplay = React.forwardRef((props, ref) => {
    if (!unitTerm || foundGlossaryTermKey) {
      return (
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
      )
    }
    else {
      return (
        <>
          {children.replace(unitTerm, '')}
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
              { unitTerm }<IconQuestionCircleImg />
            </span>
          </Tooltip>
        </>
      )
    }
  })

  // const TermDisplay = React.forwardRef((props, ref) => (
  //   <Tooltip
  //     title={termResults[0].definition}
  //     classes={{ tooltip: styles.tooltip }}
  //     enterDelay={100}
  //     leaveDelay={250}
  //     enterTouchDelay={100}
  //     leaveTouchDelay={3000}
  //     arrow
  //     placement="top">
  //     <span {...props} ref={ref}>
  //       { children }<IconQuestionCircleImg />
  //     </span>
  //   </Tooltip>
  // ))

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
  /** As an option you can specify a term key to display the glosssary term definition if needed */
  termKey: PropTypes.string
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
