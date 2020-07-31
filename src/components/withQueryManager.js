import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import QueryManager from '../js/query-manager'

import { DataFilterContext } from '../stores/data-filter-store'
import { AppStatusContext } from '../stores/app-status-store'

const withQueryManager = (BaseComponent, queryKey) => ({ ...props }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(QueryManager.getQuery(queryKey, state), QueryManager.getVariables(queryKey, state))
  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (error) {
      showErrorMessage('We encountered a connection error retrieving the data. Check your internet connection and refresh your browser to try again.')
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
      <BaseComponent data={data} {...props} />
    </>
  )
}

export default withQueryManager
