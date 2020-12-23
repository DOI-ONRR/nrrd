import React, { useContext, useEffect } from 'react'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import { makeStyles } from '@material-ui/core/styles'

import {
  BreakoutBySelectInput,
  CommoditySelectInput,
  PeriodSelectInput,
  YearlyMonthlyToggleInput
} from '../../inputs'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
    textAlign: 'right',
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  periodToggleButton: {
    '&:hover': {
      backgroundColor: `${ theme.palette.links.default } !important`,
      color: theme.palette.common.white,
    },
  },
  sectionControlContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  sectionControlsContainer: {
    '& > div:first-child': {
      marginTop: 4,
    },
    '& > div:nth-child(2)': {
      marginTop: -6,
    },
    '& > div:nth-child(3)': {
      marginTop: -6,
    }
  }
}))

const HomeDataFilters = props => {
  const classes = useStyles()

  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)
  const { monthly, dataType, period, breakoutBy } = filterState
  const {
    maxFiscalYear,
    maxCalendarYear
  } = props

  const MENU_OPTIONS = {
    [DFC.MONTHLY]: [
      { value: DFC.YEARLY, option: DFC.YEARLY },
      { value: DFC.PERIOD_MONTHLY, option: DFC.PERIOD_MONTHLY }
    ],
    [DFC.PERIOD]: [
      { value: DFC.PERIOD_FISCAL_YEAR, option: DFC.PERIOD_FISCAL_YEAR },
      { value: DFC.PERIOD_CALENDAR_YEAR, option: DFC.PERIOD_CALENDAR_YEAR }
    ],
    monthlyPeriod: [
      { value: 'Most recent 12 months', option: 'Most recent 12 months' },
      { value: DFC.PERIOD_FISCAL_YEAR, option: `Fiscal year ${ maxFiscalYear }` },
      { value: DFC.PERIOD_CALENDAR_YEAR, option: `Calendar year ${ maxCalendarYear }` }
    ],
    [DFC.BREAKOUT_BY]: {
      [DFC.REVENUE]: [
        { value: 'source', option: 'Source' },
        { value: 'revenue_type', option: 'Revenue Type' },
        { value: 'commodity', option: 'Commodity' }
      ],
      [DFC.DISBURSEMENT]: [
        { value: 'source', option: 'Source' },
        { value: 'recipient', option: 'Recipient' },
      ]
    },
    [DFC.COMMODITY]: [
      { value: 'Oil (bbl)', option: 'Oil (bbl)' },
      { value: 'Gas (mcf)', option: 'Gas (mcf)' },
      { value: 'Coal (tons)', option: 'Coal (tons)' }
    ]
  }

  const disabled = props.disabledInput

  useEffect(() => {
    switch (dataType) {
    case DFC.REVENUE:
      updateDataFilter({ ...filterState, [DFC.BREAKOUT_BY]: MENU_OPTIONS[DFC.BREAKOUT_BY][DFC.REVENUE][0].value })
      break
    case DFC.DISBURSEMENT:
      updateDataFilter({ ...filterState, [DFC.PERIOD]: (monthly === DFC.YEARLY) ? MENU_OPTIONS[DFC.PERIOD][0].option : MENU_OPTIONS.monthlyPeriod[0].option })
      updateDataFilter({ ...filterState, [DFC.BREAKOUT_BY]: MENU_OPTIONS[DFC.BREAKOUT_BY][DFC.DISBURSEMENT][0].value })
      break
    case DFC.PRODUCTION:
      break
    default:
      break
    }
  }, [monthly, dataType])

  return (
    <div className={classes.sectionControlsContainer}>
      <YearlyMonthlyToggleInput
        dataFilterKey={DFC.MONTHLY}
        defaultSelected={monthly || DFC.YEARLY}
        data={MENU_OPTIONS[DFC.MONTHLY]}
        label=""
        legend=""
        size="medium" />
      {(dataType === DFC.DISBURSEMENT && monthly === DFC.YEARLY) &&
          <PeriodSelectInput
            dataFilterKey={DFC.PERIOD}
            data={[DFC.PERIOD_FISCAL_YEAR]}
            selected={[DFC.PERIOD_FISCAL_YEAR]}
            label="Period"
            selectType="Single"
            showClearSelected={false}
            disabled={true}
          />
      }
      {(dataType !== DFC.DISBURSEMENT || (dataType === DFC.DISBURSEMENT && monthly === DFC.MONTHLY_CAPITALIZED)) &&
        <PeriodSelectInput
          dataFilterKey={DFC.PERIOD}
          data={monthly === DFC.YEARLY ? MENU_OPTIONS[DFC.PERIOD] : MENU_OPTIONS.monthlyPeriod}
          defaultSelected={MENU_OPTIONS.monthlyPeriod[0].option}
          selected={monthly === DFC.YEARLY ? MENU_OPTIONS[DFC.PERIOD][0].option : MENU_OPTIONS.monthlyPeriod[0].option}
          label="Period"
          selectType="Single"
          showClearSelected={false}
          disabled={disabled}
        />
      }
      {dataType !== DFC.PRODUCTION &&
        <BreakoutBySelectInput
          dataFilterKey={DFC.BREAKOUT_BY}
          data={(dataType === DFC.REVENUE) ? MENU_OPTIONS[DFC.BREAKOUT_BY][DFC.REVENUE] : MENU_OPTIONS[DFC.BREAKOUT_BY][DFC.DISBURSEMENT]}
          defaultSelected={(dataType === DFC.REVENUE) ? MENU_OPTIONS[DFC.BREAKOUT_BY][DFC.REVENUE][0].option : MENU_OPTIONS[DFC.BREAKOUT_BY][DFC.DISBURSEMENT][0].option}
          label="Breakout"
          selectType="Single" />
      }
      {dataType === DFC.PRODUCTION &&
        <CommoditySelectInput
          dataFilterKey={DFC.COMMODITY}
          data={MENU_OPTIONS[DFC.COMMODITY]}
          selected={MENU_OPTIONS[DFC.COMMODITY][0].option}
          label="Commodity"
          selectType="Single"
          showClearSelected={false} />
      }
    </div>

  )
}

export default HomeDataFilters
