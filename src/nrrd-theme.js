import { createMuiTheme } from '@material-ui/core/styles';

// https://react-theming.github.io/create-mui-theme/
// https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=5c737f&secondary.color=cde3c3

const theme = createMuiTheme({
  primary: { main: '#5c737f' },
  secondary: { main: '#cde3c3' }
})

export default theme
