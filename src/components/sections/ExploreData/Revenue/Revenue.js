import React, { useContext } from 'react'

import { StoreContext } from '../../../../store'

import CONSTANTS from '../../../../js/constants'


export default props => {
  const { state } = useContext(StoreContext)
  const dataType = state.dataType

  return (
    (dataType === CONSTANTS.REVENUE) ? <>{props.children}</> : null
  )
}
