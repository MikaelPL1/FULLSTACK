import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogPage = ({ currentUser }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    const fetchBlog = async () => {
      try {
        const data = await blogService.getOne(id)
        if (!ignore) setBlog(data)
      } catch (error) {
        console.log('Blogin haku epäonnistui', error)
        setError('Blogia ei löytynyt')
      }
    }
    fetchBlog()
    return () => { ignore = true }
  }, [id])

  const handleLike = async () => {
    try {
      const updated = await blogService.update(blog.id, {
        ...blog,
        user: blog.user?.id || blog.user,
        likes: (blog.likes || 0) + 1,
      })
      setBlog(updated)
    } catch {
      setError('Tykkäys epäonnistui')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Poistetaanko "${blog.title}"?`)) return
    try {
      await blogService.remove(blog.id)
      navigate('/blogs')
    } catch {
      setError('Poisto epäonnistui (token?)')
    }
  }

  if (error) return <div style={{ color: 'red' }}>{error}</div>
  if (!blog) return <div>Ladataan…</div>

  const canDelete =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user?.id === currentUser.id ||
      blog.user === currentUser.id)

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>

      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>

      <div>
        likes {blog.likes || 0}
        <button onClick={handleLike}>like</button>
      </div>

      {blog.user && (
        <div>
            added by {blog.user.username}
        </div>
      )}

      {canDelete && (
        <button onClick={handleDelete}>
          delete
        </button>
      )}
    </div>
  )
}

export default BlogPage
