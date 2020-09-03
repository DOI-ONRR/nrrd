import React from 'react'
import usFlagLogoPng from '../../images/icons/us-flag-small.png'

export default ({ alt, ...rest }) => <img src={usFlagLogoPng} alt={alt || 'US Flag'} {...rest} style={{ width: 16, height: 11 }} />
