import React, { Fragment, useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TextField from '@material-ui/core/TextField'
import CloseIcon from '@material-ui/icons/Close'

import { GlossaryContext } from '../../../glossaryContext'
import { StoreContext } from '../../../store'

import GlossaryIcon from '-!svg-react-loader!../../../img/svg/icon-question-circle.svg'

import GLOSSARY_TERMS from '../../../data/terms.yml'

console.log('GLOSSARY_TERMS: ', GLOSSARY_TERMS)

const useStyles = makeStyles(theme => ({
  list: {
    width: '300px',
  },
  fullList: {
    width: 'auto',
  },
  mobileMenuCloseButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    cursor: 'pointer'
  },
  glossaryIcon: {
    width: '30px',
    height: '30px',
    display: 'inline',
    position: 'relative',
    top: theme.spacing(0.5),
    marginRight: theme.spacing(1)
  },
  glossarySearchContainer: {
    padding: theme.spacing(2)
  },
  glossaryTextField: {

  },
  heading: {
    margin: 0
  }
}))

const GlossaryDrawer = () => {

  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  console.log('state: ', state)

  let filteredTerms = filterGlossaryTerms(state.glossaryTerm)

  const handleClose = () => {
    dispatch({ type: 'GLOSSARY_TERM_SELECTED', payload: { glossaryTerm: '', glossaryOpen: false }})
  }

  const handleChange = event => {
    dispatch({ type: 'GLOSSARY_TERM_SELECTED', payload: { glossaryTerm: event.target.value, glossaryOpen: true }})
  }

  const glossaryList = side => (
    <div
      className={classes.list}
      role="presentation"
    >
      <div className={classes.glossarySearchContainer}>
        <Typography variant="h4"><GlossaryIcon className={classes.glossaryIcon} />Glossary</Typography>
        <TextField
          id="outlined-basic"
          className={classes.glossaryTextField}
          label="Filter glossary terms"
          margin="normal"
          variant="outlined"
          placeholder="e.g. Fossil fuel"
          value={state.glossaryTerm}
          onChange={handleChange}
          tabIndex={state.toggleHidden && -1}
        />
      </div>
      
      {(filteredTerms.terms).map((term, index) => (
        <div key={index} aria-hidden={term.show} style={{ display: term.show ? 'block' : 'none' }}>
          <ExpansionPanel term={term.name}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>{term.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{term.definition}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      ))}
    </div>
  )

  return (
    <Fragment>
      <Drawer anchor="right" open={state.glossaryOpen} onClose={handleClose}>
        <CloseIcon className={classes.mobileMenuCloseButton} onClick={handleClose} />
        {glossaryList('right')}
      </Drawer>
    </Fragment>
  )
}

function filterGlossaryTerms (glossaryTerm) {
  let numOfTermsToShow = 0
  if (glossaryTerm !== undefined && glossaryTerm !== null && glossaryTerm !== '') {
    GLOSSARY_TERMS.forEach(term => {
      term.show = false
      if (term.name.toLowerCase().includes(glossaryTerm.toLowerCase())) {
        term.show = true
        numOfTermsToShow++
      }
    })
  }
  else {
    // eslint-disable-next-line no-return-assign
    GLOSSARY_TERMS.forEach(term => term.show = true)
  }
  return { terms: GLOSSARY_TERMS, toggle: (numOfTermsToShow === 1) }
}

export default GlossaryDrawer
