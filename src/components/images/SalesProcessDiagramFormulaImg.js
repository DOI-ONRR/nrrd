import React from 'react'
import salesDiagramPng from '../../images/process-diagram-step1-equation.png'

const altText = `Royalty Value Prior to Allowances or RVPA equals sales volume multiplied by unit value multiplied by royalty rate. The Royalty due equals the RVPA 
minus allowances. The royalty due is equivalent to the Royalty Value Less Allowances or RVLA.`

export default ({ alt, ...rest }) =>
  <img src={salesDiagramPng}
    alt={alt || altText}
    {...rest}
    style={{ width: '100%' }}/>
