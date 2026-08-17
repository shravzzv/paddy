import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

it('2+2 is 4', () => {
  expect(2 + 2).toBe(4)
})

it('home page should render a paragraph', () => {
  render(<Page />)
  expect(screen.getByRole('paragraph')).toBeInTheDocument()
})
