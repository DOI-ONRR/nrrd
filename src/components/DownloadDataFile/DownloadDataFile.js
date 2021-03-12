import React from 'react'
// import PropTypes from 'prop-types'

import metaData from '../../../static/downloads/downloads.json'
import Link from '../Link'
import utils from '../../js/utils'

const DownloadDataFile = props => {
    console.debug('MetaData', metaData)
    console.debug('childrin', props.children)
    console.debug('UTILS: ', utils)
    console.debug('childrin', props)
    const href = './../' + props.dataSet
    const minDate = new Date(metaData[props.dataSet].minDate)
    const maxDate = new Date(metaData[props.dataSet].maxDate)
    const size = Math.round(metaData[props.dataSet].size / 1000000)

    const suffix=(props.linkType === 'DownloadCsv') ? 'csv' : 'xlsx'
    return (<>
      <Link   linkType={props.linkType} href={ href + '.' + suffix } > 
	{props.children + ', ' + minDate.getMonth() + 1 + '/' + minDate.getFullYear() + ' - ' + maxDate.getMonth() + 1 + '/' + maxDate.getFullYear() + ' (' + suffix +', ' + size + ' MB)' }
      </Link>
    </>
    )
}

export default DownloadDataFile
