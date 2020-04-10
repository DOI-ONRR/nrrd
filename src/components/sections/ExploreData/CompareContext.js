import React from 'react'

const CompareContext = props => {
  console.log('CompareContext props: ', props)

  return (
    <>
      {props.children}
    </>
  )
}

export default CompareContext
