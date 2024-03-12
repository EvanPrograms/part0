import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', async () => {

  const blog = {
    user: 'test user',
    author: 'test author',
    title: 'test title',
    url: 'test url'
  }

  render(
    <Blog blog={blog}/>
  )

  screen.debug()

  const element = screen.getByText('test title test author')
  screen.debug(element)
  expect(element).toBeDefined()

})