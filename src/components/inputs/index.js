import React, { useContext, useState } from 'react'
import { flowRight as compose } from 'lodash'

import {
  DATA_TYPE,
  DATA_TYPES,
  LAND_TYPE,
  REVENUE_TYPE,
  US_STATE,
  COUNTY,
  OFFSHORE_REGION,
  COMMODITY,
  PRODUCT,
  RECIPIENT,
  SOURCE,
  STATE_OFFSHORE_NAME,
  DISPLAY_NAMES,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  GROUP_BY,
  BREAKOUT_BY
} from '../../constants'

import BaseButtonInput from './BaseButtonInput'
import BaseToggle from './BaseToggle'
import BaseSelectInput from './BaseSelectInput'
import { DataFilterContext } from '../../stores/data-filter-store'
import withDataFilterContext from './withDataFilterContext'
import withDataFilterQuery from './withDataFilterQuery'

/**
 * A factory method for building select components with a DataFilterContext and a DataFilterQuery.
 *
 * @param {String} dataFilterKey
 * @param {String} selectType
 */
const createEnhancedSelect = (dataFilterKey, selectType) => compose(
  BaseComponent => props => (<BaseComponent selectType={selectType} label={DISPLAY_NAMES[dataFilterKey].default} {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, dataFilterKey),
  BaseComponent => withDataFilterQuery(BaseComponent, dataFilterKey))(BaseSelectInput)

export const DataTypeSelectInput = compose(
  BaseComponent => props => (
    <BaseComponent
      label={DISPLAY_NAMES[DATA_TYPE].default}
      data={DATA_TYPES}
      showClearSelected={false}
      {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, DATA_TYPE))(BaseSelectInput)
export const LandTypeSelectInput = createEnhancedSelect(LAND_TYPE, 'Multi')
export const RevenueTypeSelectInput = createEnhancedSelect(REVENUE_TYPE, 'Multi')
export const UsStateSelectInput = createEnhancedSelect(US_STATE, 'Multi')
export const CountySelectInput = createEnhancedSelect(COUNTY, 'Multi')
export const OffshoreRegionSelectInput = createEnhancedSelect(OFFSHORE_REGION, 'Multi')
export const CommoditySelectInput = createEnhancedSelect(COMMODITY, 'Multi')
export const ProductSelectInput = createEnhancedSelect(PRODUCT, 'Multi')
export const RecipientSelectInput = createEnhancedSelect(RECIPIENT, 'Multi')
export const SourceSelectInput = createEnhancedSelect(SOURCE, 'Multi')
export const StateOffshoreSelectInput = createEnhancedSelect(STATE_OFFSHORE_NAME, 'Multi')

export const GroupBySelectInput = compose(
  BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[GROUP_BY].default} showClearSelected={false} {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, GROUP_BY))(BaseSelectInput)

export const BreakoutBySelectInput = compose(
  BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[BREAKOUT_BY].default} showClearSelected={false} {...props} />),
  BaseComponent => withDataFilterContext(BaseComponent, BREAKOUT_BY))(BaseSelectInput)

export const FilterToggleInput = ({ children, ...props }) => <BaseToggle data={['Filter']} {...props}>{children}</BaseToggle>
