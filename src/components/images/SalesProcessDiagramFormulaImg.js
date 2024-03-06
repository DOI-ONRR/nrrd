import React from 'react'
import salesDiagramPng from '../../images/process-diagram-step1-equation.png'

const altText = `Royalty due equals open parenthesis sales volume multiplied by unit value multiplied by royalty rate close parenthesis subtract allowances.
The Royalty Value Prior to allowances (RVPA) includes sales volume multiplied by unit value multiplied by royalty rate. Royalty Value Less Allowances
(RVLA) includes open parenthesis sales volume multiplied by unit value multiplied by royalty rate close parenthesis subtract allowances.`

export default ({ alt, ...rest }) =>
  <img src={salesDiagramPng}
    alt={alt || altText}
    {...rest}
    style={{ width: '100%' }}/>
