import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
  const [showBlogForm, setShowBlogForm] = useState(false)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 4000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      showNotification(`Welcome ${user.username}!`)
    } catch (error) {
      console.log('Login failed:', error)
      showNotification('wrong username or password', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      showNotification('Blog deleted!')
    } catch (error) {
      console.log('Blog deletion failed:', error)
      console.log(id)
      showNotification('Blog deletion failed', 'error')
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added!`)
    } catch (error) {
      console.log('Blog creation failed:', error)
      showNotification('blog creation failed', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLike = (updatedBlog) => {
    setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
  }



  if (!user) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <h2>Login</h2>
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      <div>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
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
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLike}
            onDelete={handleDelete}
            user={user}
          />
        )
      }
    </div>
  )
}

export default App


