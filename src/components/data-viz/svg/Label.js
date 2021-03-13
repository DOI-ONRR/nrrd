import React from 'react'

export const Label = ({ data, key, fill, fontSize, isClickable }) => {
  console.log('Label data: ', data)
  const styles = {
    default: {
      fontSize: fontSize
    },
    clickable: {
      cursor: 'pointer',
    }
  }
  return (
    <text
      key={`text__${ key }`}
      data={data}
      fill={fill}
      style={isClickable ? { ...styles.default, ...styles.clickable } : { ...styles.default }}
    >
      {data}
    </text>
  )
}
