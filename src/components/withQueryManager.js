import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import QueryManager from '../js/query-manager'

import { DataFilterContext } from '../stores/data-filter-store'
import { AppStatusContext } from '../stores/app-status-store'

const withQueryManager = (BaseComponent, queryKey, options) => ({ ...props }) => {
  options = options || {}
  const { state, updateQueryDataFilterCounts } = useContext(DataFilterContext)
  const query = QueryManager.getQuery(queryKey, state, options || {})
  const rawVariables = QueryManager.getVariables(queryKey, state, options || {})
  
  // Remove properties with undefined values
  const sanitizedVariables = Object.fromEntries(
    Object.entries(rawVariables.variables).filter(([_, value]) => value !== undefined)
  )
  const { data, loading, error } = useQuery(query, {
    variables: sanitizedVariables
  })

  const { showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (data && data.counts && !loading) {
      updateQueryDataFilterCounts({
        counts: data.counts.aggregate
      })
    }
  }, [data])

  useEffect(() => {
    if (error) {
      console.log(error)
      showErrorMessage('We encountered a connection error retrieving the data. Check your internet connection and refresh your browser to try again.')
    }
  }, [error])

  return (
    <>
      <BaseComponent data={(data && data.options) ? data.options : data} {...props} loading={loading}/>
    </>
  )
}

export default withQueryManager
