const Blog = require("../models/blog")
const User = require('../models/user')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const mostLiked = Math.max.apply(null, blogs.map((blog) => blog.likes))
  const index = blogs.findIndex(blog => blog.likes === mostLiked)
  return blogs[index]
}

const mostBlogs = (blogs) => {
  const array = []
  const count = {}
  blogs.forEach(blog => {
    if (count[blog.author]) {
      count[blog.author] += 1
    } else {
      count[blog.author] = 1
    }
  })

  for (let x in count) {
    array.push({ author: x, blogs: count[x]})
  }

  let maxBlog = array.reduce((max, author) => max.blogs > author.blogs ? max : 
  author, 'Empty list')
  return maxBlog
  }

const mostLikes = (blogs) => {
  const array = []
  const count = {}
  blogs.forEach(blog => {
    if (count[blog.author]) {
      count[blog.author] += blog.likes
    } else {
      count[blog.author] = blog.likes
    }
  })

  for (let x in count) {
    array.push({ author: x, likes: count[x]})
  }

  let maxLikes = array.reduce((max, author) => max.likes > author.likes ? max : author, 'Empty List')
  return maxLikes
}

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

const singleUser = [
  {
    username: "hellas",
    password: "password",
    name: "Artos Hellas"
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const postTest = (user, code) => {
    api
      .post('/api/users')
      .send(user)
      .expect(code)
      .expect('Content-type', /application\/json/)
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlogs,
  listWithOneBlog,
  blogsInDb,
  blogs,
  singleUser,
  usersInDb,
  postTest,
  initialUser
}