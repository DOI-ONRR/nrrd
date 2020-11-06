/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import DidYouKnowCard from './DidYouKnowCard'

describe('Did You Know Card:', () => {
  test('Did You Know Card rendered successfully', () => {
    render(<DidYouKnowCard>Did you know content</DidYouKnowCard>)
    expect(screen.getByText('Did you know content', { exact: true })).toBeInTheDocument()
  })
  test('Did You Know Card title changed', () => {
    render(<DidYouKnowCard title='New title'>Did you know content</DidYouKnowCard>)
    expect(screen.getByText('New title', { exact: true })).toBeInTheDocument()
  })
})
