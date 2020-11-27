import React from 'react'
// import PropTypes from 'prop-types'
//import { useStaticQuery, graphql } from 'gatsby'
import {EXCEL, CSV} from '../../constants'
import { downloadWorkbook } from '../../js/utils'
import Link from '../Link'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const DOWNLOAD_REVENUE = gql`	
    query DownloadData {
	    fiscal_year_revenue: download_fiscal_year_revenue {
		commodity
		county
		district_type
		fips_code
		fiscal_year
		land_category
		land_class
		land_type
		location_name
		offshore_region
		period
		period_date
		product
		region_type
		revenue
		row_number
		state
		state_name
	    },
	    calendar_year_revenue: download_calendar_year_revenue {
		calendar_year
		period_date
		period
		region_type
		state
		state_name
		county
		district_type
		fips_code
		land_category
		land_class
		land_type
		location_name
		offshore_region
		commodity
		product
		revenue
		row_number

	    }
    }
`
const DownloadDataFile = ( props ) => {
    const { loading, error, data } = useQuery(DOWNLOAD_REVENUE)

    console.debug("Data: ",data)
    if (loading) {
	return 'Loading...'
     }
    
    if (error) return `Error! ${ error.message }`
    
    const fileType=props.fileType
    //const fileName=props.fileName
    const dataType=props.dataType
    const dataPeriod=props.dataPeriod
    const fileBaseName=dataPeriod.toLowerCase() + '_' +dataType.toLowerCase()
    
    
    const linkType=(props.fileType == 'excel') ? 'DownloadXls' : 'DownloadCsv'
    const fileExtension=(props.fileType == 'excel') ? 'xlsx' : ''
    const fileName=fileBaseName +'.'+fileExtension
    const handleDownload = () => {


	const cols=Object.keys(data[fileBaseName][0]).map( (d,i)=>({title: d, name: d})) 
	const rows=data[fileBaseName]
	console.debug("Handle download Here fileName here",cols, rows)
	const r=downloadWorkbook(
            fileType,
            fileName,
            fileBaseName,
	    cols,
            rows )
	console.debug("return from downloadWorkbook", r)
	
    }
    console.debug("LINK TYPE :", linkType)
   if (data) {

	return (
	    <Link linkType={linkType} href={'#' + fileName } onClick={() => handleDownload() } >
	      {props.children}
	    </Link>
	)
   }else { return (null) }
}

export default DownloadDataFile
