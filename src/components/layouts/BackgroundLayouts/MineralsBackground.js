import React from 'react'

import {
  Container,
  Box
} from '@material-ui/core'

const bgImage = {
  backgroundImage:
    'url("/images/how-it-works/minerals-top.png"), url("/images/how-it-works/minerals-bottom.png"), url("/images/how-it-works/minerals-middle.png")',
  backgroundRepeat: 'no-repeat, no-repeat, repeat-y',
  backgroundSize: '100%',
  backgroundPosition: '0 0, 0 100%, 0 0',
  width: '100%',
  backgroundColor: '#cef4ff'
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
