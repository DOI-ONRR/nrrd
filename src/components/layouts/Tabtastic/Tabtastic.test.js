/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import Tabtastic, { TabtasticTab } from './Tabtastic'
import { Tabs } from '@material-ui/core'

describe('Tabtastic component', () => {
  test('Tabtastic component should render sucessfully, expect label prop value, and child tabs', () => {
    render(
      <Tabtastic selected="Tabtastic selected value">
        <Tabs role="tablist" label="a tab label" />
      </Tabtastic>
    )
    expect(screen.getByTestId('tabtastic-tabs-container')).toBeInTheDocument()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByLabelText(/a tab label/i)).toBeInTheDocument()
  })

  test('TabtasticTab component should render sucessfully, expect label prop value, and child content', () => {
    render(
      <TabtasticTab label="TabtasticTab label value">
        Child content
      </TabtasticTab>
    )
    expect(screen.getByTestId('tabtastic-tab-container')).toHaveTextContent('Child content')
    expect(screen.getByTestId('tabtastic-tab-container')).toHaveAttribute('label', expect.stringContaining('TabtasticTab'))
  })
})
