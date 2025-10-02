import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onLike, onDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleLike = async () => {
    try {
      const updatedBlog = {
        user: blog.user.id ? blog.user.id : blog.user,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      if (onLike) onLike(returnedBlog)
    } catch (error) {
      console.error('Like error:', error)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      onDelete(blog.id)
    }
  }

  const canDelete = user && blog.user && (
    blog.user.username === user.username ||
    blog.user.id === user.id ||
    blog.user === user.id
  )

  return (
    <div>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {canDelete && (
            <button onClick={handleDelete}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog