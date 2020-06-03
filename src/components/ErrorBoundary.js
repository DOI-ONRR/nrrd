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
        <Container maxWidth="lg">
          <h1>An error has occurred.</h1>
          <a href='/'><p>Please click here to return to the home page.</p></a>
        </Container>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
