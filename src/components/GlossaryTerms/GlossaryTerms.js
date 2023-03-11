import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useStaticQuery, graphql } from 'gatsby'
import { StickyWrapper } from '../utils/StickyWrapper'

import {
  Box,
  Container,
  Grid,
  Paper
} from '@material-ui/core'

import { createStyles, withStyles, useTheme, makeStyles } from '@material-ui/core/styles'

import {
  GlossaryCategorySelectInput
} from '../inputs'

import {
  animateScroll as scroll
} from 'react-scroll'

const useStyles = makeStyles(theme => ({
  anchor: {
    paddingTop: 100,
    marginTop: -100,
  },
  glossaryAnchorMenu: {
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      textAlign: 'left',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  },
  glossaryAnchor: {
    color: theme.palette.links.default,
    textDecoration: 'none',
    padding: '0',
    display: 'inline-block',
    textAlign: 'center',
    verticalAlign: 'middle',
    margin: '0 4px 0',
    '&:hover, &.active': {
      fontWeight: 'bold',
      textDecoration: 'underline'
    }
  },
  glossarySelectMenu: {
    textAlign: 'right',
    [theme.breakpoints.down('md')]: {
      textAlign: 'left',
      marginBottom: theme.spacing(1)
    }
  }
}))

// Glosary Category Container
const GlossaryCategoryContainer = withStyles(theme =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.info.main,
      color: theme.palette.common.black,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4)
    }
  })
)(Paper)

const GlossaryGroup = ({ term }) => {
  // console.log('GlossaryGroup term: ', term)
  const classes = useStyles()
  return (
    <h2 id={term.group === '8' ? '#' : term.group} className={classes.anchor}>{term.group === '8' ? '#' : term.group}</h2>
  )
}

// GlossaryTerm
const GlossaryTerm = ({ term }) => (
  <Box mb={2}>
    <Box fontWeight="bold" display="inline" mr={2}>{term.name}</Box>
    <Box display="inline">{term.definition}</Box>
  </Box>
)

const GlossaryTerms = ({ title = 'Glossary', location, ...rest }) => {
  const results = useStaticQuery(graphql`
    query AllGlossaryTermsQuery {
      mdx(internal: {
        contentFilePath: {regex: "/content-partials/Glossary/"}
      }) {
        frontmatter {
          terms {
            definition
            name
            tags
            categories
          }
        }
      }
    }
  `)

  const [category, setCategory] = useState('ONRR')
  const classes = useStyles()

  const handleChange = value => {
    // console.log('handleChange')
    setCategory(value)
    window.scrollTo(0, 0)
  }
  const theme = useTheme()
  const terms = results.mdx.frontmatter.terms

  // scroll to top of page
  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    })
  }

  // disclaimer
  const disclaimer = () => {
    return { __html: rest.disclaimer }
  }

  // group terms by first letter of term
  const data = terms.reduce((r, e) => {
    const group = e.name[0].toUpperCase()
    if (!r[group]) r[group] = { group, children: [e] }
    else r[group].children.push(e)
    return r
  }, {})

  const result = Object.values(data)

  // map out glossary categories
  const cats = new Set()
  result.map(term => term.children.map(child => {
    const catArr = child.categories
    catArr.map(item => {
      if (item !== '') cats.add(item)
    })
  }))

  const gcats = Array.from(cats)
  gcats.unshift('ONRR')

  // create glossary group menu
  const gMenu = result.map(term => term.group === '8' ? '#' : term.group)

  // filtered glossary terms by category
  const f = terms.filter(term => (term.categories.includes(category) && !term.categories.includes('')))

  // all glossary terms
  const allTerms = result.map((term, i) => (
    <Grid container spacing={2} key={`allTerms__${ i }`}>
      <Grid item xs={1}>
        <GlossaryGroup term={term} key={`termGroup__${ i }`} />
      </Grid>
      <Grid item xs={11}>
        <Box mb={2} pb={2} align="top" style={{ borderBottom: (i !== result.length - 1) ? `3px dashed ${ theme.palette.green[100] }` : 'none' }}>
          {term.children.map((child, i) => (
            <GlossaryTerm term={child} key={`allChildTerms__${ i }`} />
          ))}
        </Box>
      </Grid>
    </Grid>
  ))

  // filtered group terms
  const filteredTerms = f && f.map(term => <GlossaryTerm term={term} />)

  // set active class for anchor links
  const activeClass = item => {
    let c = ''
    if (location.hash.replace('#', '') === item || location.hash === '#') {
      c = 'active'
    }
    // else if (location.hash.replace('#', '') === '#') {
    //   c = 'active'
    // }
    // else {
    //   c = ''
    // }

    return c
  }

  // console.log('filteredTerms: ', filteredTerms)

  return (
    <>
      <StickyWrapper enabled={true} top={60} bottomBoundary={0} innerZ="1000" activeClass="sticky">
        <Box pt={1} pb={0} style={{
          background: theme.palette.common.white,
          boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 15%), 0px 2px 2px 0px rgb(0 0 0 / 9%), 0px 1px 5px 0px rgb(0 0 0 / 7%)'
        }}>
          <Container maxWidth="lg">
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <Grid item xs={12} md={3}>
                <Box><h1 style={{ margin: 0 }}>{title}</h1></Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className={classes.glossaryAnchorMenu}>
                  {gMenu.map((item, i) => (
                    <Box display="inline-block" key={`gmenu__${ i }`}>
                      <a
                        className={`${ classes.glossaryAnchor } ${ activeClass(item) }`}
                        onClick={item === '#' ? scrollToTop : undefined}
                        href={`#${ item !== '#' ? item : '' }`}>{item}</a>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className={classes.glossarySelectMenu}>
                  <GlossaryCategorySelectInput
                    data={gcats}
                    defaultSelected={category}
                    label='Categories'
                    selectType='Single'
                    onChange={handleChange}
                    showClearSelected={false}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </StickyWrapper>
      <Container maxWidth="lg">
        <Box dangerouslySetInnerHTML={ disclaimer() } pt={3}></Box>
        <GlossaryCategoryContainer>
          { (category === 'ONRR') &&
        <>
          <h4 style={{
            marginTop: theme.spacing(0),
            marginBottom: theme.spacing(2),
            paddingBottom: theme.spacing(1),
            borderBottom: `3px dashed ${ theme.palette.common.white }`
          }}>The Office of Natural Resources Revenue (ONRR)</h4>
          <p>The ONRR is part of the U.S. Department of the Interior,
             and is responsible for collecting, disbursing, and verifying
             federal and Indian energy and other natural resource revenue.</p>
        </>
          }
          { (category !== 'ONRR') &&
        <>
          <h2 style={{ borderBottom: `3px dashed ${ theme.palette.common.white }`, marginTop: 0 }}>{category}</h2>
          {filteredTerms}
        </>
          }
        </GlossaryCategoryContainer>
        {allTerms}
      </Container>
    </>
  )
}

export default GlossaryTerms

GlossaryTerms.propTypes = {
  selectType: PropTypes.string
}
