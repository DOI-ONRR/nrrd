const tableConfig = {
  columns: [
    { name: 'commodity', title: 'Commodity' },
    { name: 'calendarYear', title: 'Sales Year' },
    { name: 'salesVolume', title: 'Sales Volume' },
    { name: 'salesValue', title: 'Sales Value' },
    { name: 'royaltyValuePriorToAllowance', title: 'Royalty Value Prior to Allowances (RVPA)' },
    { name: 'transportationAllowance', title: 'Transportation Allowances (TA)' },
    { name: 'processingAllowance', title: 'Processing Allowances (PA)' },
    { name: 'royaltyValueLessAllowance', title: 'Royalty Value Less Allowances (RVLA)' }
  ],
  groupSummaryItems: [
    { columnName: 'salesVolume', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'salesValue', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'royaltyValuePriorToAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'transportationAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'processingAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'royaltyValueLessAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true }
  ],
  totalSummaryItems: [
    { columnName: 'salesVolume', type: 'sum', alignByColumn: true },
    { columnName: 'salesValue', type: 'sum', alignByColumn: true },
    { columnName: 'royaltyValuePriorToAllowance', type: 'sum', alignByColumn: true },
    { columnName: 'transportationAllowance', type: 'sum', alignByColumn: true },
    { columnName: 'processingAllowance', type: 'sum', alignByColumn: true },
    { columnName: 'royaltyValueLessAllowance', type: 'sum', alignByColumn: true }
  ],
  currencyColumns: [
    'salesValue',
    'royaltyValuePriorToAllowance',
    'transportationAllowance',
    'processingAllowance',
    'royaltyValueLessAllowance'
  ],
  numberColumns: [
    'salesVolume'
  ],
  columnExtensions: [
    {
      columnName: 'salesValue',
      align: 'right'
    },
    {
      columnName: 'salesVolume',
      align: 'right'
    },
    {
      columnName: 'royaltyValuePriorToAllowance',
      align: 'right'
    },
    {
      columnName: 'transportationAllowance',
      align: 'right'
    },
    {
      columnName: 'processingAllowance',
      align: 'right'
    },
    {
      columnName: 'royaltyValueLessAllowance',
      align: 'right'
    }
  ],
  defaultSorting: [
    {
      columnName: 'commodity',
      direction: 'asc'
    }
  ],
  grouping: [
    {
      columnName: 'commodity'
    }
  ],
  defaultExpandedGroups: ['Gas (MMBtu)', 'NGL (gal)', 'Oil (bbl)'],
  breakoutOptions: [
    {
      option: 'Land type',
      value: 'landType'
    },
    {
      option: 'State/Offshore Region',
      value: 'stateOffshoreRegion'
    }
  ],
  defaultColumnWidths: [
    {
      columnName: 'commodity',
      width: 150
    },
    {
      columnName: 'calendarYear',
      width: 250
    },
    {
      columnName: 'landType',
      width: 250
    },
    {
      columnName: 'stateOffshoreRegion',
      width: 250
    },
    {
      columnName: 'salesValue',
      width: 250
    },
    {
      columnName: 'salesVolume',
      width: 225
    },
    {
      columnName: 'royaltyValuePriorToAllowance',
      width: 250
    },
    {
      columnName: 'transportationAllowance',
      width: 250
    },
    {
      columnName: 'processingAllowance',
      width: 200
    },
    {
      columnName: 'royaltyValueLessAllowance',
      width: 250
    }
  ]
}

export default tableConfig
