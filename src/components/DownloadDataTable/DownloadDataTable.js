import React from 'react'
// import PropTypes from 'prop-types'

import { downloadWorkbook as downloadExcel } from '../../js/utils'

import Button from '@material-ui/core/Button'
import TableChart from '@material-ui/icons/TableChart'

const DownloadDataTable = () => {
  const downloadStuff = () => {
    downloadExcel()
  }
  return (
    <Button
      variant="contained"
      color="primary"
      aria-label="open data filters"
      onClick={downloadStuff}
      onKeyDown={downloadStuff}
      startIcon={<TableChart />}
    >
    Download table to excel
    </Button>
  )
}

export default DownloadDataTable
