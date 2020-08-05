import React from 'react'

import FilterTableIconSvg from '-!svg-react-loader!../../images/icons/filter-table.svg'

import HowWorksLinkIconSvg from '-!svg-react-loader!../../images/icons/how-works.svg'
import HowMainIconOilSvg from '-!svg-react-loader!../../images/how-it-works/how-main-icon-oil.svg'
import HowMainIconHardrockSvg from '-!svg-react-loader!../../images/how-it-works/how-main-icon-hardrock.svg'
import HowMainIconWindSvg from '-!svg-react-loader!../../images/how-it-works/how-main-icon-wind.svg'
import HowMainIconCoalSvg from '-!svg-react-loader!../../images/how-it-works/how-main-icon-coal.svg'
import HowItWorksRibbonGraphicSvg from '-!svg-react-loader!../../images/how-it-works/how-it-works-ribbon-graphic.svg'
import AmlUnappropGrowthSvg from '-!svg-react-loader!../../images/how-it-works/AML_unapprop-growth.svg'

import OnrrLogoSvg from '-!svg-react-loader!../../images/logos/ONRR-mark.svg'
import NrrdLogoSvg from '-!svg-react-loader!../../images/logos/NRRD-logo.svg'

import IconOilSvg from '-!svg-react-loader!../../images/icons/icon-oil.svg'
import IconCoalSvg from '-!svg-react-loader!../../images/icons/icon-coal.svg'
import IconHardrockSvg from '-!svg-react-loader!../../images/icons/icon-hardrock.svg'
import IconGeothermalSvg from '-!svg-react-loader!../../images/icons/icon-geothermal.svg'
import IconRenewablesSvg from '-!svg-react-loader!../../images/icons/icon-renewables.svg'
import IconArchiveSvg from '-!svg-react-loader!../../images/icons/icon-archive.svg'
import IconDownloadBaseSvg from '-!svg-react-loader!../../images/icons/icon-download-base.svg'
import IconDownloadXlsSvg from '-!svg-react-loader!../../images/icons/icon-download-xls.svg'
import IconDownloadCsvSvg from '-!svg-react-loader!../../images/icons/icon-download-csv.svg'
import IconDownloadDataSvg from '-!svg-react-loader!../../images/icons/icon-download-data.svg'
import IconQuestionCircleSvg from '-!svg-react-loader!../../images/icons/icon-question-circle.svg'

export const FilterTableIconImg = props => <FilterTableIconSvg {...props} />

export const HowWorksLinkIconImg = props => <HowWorksLinkIconSvg style={{ verticalAlign: 'middle', fill: 'currentColor' }} {...props} />
export const HowMainIconOilImg = props => <HowMainIconOilSvg {...props} />
export const HowMainIconHardrockImg = props => <HowMainIconHardrockSvg {...props} />
export const HowMainIconWindImg = props => <HowMainIconWindSvg {...props} />
export const HowMainIconCoalImg = props => <HowMainIconCoalSvg {...props} />
export const HowItWorksRibbonGraphicImg = props => <HowItWorksRibbonGraphicSvg {...props} />
// eslint-disable-next-line max-len
export const AmlUnappropGrowthImg = ({ alt, ...props }) => <AmlUnappropGrowthSvg {...props} alt={alt || "Chart shows the growth of the AML fund's unappropriated balance from 1989 to 2017. It grew from around $500 million to nearly $2.5 billion dollars in 2015, before falling slightly to $2.38 billion in 2017."}/>

export const OnrrLogoImg = props => <OnrrLogoSvg {...props} />
export const NrrdLogoImg = props => <NrrdLogoSvg {...props} />

export const IconOilImg = props => <IconOilSvg {...props} />
export const IconCoalImg = props => <IconCoalSvg {...props} />
export const IconHardrockImg = props => <IconHardrockSvg {...props} />
export const IconGeothermalImg = props => <IconGeothermalSvg {...props} />
export const IconRenewablesImg = props => <IconRenewablesSvg {...props} />
export const IconArchiveImg = props => <IconArchiveSvg style={{ verticalAlign: 'middle' }} {...props}/>
export const IconDownloadBaseImg = props => <IconDownloadBaseSvg style={{ verticalAlign: 'middle', fill: 'currentColor' }} {...props}/>
export const IconDownloadXlsImg = props => <IconDownloadXlsSvg style={{ verticalAlign: 'middle', fill: 'currentColor' }} {...props}/>
export const IconDownloadCsvImg = props => <IconDownloadCsvSvg style={{ verticalAlign: 'middle', fill: 'currentColor' }} {...props}/>
export const IconDownloadDataImg = props => <IconDownloadDataSvg style={{ verticalAlign: 'middle', fill: 'currentColor' }} {...props}/>
export const IconQuestionCircleImg = props => <IconQuestionCircleSvg style={{ width: '16px', height: '16px', marginLeft: '1.6px', fill: 'currentColor' }} {...props}/>
