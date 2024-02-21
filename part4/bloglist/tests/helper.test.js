const { test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const listHelper = require('../utils/list_helper')
const app = require('../app')
const blog = require('../models/blog')


beforeEach(async () => {
  await blog.deleteMany({})
  let blogObject = new blog(listHelper.initialBlogs[0])
  await blogObject.save()
  blogObject = new blog(listHelper.initialBlogs[1])
  await blogObject.save()
  blogObject = new blog(listHelper.initialBlogs[2])
  await blogObject.save()
})

const api = supertest(app)

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('total likes', () => {
  test('when list is empty', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual((result), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual((result), 5)
  })

  test('Testing all the blogs', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual((result), 36)
  })
})

describe('favorite blog', () => {
test('when list is empty', () => {
  const result = listHelper.favoriteBlog([])
  assert.strictEqual((result), undefined)
})

test('when list has only one blog', () => {
  const result = listHelper.favoriteBlog(listWithOneBlog)
  assert.strictEqual((result), listWithOneBlog[0])
})

  test('Finding the most liked blog', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual((result), blogs[2])
  })
})

describe('Returns author with most blogs', () => {
  test('When list is empty', () => {
    const result = listHelper.mostBlogs([])
    assert.deepEqual((result), 'Empty list')
  })

  test('when list has one entry', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepEqual((result), { author: listWithOneBlog[0].author, blogs: listWithOneBlog.length})
  })

  test('Returning blog with most votes')
    const result = listHelper.mostBlogs(blogs)
    assert.deepEqual((result), { author: 'Robert C. Martin', blogs: 3 })
})

describe('Return author with most likes and their total likes', () => {
test('when list is empty', () => {
  const result = listHelper.mostLikes([])
  assert.deepEqual((result), 'Empty List')
})

test('When list has only one entry', () => {
  const result = listHelper.mostLikes(listWithOneBlog)
  assert.deepEqual((result), { author: listWithOneBlog[0].author, likes: listWithOneBlog[0].likes})
})

  test('Returning author with total likes')
  const result = listHelper.mostLikes(blogs)
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

      await api
        .post('/api/blogs')
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

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)
    
      const blogsAtEnd = await listHelper.blogsInDb()

      const testBlog = blogsAtEnd.filter(b => b.title === "Missing Likes Request")
      assert(testBlog[0].likes === 0)
    })

    test('Verify POST request with missing title or url is 400 bad request ', async () => {
      const newBlog = {
        author: "MISSING TITLE AND URL"
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

      await api
        .delete(`/api/blogs/${id}`)
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

after(async () => {
  await mongoose.connection.close()
})

