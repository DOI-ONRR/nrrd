import React, {useContext, useState, useEffect} from 'react'
import { StoreContext } from '../../../store'

const fetchDataFilter = () => {
  const updatedFilter = {}
  const urlSearchParams = (typeof window !== 'undefined' && window) && new URLSearchParams(window.location.search)
  for (const searchParam of urlSearchParams.entries()) {
    updatedFilter[searchParam[0]] = searchParam[1]
  }
  return updatedFilter
}

const DataFilter = props => {
  const [filter, setFilter] = useState(fetchDataFilter())
  const { state, updateDataFilter } = useContext(StoreContext)

  useEffect(() => {
    updateDataFilter(filter)
  }, [filter])

  return (
    <div>DataFilter dfsadfds</div>
  )
}

export default DataFilter
