/* eslint-disable no-undef */
import React from 'react'
import Link from './Link'
import renderer from 'react-test-renderer'

describe('Link components:', () => {
  it('External', () => {
    const tree = renderer
      .create(<Link href="https://revenuedata.doi.gov/">NRRD</Link>)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('DownloadXls', () => {
    const tree = renderer
      .create(<Link href="./excelfile.xlsx">NRRD</Link>)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('HowWorks', () => {
    const tree = renderer
      .create(<Link linkType='HowWorks' href="./how-revenue-works/native-american-production/">NRRD</Link>)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
