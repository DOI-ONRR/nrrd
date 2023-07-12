import React, { useRef, useLayoutEffect } from 'react'
import * as d3 from 'd3'

const MaxExtent = ({ extentPercent, extentMarginOfError, yMax, units, dimensions, maxExtentLineY }) => {
  const ref = useRef(null)

  useLayoutEffect(() => {
    // Add Max Extent Number text
    const maxExtentGroup = d3.select(ref.current)

    // crawlCeil
    const crawlCeil = (ymax, ceilMax, i) => {
      const sigFig = '.' + i + 's'

      const sigFigCeil = siValue(d3.format(sigFig)(ceilMax))

      const ceilIsLargerThanValue = sigFigCeil > +ymax
      let ceilIsntTooBig = (sigFigCeil / +ymax) <= (1 + extentMarginOfError + extentPercent)
      if (!ceilIsntTooBig) {
        ceilIsntTooBig = ((sigFigCeil - ymax) < 10) // Accomodate for small numbers if the difference is smal then this should be acceptable
      }
      const justRight = ceilIsLargerThanValue && ceilIsntTooBig
      return justRight ? sigFig : ''
    }

    // setSigFigs
    const setSigFigs = (ymax, ceilMax) => {
      let sigFigs = []
      let SF = 0
      while (sigFigs.length < 3) {
        SF++
        sigFigs = crawlCeil(ymax, ceilMax, SF)
      }
      return sigFigs
    }

    // getMetricLongUnit
    const getMetricLongUnit = str => {
      const suffix = { k: 'k', M: ' million', G: ' billion' }
      return str.replace(/(\.0+)?([kMG])$/, function (_, zeroes, s) {
        return suffix[s] + ' ' || s
      })
    }

    // calculateExtentValue
    const calculateExtentValue = () => {
      const maxValue = yMax()
      const maxValueExtent = Math.ceil(maxValue * (1 + extentPercent))
      return getMetricLongUnit(d3.format(setSigFigs(maxValue, maxValueExtent))(maxValueExtent))
    }

    const maxExtentValue = calculateExtentValue()

    if (!units) {
      units = ''
    }

    maxExtentGroup.append('text')
      .attr('width', dimensions.width)
      .attr('x', 5)
      .attr('y', (maxExtentLineY - 5))
      .attr('text-anchor', 'start')
      .text((units === 'dollars' || units === '$') ? ['$', maxExtentValue].join('') : [maxExtentValue, units].join(''))

    maxExtentGroup.append('line')
      .attr('x1', 0)
      .attr('x2', dimensions.width)
      .attr('stroke', '#a7bcc7')
      .attr('stroke-dasharray', [5, 5])
      .attr('stroke-width', 1)
      .attr('transform', 'translate(' + [0, maxExtentLineY] + ')')
  }, [])

  return (
    <g className='max-extent' ref={ref} />
  )
}

export default MaxExtent

// siValue
const siValue = (function () {
  const suffix = { k: 1000, M: 1000000, G: 1000000000 }
  return function (str) {
    try {
      let number
      str = str.replace(/(\.0+)?([kMG])$/, function (_, zeroes, s) {
        number = str.replace(s, '').toString() || str
        return (+number * suffix[s])
      }).replace(/\.0+$/, '')
      if (number) {
        return str.slice(number.length, str.length)
      }
      else {
        return str
      }
    }
    catch (err) {
      console.warn('error: ', err)
    }
  }
})()
