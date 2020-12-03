import React, { useContext } from 'react'

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

const SectionControls = props => {
  const classes = useStyles()

  const { state: filterState } = useContext(DataFilterContext)
  const { monthly } = filterState
  const {
    maxFiscalYear,
    maxCalendarYear,
    dataType
  } = props

  const MENU_OPTIONS = {
    [DFC.MONTHLY]: [
      { value: DFC.YEARLY, option: DFC.YEARLY },
      { value: DFC.PERIOD_MONTHLY_YEAR, option: DFC.PERIOD_MONTHLY_YEAR }
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
    [DFC.BREAKOUT_BY]: [
      { value: 'source', option: 'Source' },
      { value: 'revenue', option: 'Revenue Type' },
      { value: 'commodity', option: 'Commodity' }
    ],
    [DFC.COMMODITY]: [
      { value: 'Oil (bbl)', option: 'Oil (bbl)' },
      { value: 'Gas (mcf)', option: 'Gas (mcf)' },
      { value: 'Coal (tons)', option: 'Coal (tons)' }
    ]
  }

  const disabled = props.disabledInput

  return (
    <div className={classes.sectionControlsContainer}>
      <YearlyMonthlyToggleInput
        dataFilterKey={DFC.MONTHLY}
        defaultSelected={DFC.YEARLY}
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
          data={MENU_OPTIONS[DFC.BREAKOUT_BY]}
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

export default SectionControls
