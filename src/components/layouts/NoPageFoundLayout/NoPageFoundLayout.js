import React from 'react'

import SEO from '../../seo'

import {
  Container
} from '@material-ui/core'

import makeStyles from '@material-ui/core/styles/makeStyles'

import Rig404 from '-!svg-react-loader!../../../img/svg/rig-404.svg'

const useStyles = makeStyles(theme => (
  {
    root: {
      backgroundColor: '#d3dfe6',
      color: '#435159',
      margin: '0',
      padding: '1.25em 1.875em',
      textAlign: 'center',
      height: '100vh'
    },
  })
)

const NoPageFoundLayout = ({ children }) => {
  const classes = useStyles()
  return (
    <>
      <SEO title="404: Not found" />
      <Container className={classes.root} maxWidth={false}>
        <Container maxWidth="lg">
          <Rig404 />
          {children}
        </Container>
      </Container>
    </>
  )
}

export default NoPageFoundLayout
