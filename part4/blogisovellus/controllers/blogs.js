const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


// GET all blogs
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

// POST new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.userId)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: {
      name: user.name,
      id: user._id
    },
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter
