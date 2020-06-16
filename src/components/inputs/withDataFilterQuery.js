import React, { useEffect, useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../stores/data-filter-store'
import { AppStatusContext } from '../../stores/app-status-store'
import DFQM from '../../js/data-filter-query-manager/index'

const WithDataFilterQuery = (WrappedComponent, dataFilterKey, passThroughProps) => {
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
  }, [loading])

  return (
    <>
      {!loading &&
        <WrappedComponent dataFilterKey={dataFilterKey} data={data.options} {...passThroughProps}/>
      }
    </>
  )
}

export default WithDataFilterQuery
