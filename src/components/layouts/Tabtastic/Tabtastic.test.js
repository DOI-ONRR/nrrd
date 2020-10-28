/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import Tabtastic, { TabtasticTab } from './Tabtastic'

const testProp = 'a test value'

describe('Tabtastic component', () => {
  test('Tabtastic component should render sucessfully', () => {
    render(
      <Tabtastic selected={testProp} />
    )
    expect(screen.getByTestId('tabtastic-tabs-container')).toBeInTheDocument()
    expect(screen.getByTestId('tabtastic-tabpanel-container')).toBeInTheDocument()
  })

  test('TabtasticTab component should render sucessfully', () => {
    render(
      <TabtasticTab label={testProp}>
        Child content
      </TabtasticTab>
    )
    expect(screen.getByTestId('tabtastic-tab-container')).toHaveTextContent('Child content')
  })
})
