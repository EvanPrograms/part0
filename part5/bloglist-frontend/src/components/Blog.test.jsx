import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog tests', () => {
  test('ensures if like button is clicked twice, event handler received as props called twice', async () => {
    const mockHandler = vi.fn()
    const blog = {
      user: 'test user',
      author: 'test author',
      title: 'test title',
      url: 'test url',
      likes: 0,
    }
    render(
      <Blog
        blog={blog}
        updateBlog={mockHandler}
      />
    )
    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})