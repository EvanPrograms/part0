const { test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const listHelper = require('../utils/list_helper')
const app = require('../app')
const blog = require('../models/blog')
const user = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
  await blog.deleteMany({})
  let blogObject = new blog(listHelper.initialBlogs[0])
  await blogObject.save()
  blogObject = new blog(listHelper.initialBlogs[1])
  await blogObject.save()
  blogObject = new blog(listHelper.initialBlogs[2])
  await blogObject.save()

  await user.deleteMany({})
  await api.post('/api/users').send(listHelper.singleUser[0])
  // let userObject = new user(listHelper.singleUser[0])
  // await userObject.save()
})



describe('total likes', () => {
  test('when list is empty', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual((result), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    assert.strictEqual((result), 5)
  })

  test('Testing all the blogs', () => {
    const result = listHelper.totalLikes(listHelper.blogs)
    assert.strictEqual((result), 36)
  })
})

describe('favorite blog', () => {
test('when list is empty', () => {
  const result = listHelper.favoriteBlog([])
  assert.strictEqual((result), undefined)
})

test('when list has only one blog', () => {
  const result = listHelper.favoriteBlog(listHelper.listWithOneBlog)
  assert.strictEqual((result), listHelper.listWithOneBlog[0])
})

  test('Finding the most liked blog', () => {
    const result = listHelper.favoriteBlog(listHelper.blogs)
    assert.strictEqual((result), listHelper.blogs[2])
  })
})

describe('Returns author with most blogs', () => {
  test('When list is empty', () => {
    const result = listHelper.mostBlogs([])
    assert.deepEqual((result), 'Empty list')
  })

  test('when list has one entry', () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
    assert.deepEqual((result), { author: listHelper.listWithOneBlog[0].author, blogs: listHelper.listWithOneBlog.length})
  })

  test('Returning blog with most votes')
    const result = listHelper.mostBlogs(listHelper.blogs)
    assert.deepEqual((result), { author: 'Robert C. Martin', blogs: 3 })
})

describe('Return author with most likes and their total likes', () => {
test('when list is empty', () => {
  const result = listHelper.mostLikes([])
  assert.deepEqual((result), 'Empty List')
})

test('When list has only one entry', () => {
  const result = listHelper.mostLikes(listHelper.listWithOneBlog)
  assert.deepEqual((result), { author: listHelper.listWithOneBlog[0].author, likes: listHelper.listWithOneBlog[0].likes})
})

  test('Returning author with total likes')
  const result = listHelper.mostLikes(listHelper.blogs)
  assert.deepEqual((result), { author: "Edsger W. Dijkstra", likes: 17 })
})

describe(
  'Verify blog list application returns correct JSON from requests', 
  () => {
    test('Response length from non-empty database', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, listHelper.initialBlogs.length)
    })

    test('Verifies unique ID property of blog posts is named id', async () => {
      const response = await api.get('/api/blogs')
      for (const x in response.body) {
        assert(response.body[x].id, true)
      }
    })

    test('Verify making an HTTP request creates new blog post', async () => {
      const newBlog = {
        title: "HTTP Test Request",
        author: "SUPERTEST",
        url: "www.verifyNewBlog.com",
        likes: 101,
      }

      const response = await api
        .post('/api/login')
        .send({ username: listHelper.singleUser[0].username, password: listHelper.singleUser[0].password })
      const token = response.body.token

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)
    
      const blogsAtEnd = await listHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(b => b.author)
      assert(contents.includes('SUPERTEST'))
    })

    test('If likes is missing, default to 0', async () => {
      const newBlog = {
        title: "Missing Likes Request",
        author: "Likes should be zero",
        url: "www.no likes submitted.com"
      }

      const response = await api
        .post('/api/login')
        .send({ username: listHelper.singleUser[0].username, password: listHelper.singleUser[0].password })
      const token = response.body.token

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)
    
      const blogsAtEnd = await listHelper.blogsInDb()

      const testBlog = blogsAtEnd.filter(b => b.title === "Missing Likes Request")
      assert(testBlog[0].likes === 0)
    })

    test('Verify POST request with missing title or url is 400 bad request ', async () => {
      const newBlog = {
        author: "Missing title and URL!"
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-type', /application\/json/)

      const response = await listHelper.blogsInDb()

      assert.strictEqual(response.length, listHelper.initialBlogs.length)
    })

    test('Verify that deleting a blog works', async () => {
      const responseStart = await listHelper.blogsInDb()
      const id = responseStart[0].id

      const response = await api
        .post('/api/login')
        .send({ username: listHelper.singleUser[0].username, password: listHelper.singleUser[0].password })
      const token = response.body.token

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const responseEnd = await listHelper.blogsInDb()
      assert.strictEqual(responseEnd.length, listHelper.initialBlogs.length - 1)
    })

    test('PUT request to update an entry', async () => {
      const responseStart = await listHelper.blogsInDb()
      const id = responseStart[0].id
      const updateLikes = 15
      const testBlog = {
        likes: updateLikes
        }
      
      await api
        .put(`/api/blogs/${id}`)
        .send(testBlog)
        .expect(201)

      const responseEnd = await listHelper.blogsInDb()
      assert.strictEqual(responseEnd[0].likes, updateLikes)
    })
  }
)

describe('Tests for adding correctly formatted users', () => {
  test('Username has less than 3 characters', async () => {
    const newUser = {
      username: "aa",
      password: "password"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)


    const response = await listHelper.usersInDb()
    assert.strictEqual(response.length, listHelper.singleUser.length) 
  })

  test('Password has less than 3 characters', async () => {
    const newUser = {
      username: "good name",
      password: "1"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(403)
      .expect('Content-type', /application\/json/)

    const response = await listHelper.usersInDb()
    assert.strictEqual(response.length, listHelper.singleUser.length)
  })

  test('username not provided', async () => {
    const newUser = {
      password: "good password"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    const response = await listHelper.usersInDb()
    assert.strictEqual(response.length, listHelper.singleUser.length)
  })

  test('Password not provided', async () => {
    const newUser = {
      username: "good name"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(403)
      .expect('Content-type', /application\/json/)

    const response = await listHelper.usersInDb()
    assert.strictEqual(response.length, listHelper.singleUser.length)
  })

  test('Username is not unique', async () => {
    const newUser = {
      username: listHelper.singleUser.username,
      password: "password"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    const response = await listHelper.usersInDb()
    assert.strictEqual(response.length, listHelper.singleUser.length)
  })

  test('Successful add operation', async () => {
    const newUser = {
      username: "Good name",
      password: "Good password"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const response = await listHelper.usersInDb()
    assert.strictEqual(response.length, listHelper.singleUser.length + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})

