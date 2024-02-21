const Blog = require("../models/blog")

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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlogs,
  blogsInDb
}