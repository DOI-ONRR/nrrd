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
  OFFSHORE_REGIONS,
  COMMODITY,
  COMMODITIES,
  COUNTIES,
  PRODUCT,
  RECIPIENT,
  SOURCE,
  STATE_OFFSHORE_NAME,
  DISPLAY_NAMES,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  GROUP_BY,
  BREAKOUT_BY,
  PERIOD,
  SINGLE
} from '../../constants'

import BaseButtonInput from './BaseButtonInput'
import BaseToggle from './BaseToggle'
import BaseMultiToggle from './BaseMultiToggle'
import BaseSwitch from './BaseSwitch'
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

const GROUP_BY_OPTIONS = {
  [REVENUE]: [
    { value: REVENUE_TYPE, option: 'Revenue type' },
    { value: COMMODITY, option: 'Commodity' },
    { value: LAND_TYPE, option: 'Land type' },
    { value: US_STATE, option: 'State' },
    { value: COUNTY, option: 'County' },
    { value: OFFSHORE_REGION, option: 'Offshore Region' },
  ],
  [PRODUCTION]: [
    { value: PRODUCT, option: 'Product' },
    { value: LAND_TYPE, option: 'Land type' },
    { value: US_STATE, option: 'State' },
    { value: COUNTY, option: 'County' },
    { value: OFFSHORE_REGION, option: 'Offshore Region' },
  ],
  [DISBURSEMENT]: [
    { value: RECIPIENT, option: 'Recipient' },
    { value: SOURCE, option: 'Source' },
    { value: US_STATE, option: 'State' },
    { value: COUNTY, option: 'County' },
  ],
}

export const GroupBySelectInput = compose(
  BaseComponent => props => {
    const { state } = useContext(DataFilterContext)
    return (
      <BaseComponent
        label={'Group by'}
        data={GROUP_BY_OPTIONS[state[DATA_TYPE] || REVENUE]}
        {...props} />)
  },
  BaseComponent => withDataFilterContext(BaseComponent, GROUP_BY))(BaseSelectInput)

export const BreakoutBySelectInput = compose(
  BaseComponent => props => {
    const { state } = useContext(DataFilterContext)
    const options = GROUP_BY_OPTIONS[state[DATA_TYPE] || REVENUE]
    return (
      <BaseComponent
        label={'Then group by'}
        data={options}
        {...props} />)
  },
  BaseComponent => withDataFilterContext(BaseComponent, BREAKOUT_BY))(BaseSelectInput)

export const FilterToggleInput = ({ children, ...props }) => <BaseToggle data={['Filter']} {...props}>{children}</BaseToggle>

export const MapLevelToggleInput = withDataFilterContext(BaseMultiToggle, COUNTIES)
export const OffshoreRegionsSwitchInput = withDataFilterContext(BaseSwitch, OFFSHORE_REGIONS)
