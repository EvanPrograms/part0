import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('Blog tests', () => {
  let container
  beforeEach(() => {
    const blog = {
      user: 'test user',
      author: 'test author',
      title: 'test title',
      url: 'test url'
    }

    container = render(
      <Blog blog={blog}/>
    ).container
  })

  test('renders author, title; user, likes is hidden', () => {
    const element = screen.getByText('test title')
    expect(element).toBeDefined()
    const elementAuthor = screen.getByText('test author')
    expect(elementAuthor).toBeDefined()
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('renders URL and likes when button clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})

describe('Event handler Tests', () => {
  test('ensures if like button is clicked twice, event handler received as props called twice', async () => {
    const blog = {
      user: 'test user',
      author: 'test author',
      title: 'test title',
      url: 'test url',
      likes: 0
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('like')
    console.log('MOCKHANDLER CALLS', mockHandler.mock.calls)
    await user.click(button)
    console.log('MOCKHANDLER CALLS', mockHandler.mock.calls)
    await user.click(button)
    console.log('MOCKHANDLER CALLS', mockHandler.mock.calls)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})