/* eslint-disable no-undef */
import * as utils from './index.js'

describe('Utility methods test: ', () => {
  test('destructuringSwap', () => expect(utils.destructuringSwap(['item1', 'item2', 'item3'], 2, 1)).toStrictEqual(['item1', 'item3', 'item2']))
  test('formatToDollarFloat', () => expect(utils.formatToDollarFloat(12.34567, 2)).toBe('$12.35'))
  test('getMetricLongUnit million', () => expect(utils.getMetricLongUnit('111,111,111M')).toBe('111,111,111 million'))
  test('getMetricLongUnit billion', () => expect(utils.getMetricLongUnit('111,111,111G')).toBe('111,111,111 billion'))
  test('formatToDollarInt positive', () => expect(utils.formatToDollarInt(1.25)).toBe('$1'))
  test('formatToDollarInt negative', () => expect(utils.formatToDollarInt(-1.25)).toBe('($1)'))
})
