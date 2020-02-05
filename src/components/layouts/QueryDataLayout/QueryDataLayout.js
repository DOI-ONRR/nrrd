/**
 * Downloads Layout component is applied to all downloads pages in the downloads directory
 * unless specified by a page using the layout fronmatter property.
 *
 * This layout includes:
 * - DefaultContentLayout
 * - DataFilterProvider
 */
import React from 'react'
import PropTypes from 'prop-types'

import DefaultContentLayout from '../DefaultContentLayout'
import { DataFilterProvider } from '../../../stores'

const QueryDataLayout = ({ children }) => {
  console.log('QueryDataLayout')
  return (
    <DefaultContentLayout>
      <DataFilterProvider>
        {children}
      </DataFilterProvider>
    </DefaultContentLayout>
  )
}

QueryDataLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default QueryDataLayout
