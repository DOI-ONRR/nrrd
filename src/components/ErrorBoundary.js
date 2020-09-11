import React from 'react'
import Container from '@material-ui/core/Container'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  // eslint-disable-next-line handle-callback-err
  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({ hasError: true })
    // You can also log the error to an error reporting service
    console.error(error, info)
  }

  render () {
    if (this.state.hasError) {
      return (
        <Container maxWidth={false}>
          <Container maxWidth="lg">
            <div>
              <h1>An error has occurred</h1>
              <a href='/'><p>Please click here to return to the home page.</p></a>
              <p>If you need additional help, please let us know at <a href="mailto:nrrd@onrr.gov">nrrd@onrr.gov</a>.</p>
            </div>
          </Container>
        </Container>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
