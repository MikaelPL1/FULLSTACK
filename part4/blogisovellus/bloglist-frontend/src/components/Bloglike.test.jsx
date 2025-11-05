import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import blogService from '../services/blogs';
import { test, expect, vi } from 'vitest';
// MUISTA MOCKATA SERVICE
vi.mock('../services/blogs');

test('calls event handler twice if like button is clicked twice', async () => {
  const user = userEvent.setup();
  const mockHandler = vi.fn();
  const blog = {
    id: '1',
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { id: '123', name: 'Test User' },
  };

  blogService.update.mockResolvedValue({ ...blog, likes: 6 });

  render(<Blog blog={blog} onLike={mockHandler} />);

  const viewButton = screen.getByText('view');
  await user.click(viewButton);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler).toHaveBeenCalledTimes(2);
});
