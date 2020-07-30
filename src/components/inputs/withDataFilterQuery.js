import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import DFQM from '../../js/data-filter-query-manager/index'

import { DataFilterContext } from '../../stores/data-filter-store'
import { AppStatusContext } from '../../stores/app-status-store'

const withDataFilterQuery = (BaseComponent, dataFilterKey) => ({ ...props }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFQM.getQuery(dataFilterKey, state), DFQM.getVariables(state))
  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: 'Loading...' })
    return () => {
      if (loading) {
        updateLoadingStatus({ status: false, message: 'Loading...' })
      }
    }
  }, [loading])

  return (
    <>
      <BaseComponent data={data && data.options} {...props} />
    </>
  )
}

export default withDataFilterQuery
