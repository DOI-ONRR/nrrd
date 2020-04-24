import React from 'react'

import {
  Container,
  Box
} from '@material-ui/core'

const bgImage = {
  backgroundImage:
    'url("/images/how-it-works/renew-onshore.svg"), url("/images/how-it-works/renewables-bg-gradient.png")',
  backgroundRepeat: 'no-repeat, repeat-x',
  backgroundSize: '100%, contain',
  backgroundPosition: '0 100%, 0 0',
  width: '100%'
}

export default ({ children }) => (
  <Box display='inline-box' style={bgImage} mt={2}>
    <Container maxWidth="lg" component="section">
      <Box>
        { children }
      </Box>
    </Container>
  </Box>
)
