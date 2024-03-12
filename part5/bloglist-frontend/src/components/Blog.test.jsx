import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('Blog tests', () => {
  // beforeEach(() => {
  //   const blog = {
  //     user: 'test user',
  //     author: 'test author',
  //     title: 'test title',
  //     url: 'test url'
  //   }

  //   const { container } = render(
  //     <Blog blog={blog}/>
  //   )
  // })

  test('renders content', async () => {
    const blog = {
      user: 'test user',
      author: 'test author',
      title: 'test title',
      url: 'test url'
    }

    const { container } = render(
      <Blog blog={blog}/>
    )

    const element = screen.getByText('test title')
    expect(element).toBeDefined()
    const elementAuthor = screen.getByText('test author')
    expect(elementAuthor).toBeDefined()
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})