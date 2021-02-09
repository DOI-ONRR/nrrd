import React from 'react'
import { flowRight as compose } from 'lodash'

import {
  DATA_FILTER_KEY,
  LAND_TYPE,
  OFFSHORE_REGIONS,
  COMMODITY,
  PRODUCT,
  RECIPIENT,
  SOURCE,
  DISPLAY_NAMES,
  GROUP_BY,
  GROUP_BY_STICKY,
  BREAKOUT_BY,
  PERIOD,
  MAP_LEVEL,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  US_STATE_NAME,
  PERIOD_TYPES
} from '../../constants'

import BaseToggle from './BaseToggle'
import BaseMultiToggle from './BaseMultiToggle'
import BaseSwitch from './BaseSwitch'
import BaseSelectInput from './BaseSelectInput'
import BaseSlider from './BaseSlider'

import withDataFilterContext from './withDataFilterContext'
import withDataFilterQuery from './withDataFilterQuery'
import withQueryManager from '../withQueryManager'

/**
 * A factory method for building input components with a DataFilterContext and a QueryManager.
 *
 * @param {compnent} baseInput
 * @param {String} queryKey
 * @param {String} dataFilterKey
 */
export const createEnhancedInput = (baseInput, queryKey, dataFilterKey, options) => {
  return compose(
    BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[dataFilterKey].default} {...props} />),
    BaseComponent => withDataFilterContext(BaseComponent, dataFilterKey),
    BaseComponent => withQueryManager(BaseComponent, queryKey, { [DATA_FILTER_KEY]: dataFilterKey, ...options }))(baseInput)
}
/**
 * A factory method for building input components with a DataFilterContext.
 *
 * @param {compnent} baseInput
 * @param {String} dataFilterKey
 */
export const createDataFilterContextInput = (baseInput, dataFilterKey) => {
  return compose(
    BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[dataFilterKey]?.default} {...props} />),
    BaseComponent => withDataFilterContext(BaseComponent, dataFilterKey))(baseInput)
}
/**
 * A factory method for building slider components with a DataFilterContext and a DataFilterQuery.
 *
 * @param {String} dataFilterKey
 * @param {String} selectType
 */
export const createEnhancedSlider = dataFilterKey => compose(
  BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[dataFilterKey]?.default} {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, dataFilterKey),
  BaseComponent => withDataFilterQuery(BaseComponent, dataFilterKey))(BaseSlider)

export const FiscalYearSlider = createEnhancedSlider(FISCAL_YEAR)
export const CalendarYearSlider = createEnhancedSlider(CALENDAR_YEAR)

/**
 * A factory method for building select components with a DataFilterContext and a DataFilterQuery.
 *
 * @param {String} dataFilterKey
 * @param {String} selectType
 */
const createEnhancedSelect = (dataFilterKey, selectType) => compose(
  BaseComponent => props => (<BaseComponent selectType={selectType} label={DISPLAY_NAMES[dataFilterKey]?.default} {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, dataFilterKey),
  BaseComponent => withDataFilterQuery(BaseComponent, dataFilterKey))(BaseSelectInput)

export const PeriodSelectInput = compose(
  BaseComponent => props => (
    <BaseComponent
      label={DISPLAY_NAMES[PERIOD].default}
      data={PERIOD_TYPES}
      showClearSelected={false}
      {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, PERIOD))(BaseSelectInput)

export const LandTypeSelectInput = createEnhancedSelect(LAND_TYPE, 'Multi')
export const CommoditySelectInput = createEnhancedSelect(COMMODITY, 'Multi')
export const ProductSelectInput = createEnhancedSelect(PRODUCT, 'Multi')
export const RecipientSelectInput = createEnhancedSelect(RECIPIENT, 'Multi')
export const SourceSelectInput = createEnhancedSelect(SOURCE, 'Multi')
export const StateNameSelectInput = createEnhancedSelect(US_STATE_NAME, 'Multi')

export const GroupByStickySelectInput = compose(
  BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[GROUP_BY_STICKY].default} showClearSelected={false} {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, GROUP_BY_STICKY))(BaseSelectInput)

export const GroupBySelectInput = compose(
  BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[GROUP_BY].default} showClearSelected={false} {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, GROUP_BY))(BaseSelectInput)

export const BreakoutBySelectInput = compose(
  BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[BREAKOUT_BY].default} showClearSelected={false} {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, BREAKOUT_BY))(BaseSelectInput)

export const FilterToggleInput = ({ children, ...props }) => <BaseToggle data={['Filter']} {...props}>{children}</BaseToggle>

export const MapLevelToggleInput = withDataFilterContext(BaseMultiToggle, MAP_LEVEL)
export const OffshoreRegionsSwitchInput = withDataFilterContext(BaseSwitch, OFFSHORE_REGIONS)
