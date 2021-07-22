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
  US_STATE_NAME,
  PERIOD_TYPES,
  MONTHLY
} from '../../constants'

import BaseToggle from './BaseToggle'
import BaseMultiToggle from './BaseMultiToggle'
import BaseSwitch from './BaseSwitch'
import BaseSelectInput from './BaseSelectInput'

import withDataFilterContext from './withDataFilterContext'
import withQueryManager from '../withQueryManager'
import withDataFilterQuery from './withDataFilterQuery'

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
export const YearlyMonthlyToggleInput = withDataFilterContext(BaseMultiToggle, MONTHLY)
export const CommoditySelectInput = createEnhancedSelect(COMMODITY, 'Multi')
export const ProductSelectInput = createEnhancedSelect(PRODUCT, 'Multi')

export const GlossaryCategorySelectInput = ({ data, children, ...props }) => <BaseSelectInput data={data} {...props}>{children}</BaseSelectInput>
