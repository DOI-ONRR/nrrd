/* eslint-disable no-undef */
import React from 'react'
import Link from './Link'
import { create } from 'react-test-renderer'

describe('Link component:', () => {
  test('External Link Match snapshot', () => expect(create(<Link href="https://revenuedata.doi.gov/">NRRD</Link>).toJSON()).toMatchSnapshot())
  test('DownloadXls Link Match snapshot', () => expect(create(<Link href="./excelfile.xlsx">NRRD</Link>).toJSON()).toMatchSnapshot())
  test('HowWorks Link Match snapshot', () => expect(create(<Link linkType='HowWorks' href="./how-works/native/">NRRD</Link>).toJSON()).toMatchSnapshot())
})
