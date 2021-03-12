import React from 'react'

export const Label = ({ data, key, fill, fontSize, isClickable }) => {
  console.log('Label data: ', data)
  const styles = {
    default: {
      cursor: 'pointer',
      fontSize: fontSize
    }
  }
  return (
    <text
      key={`text__${ key }`}
      data={data}
      fill={fill}
      style={isClickable ? styles.default : {}}
    >
      {data}
    </text>
  )
}
