const tableConfig = {
  columns: [
    { name: 'commodity', title: 'Commodity' },
    { name: 'calendarYear', title: 'Sales Year' },
    { name: 'salesValue', title: 'Sales Value' },
    { name: 'salesVolume', title: 'Sales Volume' },
    { name: 'royaltyValuePriorToAllowance', title: 'Royalty Value Prior to Allowances' },
    { name: 'transportationAllowance', title: 'Transportation Allowance' },
    { name: 'processingAllowance', title: 'Processing Allowance' },
    { name: 'royaltyValueLessAllowance', title: 'Royalty Value Less Allowances' }
  ],
  groupSummaryItems: [
    { columnName: 'salesValue', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'salesVolume', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'royaltyValuePriorToAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'transportationAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'processingAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'royaltyValueLessAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true }
  ],
  totalSummaryItems: [
    { columnName: 'salesValue', type: 'sum', alignByColumn: true },
    { columnName: 'salesVolume', type: 'sum', alignByColumn: true },
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
  breakoutOptions: [
    {
      option: 'Land type',
      value: 'landType'
    },
    {
      option: 'State/Offshore Region',
      value: 'stateOffshoreRegion'
    }
  ]
}

export default tableConfig
