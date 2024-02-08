const summarize = (srcArr, breakoutBy) => {
  return srcArr.reduce((accumulator, currentValue) => {
    const index = accumulator.findIndex(acc =>
      acc.commodity === currentValue.commodity &&
      acc.calendarYear === currentValue.calendarYear &&
      (breakoutBy === 'landType'
        ? (acc.landType === currentValue.landType)
        : (breakoutBy === 'stateOffshoreRegion'
          ? (acc.stateOffshoreRegion === currentValue.stateOffshoreRegion)
          : true))
    )
    if (index !== -1) {
      accumulator[index].salesValue += currentValue.salesValue
      accumulator[index].salesVolume += currentValue.salesVolume
      accumulator[index].royaltyValuePriorToAllowance += currentValue.royaltyValuePriorToAllowance
      accumulator[index].transportationAllowance += currentValue.transportationAllowance
      accumulator[index].processingAllowance += currentValue.processingAllowance
      accumulator[index].royaltyValueLessAllowance += currentValue.royaltyValueLessAllowance
    }
    else {
      accumulator.push({
        commodity: currentValue.commodity,
        calendarYear: currentValue.calendarYear,
        landType: currentValue.landType,
        stateOffshoreRegion: currentValue.stateOffshoreRegion,
        salesValue: currentValue.salesValue,
        salesVolume: currentValue.salesVolume,
        royaltyValuePriorToAllowance: currentValue.royaltyValuePriorToAllowance,
        transportationAllowance: currentValue.transportationAllowance,
        processingAllowance: currentValue.processingAllowance,
        royaltyValueLessAllowance: currentValue.royaltyValueLessAllowance
      })
    }
    return accumulator
  }, [])
}

const getCommodities = srcArr => {
  return srcArr.reduce((accumulator, currentValue) => {
    const index = accumulator.findIndex(acc => acc === currentValue.commodity)
    if (index === -1) {
      accumulator.push(currentValue.commodity)
    }
    return accumulator
  }, [])
}

export { summarize, getCommodities }
