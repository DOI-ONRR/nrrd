import { createMuiTheme } from '@material-ui/core/styles'

import palette from './palette'
import typography from './typography'
import overrides from './overrides'

// https://react-theming.github.io/create-mui-theme/
// https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=5c737f&secondary.color=cde3c3

// Most Important Theme Variables
// Palette
// Typography
// Spacing
// Breakpoints
// z-index
// Globals/Overrides

const theme = createMuiTheme({
  palette: palette,
  typography: typography
})

export default theme
