const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLBoolean } = require('graphql')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    dummy: Int
    bookCount: Int
    authorCount: Int
    allBooks(author: String, published: Int, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String!]!
    ): Book
    editAuthor(
      name: String
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    dummy: () => 0,
    // bookCount: () => books.length,
    bookCount: async () => Book.collection.countDocuments(),
    // authorCount: () => authors.length,
    authorCount: async () => Author.collection.countDocuments(),
    // allBooks: (_, { author, genre }) => {
    allBooks: async (root, args) => {
      const authorFilter = args.author
        ? { author: await Author.findOne({ name: args.author }) }
        : {}
      const genreFilter = args.genre ? { genres: { $in: args.genre } } : {}
      return Book.find({ ...authorFilter, ...genreFilter }).populate('author')
      // if (args.author && args.genre) {
      //   const authorBooks = books.filter(book => book.author === args.author)
      //   return authorBooks.filter(book => book.genres.includes(args.genre))
      // } else if (args.author) {
      //   return books.filter(book => book.author === args.author)
      // } else if (args.genre) {
      //   return books.filter(book => book.genres.includes(args.genre))
      // } else {
      //   return books
      // }

      // try {
      //   let filteredBooks = books

      //   if (args.author) {
      //     filteredBooks = filteredBooks.filter(book => book.author === args.author)
      //   }

      //   if (args.genre) {
      //     filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre))
      //   }

      //   // return filteredBooks.map(book => ({
      //   //   ...book,
      //   //   author: {name: book.author}
      //   // }))
      //   return Book.find({})
      // } catch (error) {
      //   throw new GraphQLError('Failed to fetch books', {
      //     extensions: {
      //       code: 'INTERNAL_SERVER_ERROR',
      //       error
      //     }
      //   })
      // }
    },
    allAuthors: async () => {
      // return authors.map(author => {
      //   const authorbooks = books.filter(book => book.author === author.name)
      //   return {
      //     name: author.name,
      //     born: author.born,
      //     bookCount: authorbooks.length
      //   }
      // })
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return Book.collection.countDocuments({ author: root._id })
    },
  },
  // Book: {
  //   author: async (root, args, context) => {
  //     try {
  //       // const author = await Author.findById(root.author)
  //       const author = await Author.findOne({ name: root.author })
  //       console.log('backend author', author)
  //       if (!author) {
  //         throw new Error(`Author '${root.author}' is not found`)
  //       }
  //       return author
  //     } catch (error) {
  //       // console.error('Error fetching author:', error)
  //       throw new GraphQLError('Failed to fetch author', {
  //         extensions: {
  //           code: 'BAD_USER_INPUT',
  //           invalidArgs: root.author
  //         }
  //       })
  //     }
  //   }
  // },
  Mutation: {
    addBook: async (root, args) => {
      try {
        if (args.title.length < 3) {
          throw new GraphQLError('Title is too short', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title
            }
          })
        }

        if (args.author.name.length < 3) {
          throw new GraphQLError('Author name is too short', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author.name
            }
          })
        }


        let author = await Author.findOne({ name: args.author })

        if (!author) {
          // author = { name: args.author, id: uuid() }
          author = new Author({ name: args.author })
          // authors = authors.concat(author)
          await author.save()
        }

        const book = new Book({
          title: args.title,
          author: author._id, // Use the author's ObjectId
          published: args.published,
          genres: args.genres
        })

        const savedBook = await book.save()
        return savedBook
      } catch (error) {
        throw new GraphQLError('Failed to add book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      // let author = authors.find(author => author.name === args.author)

      
      // const book = { ...args, id: uuid() }
      // const book = new Book({ ...args })
      // books = books.concat(book)
      // return book.save()
      
    },
    editAuthor: async (roots, args) => {
      try {
        const author = await Author.findOne({ name: args.name })

        if (!author) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }

        author.born = args.setBornTo
        await author.save()

        return author
      } catch (error) {
        throw new GraphQLError('Failed to edit author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    try {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.startsWith('Bearer ')) {
        const token = auth.substring(7);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decodedToken.id);
        
        if (!currentUser) {
          throw new Error('User not found');
        }
  
        return { currentUser };
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})