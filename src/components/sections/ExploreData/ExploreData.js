import React, { useContext, useState } from 'react'

import {
  RevenueMap,
  RevenueCompare,
  RevenueSummary
} from './Revenue'

import {
  DisbursementsMap,
  DisbursementsCompare
} from './Disbursements'

import { StoreContext } from '../../../store'
import { DATA_TYPES } from '../../../constants'

const MAX_CARDS = 3

const ExploreData = () => {
  const { state, dispatch } = useContext(StoreContext)

  const [mapX, setMapX] = useState()
  const [mapY, setMapY] = useState()
  const [mapK, setMapK] = useState(0.25)

  const cards = state.cards
  const countyLevel = state.countyLevel === 'County'
  const dataType = state.dataType
  const offshore = state.offshoreData === 'On'
  const year = state.year

  // card Menu Item for adding/removing Nationwide Federal or Native American cards
  const nationalCard = cards && cards.some(item => item.abbr === 'Nationwide Federal')
  const nativeAmericanCard = cards && cards.some(item => item.abbr === 'Native American')
  let cardMenuItems = []

  if (!nationalCard) {
    cardMenuItems = [{ fips: 99, abbr: 'Nationwide Federal', name: 'Nationwide Federal', label: 'Add Nationwide Federal card' }]
  }

  if (!nativeAmericanCard) {
    cardMenuItems = [{ fips: undefined, abbr: 'Native American', name: 'Native American', label: 'Add Native American card' }]
  }

  if (!nationalCard && !nativeAmericanCard) {
    cardMenuItems = [{ fips: 99, abbr: 'Nationwide Federal', name: 'Nationwide Federal', label: 'Add Nationwide Federal card' }, { fips: undefined, abbr: 'Native American', name: 'Native American', label: 'Add Native American card' }]
  }

  // closeCard
  const closeCard = (fips, x, y, k) => {
    setMapK(k)
    setMapY(y)
    setMapX(x)
    dispatch({ type: 'CARDS', payload: { cards: cards.filter(item => item.fips !== fips) } })
  }

  // onLink
  const onLink = (state, x, y, k) => {
    setMapK(k)
    setMapY(y)
    setMapX(x)

    let fips = state.properties ? state.properties.FIPS : state.fips
    const name = state.properties ? state.properties.name : state.name
    if (fips === undefined) {
      fips = state.id
    }
    let stateAbbr
    let abbr

    if (fips && fips.length > 2) {
      abbr = fips
      stateAbbr = state.properties.state ? state.properties.state : state.properties.region
    }
    else {
      abbr = state.properties ? state.properties.abbr : state.abbr
      stateAbbr = state.properties ? state.properties.abbr : state.abbr
    }

    const stateObj = {
      fips: fips,
      abbr: abbr,
      name: name,
      state: stateAbbr
    }

    if (
      cards.filter(item => item.fips === fips).length === 0
    ) {
      if (cards.length <= MAX_CARDS) {
        if (stateObj.abbr && stateObj.abbr.match(/Nationwide Federal/)) {
          cards.unshift(stateObj)
        }
        else {
          cards.push(stateObj)
        }
      }
      else {
        handleSnackbar({ vertical: 'bottom', horizontal: 'center' })
        setSnackbarState({ ...snackbarState, open: false })
      }
    }
    return dispatch({ type: 'CARDS', payload: { cards: cards } })
  }

  // onYear
  const onYear = (selected, x, y, k) => {
    setMapK(k)
    setMapY(y)
    setMapX(x)
    dispatch({ type: 'YEAR', payload: { year: selected } })
  }

  // setZoom
  const setZoom = (x, y, k) => {
    setMapY(y)
    setMapX(x)
    setMapK(k)
  }

  console.log('DATA_TYPES: ', DATA_TYPES)

  // Revenue
  if (dataType === DATA_TYPES[0]) {
    return (
      <>
        <RevenueMap
          cards={cards}
          cardMenuItems={cardMenuItems}
          closeCard={closeCard}
          countyLevel={countyLevel}
          mapX={mapX}
          mapY={mapY}
          mapK={mapK}
          offshore={offshore}
          onLink={onLink}
          onYear={onYear}
          setZoom={setZoom}
          year={year} />

        <RevenueCompare
          cards={cards}
          cardMenuItems={cardMenuItems}
          dataType={dataType}
          onLink={onLink}
          year={year} />

        <RevenueSummary
          year={year}
        />
      </>
    )
  }

  // Disbursements
  if (dataType === DATA_TYPES[1]) {
    return (
      <>
        <span>Production data!</span>
      </>
    )
  }

  // Production
  if (dataType === DATA_TYPES[2]) {
    return (
      <>
        <DisbursementsMap />
        <DisbursementsCompare />
      </>
    )
  }
}

export default ExploreData
