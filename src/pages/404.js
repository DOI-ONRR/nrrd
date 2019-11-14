import React from 'react'

import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import DefaultLayout from '../components/layouts/DefaultLayout'
import SEO from '../components/seo'
import Rig404 from '-!svg-react-loader!../img/svg/rig-404.svg'
import { classicNameResolver } from 'typescript'

const useStyles = makeStyles(theme => ({
  root: {
    color: '#000',
    backgroundColor: '#d3dfe6',
    color: '#435159',
    margin: '0',
    padding: '1.25em 1.875em',
    textAlign: 'center',
  },
}))

const NotFoundPage = () => {
  const classes = useStyles()

  return (
    <DefaultLayout>
      <SEO title="404: Not found" />
      <Container className={classes.root} maxWidth={false}>
        <Container maxWidth="lg">
          <div>
            <Rig404 />
            <div>
              <h1>There’s nothing here.</h1>
              <p>If we’re missing something, please let us know at <a href="mailto:nrrd@onrr.gov">nrrd@onrr.gov</a>. You can contact us in other ways below 👇.</p>
            </div>
          </div>
        </Container>
      </Container>
    </DefaultLayout>
  )
}

export default NotFoundPage
