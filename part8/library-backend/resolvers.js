const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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
    me: async (root, args, context) => {
      // return context.currentUser
      const currentUser = context.currentUser
    
      if(!currentUser) {
        throw new GraphQLError('ME: User not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userWithFavoriteGenre = await User.findById(currentUser._id)

      if (!userWithFavoriteGenre) {
        throw new GraphQLError('ME: User not found', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      return userWithFavoriteGenre
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
    addBook: async (root, args, context) => {
      console.log('addbook resolver', args.title, args.author, args.genres, args.published)
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      
      if (args.title.length < 3) {
        throw new GraphQLError('Title is too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      if (args.author.length < 3) {
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

      // console.log('this is backend author ID', author._id)

      // const book = new Book({
      //   title: args.title,
      //   author: author._id, // Use the author's ObjectId
      //   published: args.published,
      //   genres: args.genres
      // })
      // // console.log('this is backend savedbook', savedBook)
      // const savedBook = await book.save()
      // return savedBook
      try {
        // const book = await Book.create({ ...args, author: author._id })
        // const populatedBook = await book.populate('author')
        // pubsub.publish('BOOK_ADDED', { bookAdded: populatedbook })
        // return populatedBook

        const book = new Book({
          title: args.title,
          author: author._id, // Use the author's ObjectId
          published: args.published,
          genres: args.genres
        });
        const savedBook = await book.save();
        const populatedBook = await savedBook.populate('author');
  
        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook });
  
        return populatedBook;
      } catch (error) {
        throw new GraphQLError('Failed to add book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      // pubsub.publish('BOOK_ADDED', { bookAdded: populatedbook })

      // return populatedBook


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
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers