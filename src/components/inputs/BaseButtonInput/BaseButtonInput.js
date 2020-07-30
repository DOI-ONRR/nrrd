import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'

import {
  makeStyles,
  useTheme
} from '@material-ui/core/styles'

import { formatToSlug } from '../../../js/utils'

const useDefaultStyles = makeStyles(theme => ({
  root: {
    color: 'white',
    backgroundColor: theme.palette.links.default
  },
}))

const useLinkStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.links.default,
    fontSize: '0.85rem',
    lineHeight: '0.85rem',
    padding: '0px',
    textDecoration: 'underline',
    whiteSpace: 'nowrap'
  },
}))

const BaseButtonInput = ({ onClick, label, variant, styleType, classes, disabled, ...props }) => {
  const theme = useTheme()
  const defaultStyles = useDefaultStyles(theme)
  const linkStyles = useLinkStyles(theme)

  const getClasses = () => {
    if (classes) {
      return classes
    }
    if (styleType === 'link') {
      return linkStyles
    }
    return defaultStyles
  }

  const noop = () => {}

  return (
    <>
      <SingleButton
        label={label}
        variant={variant}
        onClick={onClick || noop}
        classes={getClasses()}
        disabled={disabled}
        {...props}/>
    </>
  )
}

BaseButtonInput.propTypes = {
  /**
   * Text that displays on the component
   */
  label: PropTypes.string,
}

export default BaseButtonInput

const SingleButton = ({ label, onClick, classes, disabled, children, ...props }) => {
  const labelSlug = label ? formatToSlug(label) : undefined

  const handleOnClick = event => {
    onClick(event)
  }

  return (
    <Button
      id={labelSlug}
      classes={{
        root: classes.root
      }}
      onClick={handleOnClick}
      {...props} >
      {label}
      {children}
    </Button>
  )
}
