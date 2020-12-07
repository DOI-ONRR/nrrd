/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'
import userEvent from '@testing-library/user-event'

import CollapsibleContent from './CollapsibleContent'

describe('Collapsible Content:', () => {
  test('Collapsible Content rendered successfully', () => {
    render(<CollapsibleContent show={true}>Collapsible content</CollapsibleContent>)
    expect(screen.getByText('Collapsible content')).toBeInTheDocument()
  })
  test('Clicking the icon shows content', async () => {
    render(<CollapsibleContent>Collapsible content</CollapsibleContent>)
    expect(screen.queryByText('Collapsible content')).not.toBeInTheDocument()
    userEvent.click(screen.getByLabelText('show more'))
    expect(screen.getByText('Collapsible content')).toBeInTheDocument()
  })
})
