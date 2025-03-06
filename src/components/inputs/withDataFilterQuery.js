import React, { useContext, useEffect } from 'react'
import { useQuery } from 'urql'
import DFQM from '../../js/data-filter-query-manager/index'

import { DataFilterContext } from '../../stores/data-filter-store'
import { AppStatusContext } from '../../stores/app-status-store'

const withDataFilterQuery = (BaseComponent, dataFilterKey) => ({ ...props }) => {
  const { state } = useContext(DataFilterContext)
  
  const [result, _reexecuteQuery] = useQuery({
    query: DFQM.getQuery(dataFilterKey, state), 
    variables: DFQM.getVariables(state),
  });

  const { data, fetching, error } = result;

  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: 'Loading...' })
    return () => {
      if (fetching) {
        updateLoadingStatus({ status: false, message: 'Loading...' })
      }
    }
  }, [fetching])

  return (
    <>
      <BaseComponent data={data && data.options} {...props} />
    </>
  )
}

export default withDataFilterQuery
