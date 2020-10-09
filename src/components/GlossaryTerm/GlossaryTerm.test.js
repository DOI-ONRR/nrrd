/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from 'test-utils'

import GlossaryTerm from './GlossaryTerm'

describe('Glossary Term:', () => {
  test('Glossary Term rendered successfully', () => {
    render(<GlossaryTerm>8(g)</GlossaryTerm>)
    expect(screen.getByTitle('The 8(g) zone', { exact: false })).toBeInTheDocument()
  })
  test('Glossary Term was not found and the error rendered', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    render(<GlossaryTerm>ghgh</GlossaryTerm>)
    expect(screen.getByText('error', { exact: false })).toBeInTheDocument()
    expect(console.error).toHaveBeenCalled()
    spy.mockRestore()
  })
  test('Multiple glossary terms warning was written to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    render(<GlossaryTerm>Duplicate</GlossaryTerm>)
    expect(console.warn).toHaveBeenCalled()
    spy.mockRestore()
  })
  test('Hovering on glossary term removes title attribute to display the tooltip', async () => {
    render(<GlossaryTerm>GOMESA</GlossaryTerm>)
    expect(screen.getByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false })).toBeInTheDocument()
    fireEvent.mouseOver(screen.getByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false }))
    expect(screen.queryByTitle('The Gulf of Mexico Energy Security Act (GOMESA)', { exact: false })).not.toBeInTheDocument()
  })
})
