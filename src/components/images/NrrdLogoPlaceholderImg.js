import React from 'react'
import NRRDLogoPng from '../../images/logos/nrrd-logo-placeholder-light-blue.png'

const NrrdLogoPlaceHolderImg = ({ alt, ...rest }) => {
  return (
    <img src={NRRDLogoPng} alt={alt || 'Natuarl Resources and Revenue Data'} {...rest} />
  )
}

export default NrrdLogoPlaceHolderImg
