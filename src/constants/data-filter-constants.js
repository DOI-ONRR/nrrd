import gql from 'graphql-tag'

export const DATA_TYPE = 'dataType'
export const LAND_CLASS = 'landClass'
export const LAND_CATEGORY = 'landCategory'
export const OFFSHORE_REGION = 'offshoreRegion'
export const OFFSHORE_REGIONS = 'offshoreRegions'
export const US_STATE = 'state'
export const US_STATES = 'usStates'
export const COUNTY = 'county'
export const COUNTIES = 'counties'
export const COMMODITY = 'commodity'
export const COMMODITIES = 'commodities'
export const REVENUE_TYPE = 'revenueType'
export const REVENUE_TYPES = 'revenueTypes'
export const FISCAL_YEAR = 'fiscalYear'
export const FISCAL_YEARS = 'fiscalYears'
export const CALENDAR_YEAR = 'calendarYear'
export const MONTHLY = 'monthly'
export const PERIOD = 'period'
export const YEAR = 'year'
export const RECIPIENT = 'recipient'
export const SOURCE = 'source'

export const PERIOD_FISCAL_YEAR = 'Fiscal Year'
export const PERIOD_CALENDAR_YEAR = 'Calendar Year'
export const PERIOD_MONTHLY_YEAR = 'Monthly'
export const GROUP_BY = 'groupBy'
export const BREAKOUT_BY = 'breakoutBy'
export const NO_BREAKOUT_BY = 'noBreakoutBy'
export const ZERO_OPTIONS = 'zeroOptions'

export const LAND_CLASS_OPTIONS = 'landClassOptions'
export const LAND_CATEGORY_OPTIONS = 'landCategoryOptions'
export const OFFSHORE_REGION_OPTIONS = 'offshoreRegionOptions'
export const US_STATE_OPTIONS = 'usStateOptions'
export const COUNTY_OPTIONS = 'countyOptions'
export const COMMODITY_OPTIONS = 'commodityOptions'
export const REVENUE_TYPE_OPTIONS = 'revenueTypeOptions'
export const FISCAL_YEAR_OPTIONS = 'fiscalYearOptions'

export const DISPLAY_NAMES = {
  [REVENUE_TYPE]: {
    default: 'Revenue type',
    plural: 'Revenue types',
  },
  [COMMODITY]: {
    default: 'Commodity',
    plural: 'Commodities',
  },
  [LAND_CATEGORY]: {
    default: 'Land category',
    plural: 'Land categories',
  },
  [LAND_CLASS]: {
    default: 'Land class',
    plural: 'Land classes',
  },
  [US_STATE]: {
    default: 'State',
    plural: 'States',
  },
  [OFFSHORE_REGION]: {
    default: 'Offshore region',
    plural: 'Offshore regions',
  }
}
