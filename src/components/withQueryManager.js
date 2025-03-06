import React, { useContext, useEffect } from 'react'
import { useQuery } from 'urql'
import QueryManager from '../js/query-manager'

import { DataFilterContext } from '../stores/data-filter-store'
import { AppStatusContext } from '../stores/app-status-store'

const withQueryManager = (BaseComponent, queryKey, options) => ({ ...props }) => {
  options = options || {}
  const { state, updateQueryDataFilterCounts } = useContext(DataFilterContext)
  const [result, _reexecuteQuery] = useQuery({
    query: QueryManager.getQuery(queryKey, state, options || {}),
    variables: QueryManager.getVariables(queryKey, state, options || {})
  });

  const { data, fetching, error } = result;

  const { showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (data && data.counts && !fetching) {
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
