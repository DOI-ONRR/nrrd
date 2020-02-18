/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import { setConfig } from 'react-hot-loader'

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    'This application has been updated. ' +
      'Reload to display the latest version?'
  )

  if (answer === true) {
    window.location.reload()
  }
}

// You can delete this file if you're not using it
export { wrapRootElement } from './wrap-root-element'

// Remove hot loader warning in browser
setConfig({
  showReactDomPatchNotification: false
})
