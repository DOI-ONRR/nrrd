import React from 'react'
import NRRDLogoPng from '../../images/logos/nrrd-logo-placeholder-light-blue.png'

export default ({ alt, ...rest }) => <img src={NRRDLogoPng} alt={alt || 'Natuarl Resources and Revenue Data'} {...rest} style={{ maxHeight: 65, marginRight: 5 }} />
