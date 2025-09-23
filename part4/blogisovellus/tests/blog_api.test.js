const { test, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const assert = require('assert')
const mongoose = require('mongoose')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  { title: "blogi1", author: "mikael", url: "https://sivu.com", likes: 3 },
  { title: "blogi2", author: "mikael", url: "https://sivu.com", likes: 3 }
]

// ...rest of your code...
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('all blogs are returned', async () => {
  try {
    const response = await api.get('/api/blogs')
    console.log('GET /api/blogs response:', response.body)
    assert.strictEqual(response.body.length, initialBlogs.length)
  } catch (error) {
    console.error('Error in "all blogs are returned" test:', error)
    throw error
  }
})

test('blogs have id property, not _id', async () => {
  try {
    const response = await api.get('/api/blogs')
    console.log('GET /api/blogs response for id test:', response.body)
    response.body.forEach(blog => {
      assert(blog.id !== undefined, 'Blog is missing id property')
      assert(blog._id === undefined, 'Blog should not have _id property')
    })
  } catch (error) {
    console.error('Error in "blogs have id property, not _id" test:', error)
    throw error
  }
})

test('a valid blog can be added with POST', async () => {
  const newBlog = {
    title: "Uusi blogi",
    author: "Testaaja",
    url: "https://testi.com",
    likes: 5
  }

  // Lisää uusi blogi
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Hae kaikki blogit
  const response = await api.get('/api/blogs')
  console.log('Blogs after POST:', response.body)
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

after(async () => {
  await mongoose.connection.close()
})