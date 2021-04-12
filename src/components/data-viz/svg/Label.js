import React from 'react'

const Label = ({ key, data, fill, fontSize, isClickable }) => {
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

export default Label
