import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('BlogForm component', () => {
  test('calls createBlog with correct details when a new blog is created', async () => {
    const mockCreateBlog = vi.fn();
    render(<BlogForm createBlog={mockCreateBlog} />);
    const user = userEvent.setup();

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const authorInput = screen.getByRole('textbox', { name: /author/i });
    const urlInput = screen.getByRole('textbox', { name: /url/i });
    const createButton = screen.getByRole('button', { name: /create/i });

    await user.type(titleInput, 'New Blog Title');
    await user.type(authorInput, 'New Blog Author');
    await user.type(urlInput, 'http://newblog.com');
    await user.click(createButton);

    expect(mockCreateBlog).toHaveBeenCalledTimes(1);
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'http://newblog.com',
    });
  });
});
