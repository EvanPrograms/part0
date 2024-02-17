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
  author)
  console.log(maxBlog)
  return maxBlog
  }


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}