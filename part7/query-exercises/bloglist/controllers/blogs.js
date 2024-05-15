const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const blog = await Blog
    .findById(id)
    .populate('user', { username: 1, name: 1 })
  response.json(blog)
})

blogsRouter.get('/:id/comments', async (request, response) => {
  const id = request.params.id

  const blog = await Blog
    .findById(id)
    .populate('user', { username: 1, name: 1 })
  response.json(blog)
})

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response, next) => {
  const { comment } = request.body
  console.log('this is comment', comment)
  const user = request.user
  const id = request.params.id

  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(400).json({ error: 'blog not found' })
  }

  if (!user) {
    return response.status(401).json({ error: 'please log in'})
  }

  blog.comments.push(comment)
  const updatedBlog = await blog.save()
  console.log('updatedBlog', updatedBlog)

  response.status(201).json(updatedBlog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'WE AINT GOTTA USER!' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
  
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const user = request.user

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).json('Deleted the entry!')
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes, user } = request.body
  console.log(request.body)
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes, user },
    { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter