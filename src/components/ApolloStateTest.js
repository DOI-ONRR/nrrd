import React, { useState } from "react"

import { graphql } from "gatsby"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"

import Button from "@material-ui/core/Button"

const CACHE_QUERY = gql`
  {
    apolloCount @client
  }
`

const CACHE_QUERY2 = gql`
  {
    selectedYear @client
  }
`

const ReadQueryCache = props => {
  const { loading, error, data, client } = useQuery(CACHE_QUERY)
  
  if (data) {
    console.log(data)
    return data
  }

  if (loading) 
    return loading
  
  if (error) 
    return error
}

const ApolloStateTest = props => {
  // const {data, loading, error, client} = useQuery(CACHE_QUERY)
  const [count, setCount] = useState(0)
  const { data, client } = useQuery(CACHE_QUERY2)

  console.log(data)

  let results = ReadQueryCache()
  console.log(results)

  const incrementCount = () => {
    setCount(count + 1)
    client.writeData({ data: { apolloCount: count } })
  }


  // if(loading)
  //   console.log('loading...')

  // if(error) 
  //   console.error(error)
  
  
  return (
    <>
      <div>Apollo State Test: {count}</div>
      <button onClick={incrementCount}>Click me</button>
    </>
  )
}

export default ApolloStateTest