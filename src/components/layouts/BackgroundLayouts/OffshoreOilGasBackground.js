import React from 'react'
import { withPrefix } from 'gatsby'

import {
  Container,
  Box
} from '@material-ui/core'

const bgImage = {
  backgroundImage:
    `url(${withPrefix('/images/how-it-works/offshore-oil-top.png')}),url(${withPrefix('/images/how-it-works/offshore-oil-bottom.png')}),${withPrefix('url("/images/how-it-works/offshore-oil-middle.png')})`,
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
