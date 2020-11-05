/* eslint-disable no-undef */
import React from 'react'
import {
  waitForElementToBeRemoved
} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, createMatchMedia, theme } from 'test-utils'
import userEvent from '@testing-library/user-event'
import ProcessCard from './ProcessCard'

describe('Process Card:', () => {
  test('Process Card rendered successfully', () => {
    render(<ProcessCard step={1} name='Step 1'>Process Card content</ProcessCard>)
    expect(screen.getByText('Process Card content')).toBeInTheDocument()
  })
  test('Process Card Mobile and clicking the icon shows content', async () => {

    window.matchMedia = createMatchMedia(theme.breakpoints.values.sm - 1)

    render(<ProcessCard step={1} name='Step 1'>Process Card content</ProcessCard>)

    // We need to wait for the rerender when the useMediaQuery gets updated
    await waitForElementToBeRemoved(() => screen.queryByText('Process Card content'), { onTimeout: error => console.log(error) })

    userEvent.click(screen.getByLabelText('show more'))
    expect(screen.queryByText('Process Card content')).toBeInTheDocument()
  })
})
