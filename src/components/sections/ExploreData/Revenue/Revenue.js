import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../../store'

import CONSTANTS from '../../../../js/constants'


export default props => {
  const { state } = useContext(StoreContext)
  const dataType = state.dataType

  return (
    (dataType === CONSTANTS.REVENUE) ? <>{props.children}</> : null
  )
}
