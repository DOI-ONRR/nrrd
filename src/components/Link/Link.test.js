/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import Link from './Link'

const testIdForGatsbyLink = 'GatsbyLink'
const testIdForNormalLink = 'AnchorLink'
describe('Link component:', () => {
  test('External link rendered succesfully', () => {
    render(<Link href="https://revenuedata.doi.gov/">External Link</Link>)
    expect(screen.getByText('External Link')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForNormalLink).getAttribute('href')).toBe('https://revenuedata.doi.gov/')
  })
  test('Relative link rendered succesfully', () => {
    render(<Link href="/relative">Relative link</Link>)
    expect(screen.getByText('Relative link')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForGatsbyLink).getAttribute('href')).toBe('/relative')
  })
  test('Relative link with disabled routing rendered succesfully', () => {
    render(<Link href="/relative" disableRouting={true}>Relative link disable routing</Link>)
    expect(screen.getByText('Relative link disable routing')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForNormalLink).getAttribute('href')).toBe('/relative')
  })
  test('Header link rendered succesfully', () => {
    render(<Link linkType='Header' href="/downloads">Header</Link>)
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForGatsbyLink).getAttribute('href')).toBe('/downloads')
  })
  test('DownloadXls link rendered succesfully', () => {
    render(<Link href="./excelfile.xlsx">Excel</Link>)
    expect(screen.getByText('Excel')).toBeInTheDocument()
    expect(screen.getByTestId('download excel icon')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForNormalLink).getAttribute('href')).toBe('./excelfile.xlsx')
  })
  test('DownloadCsv link rendered succesfully', () => {
    render(<Link href="./csvfile.csv">Csv</Link>)
    expect(screen.getByText('Csv')).toBeInTheDocument()
    expect(screen.getByTestId('download csv icon')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForNormalLink).getAttribute('href')).toBe('./csvfile.csv')
  })
  test('HowWorks rendered succesfully', () => {
    render(<Link linkType='HowWorks' href="./how-works/native">How it works</Link>)
    expect(screen.getByText('How it works')).toBeInTheDocument()
    expect(screen.getByTestId('how works icon')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForGatsbyLink).getAttribute('href')).toBe('./how-works/native')
  })
  test('DownloadBase rendered succesfully', () => {
    render(<Link linkType='DownloadBase' href="./test/href">DownloadBase</Link>)
    expect(screen.getByText('DownloadBase')).toBeInTheDocument()
    expect(screen.getByTestId('download base icon')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForGatsbyLink).getAttribute('href')).toBe('./test/href')
  })
  test('ExploreData rendered succesfully', () => {
    render(<Link linkType='ExploreData' href="./test/href">ExploreData</Link>)
    expect(screen.getByText('ExploreData')).toBeInTheDocument()
    expect(screen.getByTestId('explore data icon')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForGatsbyLink).getAttribute('href')).toBe('./test/href')
  })
  test('Location rendered succesfully', () => {
    render(<Link linkType='Location' href="./test/href">Location</Link>)
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByTestId('us map icon')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForGatsbyLink).getAttribute('href')).toBe('./test/href')
  })
  test('FilterTable rendered succesfully', () => {
    render(<Link linkType='FilterTable' href="./test/href">FilterTable</Link>)
    expect(screen.getByText('FilterTable')).toBeInTheDocument()
    expect(screen.getByTestId('filter table icon')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForGatsbyLink).getAttribute('href')).toBe('./test/href')
  })
  test('DownloadData rendered succesfully', () => {
    render(<Link href="./downloads/production">DownloadData</Link>)
    expect(screen.getByText('DownloadData')).toBeInTheDocument()
    expect(screen.getByTestId('download data icon')).toBeInTheDocument()
    expect(screen.getByTestId(testIdForGatsbyLink).getAttribute('href')).toBe('./downloads/production')
  })
})
