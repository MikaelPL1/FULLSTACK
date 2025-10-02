// Blog.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Blog from './Blog'

describe('Blog component', () => {
  it('shows url, likes and user when view button is clicked', async () => {
    const blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 5,
      user: { name: 'Test User', id: '123' },
    }

    render(<Blog blog={blog} />)

    expect(screen.queryByText(/http:\/\/testurl.com/)).toBeNull()
    expect(screen.queryByText(/likes 5/)).toBeNull()
    expect(screen.queryByText(/Test User/)).toBeNull()

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('http://testurl.com')).toBeInTheDocument()
    expect(screen.getByText(/likes 5/)).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
