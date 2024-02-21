const { test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const listHelper = require('../utils/list_helper')
const app = require('../app')
const blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    url: "www.harrypotter.com",
    likes: 5,
    id: "65c9d9eff6305c4ebbbdd2b2"
  },
  {
    title: "The Matrix",
    author: "Cohen Brothers",
    url: "www.matrix.com",
    likes: 55,
    id: "65cb340051d04acc96838cdd"
  },
  {
    title: "Acid Test",
    author: "Tom Wolfe",
    url: "www.wolfoftom.com",
    likes: 3,
    id: "65cbfabe62b10598a0443edc"
  }
]

beforeEach(async () => {
  await blog.deleteMany({})
  let blogObject = new blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new blog(initialBlogs[2])
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
      assert.strictEqual(response.body.length, initialBlogs.length)
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
    })
  }
)

after(async () => {
  await mongoose.connection.close()
})

