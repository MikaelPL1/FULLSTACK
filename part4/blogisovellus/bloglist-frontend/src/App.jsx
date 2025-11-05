import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import User from './components/User'
import { setNotification, clearNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlogAction } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import BlogPage from './components/BlogPage'


const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const [showBlogForm, setShowBlogForm] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const storedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(storedUser))
      blogService.setToken(storedUser.token)
    }
    blogService.getAll().then((fetched) => dispatch(initializeBlogs(fetched)))
  }, [dispatch])

  const showNotification = (message, type = 'success') => {
    dispatch(setNotification(message, type))
    setTimeout(() => dispatch(clearNotification()), 4000)
  }

  const handleLogin = async (credentials) => {
    try {
      const logged = await loginService.login(credentials)
      dispatch(setUser(logged))
      blogService.setToken(logged.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(logged))
      showNotification(`Welcome ${logged.username}!`)
    } catch (error) {
      console.error('Login failed', error)
      showNotification('wrong username or password', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      const refreshed = await blogService.getAll()
      dispatch(initializeBlogs(refreshed))
      showNotification('Blog deleted!')
    } catch {
      showNotification('Blog deletion failed', 'error')
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      dispatch(addBlogAction(newBlog))
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added!`)
    } catch {
      showNotification('blog creation failed', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(clearUser())
  }

  const handleLike = async (updatedBlog) => {
    try {
      const saved = await blogService.update(updatedBlog.id, updatedBlog)
      dispatch(initializeBlogs(blogs.map((b) => (b.id === saved.id ? saved : b))))
    } catch {
      showNotification('Liking the blog failed', 'error')
    }
  }

  if (!user) {
    return (
      <div>
        <Notification />
        <h2>Login</h2>
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  const Main = (
    <div>
      <Notification />
      <h2>blogs</h2>

      {!showBlogForm ? (
        <button onClick={() => setShowBlogForm(true)}>create new blog</button>
      ) : (
        <div>
          <BlogForm
            createBlog={async (blog) => {
              await addBlog(blog)
              setShowBlogForm(false)
            }}
            onCancel={() => setShowBlogForm(false)}
          />
        </div>
      )}
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLike}
            onDelete={handleDelete}
            user={user}
          />
        ))}
    </div>
  )

  return (
    <Router>
      <div style={{ padding: 16 }}>
        <nav style={{ marginBottom: 12 }}>
          <Link to="/" style={{ marginRight: 12 }}>blogs</Link>
          <Link to="/users">users</Link>
        </nav>
        <div>
          <strong>{user.username}</strong> logged in
          <button onClick={handleLogout}>logout</button>
        </div>

        <Routes>
          <Route path="/" element={Main} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogPage currentUser={user} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App