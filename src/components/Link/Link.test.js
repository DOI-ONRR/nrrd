/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import Link from './Link'

describe('Link component:', () => {
  test('External link rendered succesfully', async () => {
    render(<Link href="https://revenuedata.doi.gov/">NRRD</Link>)
    expect(screen.getByText('NRRD')).toBeInTheDocument()
    expect(screen.getByText('NRRD').getAttribute('href')).toBe('https://revenuedata.doi.gov/')
  })
  test('DownloadXls link rendered succesfully', async () => {
    render(<Link href="./excelfile.xlsx">Excel</Link>)
    expect(screen.getByText('Excel')).toBeInTheDocument()
    expect(screen.getByTestId('BaseLink').getAttribute('href')).toBe('./excelfile.xlsx')
  })
  test('Link type rendered succesfully', async () => {
    render(<Link linkType='HowWorks' href="./how-works/native">How it works</Link>)
    expect(screen.getByText('How it works')).toBeInTheDocument()
    expect(screen.getByTestId('BaseLink').getAttribute('href')).toBe('./how-works/native')
  })
})
