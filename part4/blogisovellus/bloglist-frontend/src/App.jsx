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
    showNotification(`Welcome ${user.name}!`)
  } catch (error) {
    console.log('Login failed:', error)
    showNotification('wrong username or password', 'error')
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
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <BlogForm createBlog={addBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App