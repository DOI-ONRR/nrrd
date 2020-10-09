/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import ArchiveBanner from './ArchiveBanner'

describe('Archive Banner:', () => {
  test('Found the text content', async () => {
    render(<ArchiveBanner />)
    expect(screen.getByText('This content was created', { exact: false })).toBeInTheDocument()
  })

  test('Found the USEITI glossary term', async () => {
    render(<ArchiveBanner />)
    expect(screen.getByTitle('Extractive Industries', { exact: false })).toBeInTheDocument()
  })
})
