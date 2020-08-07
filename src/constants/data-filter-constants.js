export const QUERY_TABLE_FILTER_DEFAULT = 'query_table_filter_default'
export const EXPLORE_DATA_FILTER_DEFAULT = 'explore_data_filter_default'
export const QUERY_COUNTS = 'queryCounts'

export const DATA_TYPE = 'dataType'
export const LOCATION_NAME = 'locationName'
export const LAND_TYPE = 'landType'
export const REGION_TYPE = 'regionType'
export const DISTRICT_TYPE = 'districtType'
export const LAND_CLASS = 'landClass'
export const LAND_CATEGORY = 'landCategory'
export const OFFSHORE = 'offshore'
export const OFFSHORE_REGION = 'offshoreRegion'
export const OFFSHORE_REGIONS = 'offshoreRegions'
export const US_STATE = 'state'
export const US_STATE_ABBR = 'stateAbbr'
export const US_STATES = 'usStates'
export const US_STATE_NAME = 'usStateName'
export const COUNTY = 'county'
export const COUNTY_NAME = 'county_name'
export const COUNTIES = 'counties'
export const PRODUCT = 'product'
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
export const STATE_OFFSHORE_NAME = 'stateOffshoreName'
export const MAP_LEVEL = 'mapLevel'
export const LOCAL_RECIPIENT = 'localRecipient'

export const PERIOD_FISCAL_YEAR = 'Fiscal Year'
export const PERIOD_CALENDAR_YEAR = 'Calendar Year'
export const PERIOD_MONTHLY_YEAR = 'Monthly'
export const PERIOD_TYPES = [PERIOD_FISCAL_YEAR, PERIOD_CALENDAR_YEAR]
export const GROUP_BY = 'groupBy'
export const GROUP_BY_STICKY = 'groupBySticky'
export const BREAKOUT_BY = 'breakoutBy'
export const ADDITIONAL_COLUMNS = 'additionalColumns'
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

// Application State Keys
export const DATA_SETS_STATE_KEY = 'dataSets'
export const SOURCE_DATA_STATE_KEY = 'SourceData'

export const FISCAL_YEAR_KEY = 'FiscalYear'
export const CALENDAR_YEAR_KEY = 'CalendarYear'

// Offshore data keys for redux store
export const OFFSHORE_REGION_DATA_TYPE = 'offshoreRegion'

// Disbursements data keys for redux store
export const DISBURSEMENTS_ALL_KEY = 'disbursementsAll'

// Revenues data keys for redux store
export const REVENUES_ALL_KEY = 'revenuesAll'

// Production Volume data keys for redux store
export const PRODUCTION_VOLUMES_OIL_KEY = 'productVolumesOil'
export const PRODUCTION_VOLUMES_GAS_KEY = 'productVolumesGas'
export const PRODUCTION_VOLUMES_COAL_KEY = 'productVolumesCoal'

export const FEDERAL_OFFSHORE = 'Federal offshore'
export const FEDERAL_ONSHORE = 'Federal onshore'
export const NATIVE_AMERICAN = 'Native American'
export const NATIONWIDE_FEDERAL = 'Nationwide Federal'
export const NATIVE_AMERICAN_FIPS = 'NA'
export const NATIONWIDE_FEDERAL_FIPS = 'NF'
export const OFFSHORE_CAPITALIZED = 'Offshore'
export const ONSHORE = 'Onshore'
export const FEDERAL = 'Federal'

// export const CALENDAR_YEAR = 'Calendar Year' // use PERIOD_CALENDAR_YEAR
export const FISCAL_YEAR_LABEL = 'Fiscal Year'
export const MONTHLY_CAPITALIZED = 'Monthly'
export const YEARLY = 'Yearly'
export const REVENUE = 'Revenue'
export const DISBURSEMENT = 'Disbursement'
export const PRODUCTION = 'Production'
export const OIL = 'Oil'
export const GAS = 'Gas'
export const COAL = 'Coal'
export const STATE = 'State'
export const COUNTY_CAPITALIZED = 'County'
export const USA = 'USA'

export const TREND_LIMIT = 10
export const MAX_CARDS = 3

export const DISPLAY_NAMES = {
  [LOCATION_NAME]: {
    default: 'Location',
    plural: 'Location',
  },
  [GROUP_BY]: {
    default: 'Group by',
    plural: 'Group by',
  },
  [GROUP_BY_STICKY]: {
    default: 'Group by',
    plural: 'Group by',
  },
  [BREAKOUT_BY]: {
    default: 'Then group by',
    plural: 'Then group by',
  },
  [DATA_TYPE]: {
    default: 'Data type',
    plural: 'Data types',
  },
  [REVENUE_TYPE]: {
    default: 'Revenue type',
    plural: 'Revenue types',
  },
  [LAND_TYPE]: {
    default: 'Land type',
    plural: 'Land types',
  },
  [COMMODITY]: {
    default: 'Commodity',
    plural: 'Commodities',
  },
  [PRODUCT]: {
    default: 'Product',
    plural: 'Products',
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
  [US_STATE_NAME]: {
    default: 'State',
    plural: 'States',
  },
  [OFFSHORE_REGION]: {
    default: 'Offshore region',
    plural: 'Offshore regions',
  },
  [OFFSHORE_REGIONS]: {
    default: 'Offshore regions',
    plural: 'Offshore regions',
  },
  [SOURCE]: {
    default: 'Source',
    plural: 'Sources',
  },
  [COUNTY]: {
    default: 'County',
    plural: 'Counties',
  },
  [COUNTIES]: {
    default: 'Counties',
    plural: 'Counties',
  },
  [RECIPIENT]: {
    default: 'Recipient',
    plural: 'Recipients',
  },
  [STATE_OFFSHORE_NAME]: {
    default: 'State/Offshore Region',
    plural: 'States/Offshore Regions',
  },
  [PERIOD]: {
    default: 'Period',
    plural: 'Periods',
  },
  [FISCAL_YEAR]: {
    default: 'Fiscal year',
    plural: 'Fiscal years',
  },
  [CALENDAR_YEAR]: {
    default: 'Calendar year',
    plural: 'Calendar years',
  },
  [LOCAL_RECIPIENT]: {
    default: 'Local recipient',
    plural: 'Local recipients'
  }
}
