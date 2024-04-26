import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('Blogform Tests', () => {
  test('Form calls event handler with right details on creation', async () => {
    // eslint-disable-next-line no-undef
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createNewBlog={createBlog}/>)

    const inputTitle = container.querySelector('#title-input')
    const inputAuthor = container.querySelector('#author-input')
    const inputUrl = container.querySelector('#url-input')
    const button = screen.getByText('create')

    await user.type(inputTitle, 'test title')
    await user.type(inputAuthor, 'test author')
    await user.type(inputUrl, 'test url')
    await user.click(button)

    console.log('THIS IS MOCK CALLS', createBlog.mock.calls)
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('test title')
    expect(createBlog.mock.calls[0][0].author).toBe('test author')
    expect(createBlog.mock.calls[0][0].url).toBe('test url')
  })
})