import React from 'react'
import NRRDLogoPng from '../../images/logos/nrrd-logo-placeholder-wht.png'

export default ({ alt, ...rest }) => <img src={NRRDLogoPng} alt={alt || 'Natuarl Resources and Revenue Data'} {...rest} style={{ width: 250, marginRight: 5 }} />
