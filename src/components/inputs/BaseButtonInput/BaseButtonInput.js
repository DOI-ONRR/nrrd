import React from 'react'
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
    backgroundColor: theme.palette.links.default,
    whiteSpace: 'nowrap'
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
/**
 * This is the base of all button inputs on the site.
 */
const BaseButtonInput = ({ onClick, children, variant, styleType, classes, disabled, ...props }) => {
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

  const SingleButton = ({ onClick, classes, disabled, children, ...props }) => {
    const labelSlug = children ? formatToSlug(children) : undefined

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
        {children}
      </Button>
    )
  }

  return (
    <>
      <SingleButton
        variant={variant}
        onClick={onClick || noop}
        classes={getClasses()}
        disabled={disabled}
        {...props}>
        {children}
      </SingleButton>
    </>
  )
}

BaseButtonInput.propTypes = {
  /** Text that displays on the button */
  styleType: PropTypes.oneOf(['link']),
}

export default BaseButtonInput

BaseButtonInput.Preview = {
  group: 'Inputs',
  demos: [
    {
      title: 'Simple Button',
      code: '<BaseButtonInput>Click me</BaseButtonInput>',
    },
    {
      title: 'Link Style Button',
      code: '<BaseButtonInput styleType="link">Click me</BaseButtonInput>',
    }
  ]
}
